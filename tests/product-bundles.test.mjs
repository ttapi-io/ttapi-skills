import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
import {EventEmitter} from 'node:events';
import {listSkills} from '../scripts/list-skills.mjs';
import {apiFetch,normalize,planRequest,request} from '../scripts/ttapi-runtime.mjs';

const skills=await listSkills();
const categories={
 image:['ttapi-midjourney-image','ttapi-midjourney-edit','ttapi-nano-banana','ttapi-openai-image','ttapi-novel-ai','ttapi-flux-image','ttapi-grok-image','ttapi-seedream'],
 video:['ttapi-midjourney-video','ttapi-grok-video','ttapi-happyhorse','ttapi-gemini-video','ttapi-flux3-video','ttapi-wan-video'],
 audio:['ttapi-suno','ttapi-flowmusic']
};
test('every requested product has a discoverable category-specific bundle, while existing entry points remain',()=>{
 for(const [category,names]of Object.entries(categories))for(const name of names)assert(skills.some(skill=>skill.name===name&&skill.category===category),`${category}/${name} is missing`);
 for(const name of ['ttapi-image','ttapi-video','ttapi-audio'])assert(skills.some(skill=>skill.name===name&&skill.category==='combined'));
 assert(!skills.some(skill=>/swapface|producer/i.test(skill.name)));
});

for(const skill of skills)if(skill.category!=='combined')test(`${skill.name} works as an isolated installed copy without sibling Skills or an API Key`,async()=>{
 const destination=await mkdtemp(join(tmpdir(),'ttapi-product-'));
 const installed=join(destination,skill.name);
 await cp(skill.directory,installed,{recursive:true});
 const {catalog}=await import(pathToFileURL(join(installed,'scripts/catalog.mjs')));
 const operation=Object.keys(catalog.operations)[0];
 assert(operation,'Product has no executable operation');
 const env={...process.env,TTAPI_API_KEY:''};
 const run=(...args)=>{
   const result=spawnSync(process.execPath,['scripts/ttapi.mjs',...args],{cwd:installed,env,encoding:'utf8',timeout:10000,maxBuffer:1024*1024});
   assert.equal(result.status,0,result.stderr||String(result.error||''));
   return JSON.parse(result.stdout);
 };
 assert.equal(run('models').skill,skill.name);
 assert(run('schema',operation).schema);
 const dry=run('submit',operation,'--input',`examples/${operation}.json`,'--dry-run');
 assert.equal(dry.dryRun,true);
 assert.equal(dry.request.headers['TT-API-KEY'],'[REDACTED]');
 assert.deepEqual(dry.request.body,JSON.parse(await readFile(join(installed,'examples',`${operation}.json`),'utf8')));
});

test('product result contracts prioritize documented task IDs and state fields over transport acknowledgements',()=>{
 const operation={taskIdPaths:['id','data.id'],statusPaths:['data.state'],statusMap:{WAITING:'queued'},assetPaths:['data.outputs.*.url'],poll:{method:'GET',path:'/task/{id}',idParam:'id',location:'path'}};
 const submitted=normalize({id:'actual-job',request_id:'trace-only',status:'SUCCESS',data:{state:'WAITING'}},operation,'test','submit');
 assert.equal(submitted.taskId,'actual-job');
 assert.equal(submitted.status,'queued');
 const completed=normalize({data:{id:'actual-job',state:'COMPLETED',outputs:[{url:'https://example.com/result.png'}]},status:'SUCCESS'},operation,'test','poll');
 assert.equal(completed.status,'succeeded');
 assert.equal(completed.assets[0].url,'https://example.com/result.png');
});

test('generated data-URI assets retain their MIME type without collecting source references',()=>{
 const raw={status:'SUCCESS',data:{image:'data:image/webp;base64,UklGRg==',source:'https://example.com/input.png'}};
 const result=normalize(raw,{assetPaths:['data.image']},'test');
 assert.equal(result.status,'succeeded');
 assert.deepEqual(result.assets,[{base64:'UklGRg==',mimeType:'image/webp'}]);
});

test('documented FLUX GET multipart polling retains both the HTTP method and body contract',async()=>{
 const operation={poll:{method:'GET',path:'/flux/fetch',location:'body',idParam:'jobId',bodyType:'multipart'}};
 const plan=planRequest(operation,undefined,'preserved-job-id');
 assert.equal(plan.method,'GET');
 assert.equal(plan.bodyType,'multipart');
 let call;
 await request(plan,{apiKey:'synthetic-test-key',fetchImpl:async(url,options)=>{call={url,options};return new Response('{"status":"SUCCESS"}');}});
 assert(call.options.body instanceof FormData);
 assert.equal(call.options.body.get('jobId'),'preserved-job-id');
 assert.equal(call.options.headers['TT-API-KEY'],'synthetic-test-key');
});

function mockHttps(status=200){
 const calls=[];
 const implementation=(url,options,onResponse)=>{
   const outgoing=new EventEmitter();
   outgoing.end=bytes=>{
     calls.push({url,options,body:bytes.toString('utf8')});
     const incoming=new EventEmitter();incoming.statusCode=status;incoming.rawHeaders=['Content-Type','application/json','Location','https://example.com/redirect'];
     onResponse(incoming);
     queueMicrotask(()=>{incoming.emit('data',Buffer.from('{"status":"SUCCESS"}'));incoming.emit('end');});
   };
   return outgoing;
 };
 return{implementation,calls};
}
test('the GET-body HTTPS adapter encodes a real multipart body and never follows redirects',async()=>{
 const body=new FormData();body.append('jobId','existing-job');
 const transport=mockHttps(302);
 const response=await apiFetch('https://api.ttapi.io/bfl/v1/fetch',{method:'GET',headers:{'TT-API-KEY':'synthetic-test-key'},body,signal:AbortSignal.timeout(10000)},transport.implementation);
 assert.equal(response.status,302);
 assert.equal(transport.calls.length,1);
 const call=transport.calls[0];
 assert.equal(call.options.method,'GET');
 assert.match(call.options.headers['content-type'],/^multipart\/form-data; boundary=/);
 assert.match(call.body,/name="jobId"\r\n\r\nexisting-job/);
 assert.equal(Number(call.options.headers['content-length']),Buffer.byteLength(call.body));
 assert.equal(call.options.headers['tt-api-key'],'synthetic-test-key');
});
test('the GET-body adapter rejects an external host before sending credentials',async()=>{
 const transport=mockHttps();
 const body=new FormData();body.append('jobId','x');
 await assert.rejects(apiFetch('https://example.com/fetch',{method:'GET',headers:{'TT-API-KEY':'synthetic-test-key'},body},transport.implementation),/Unsupported API host/);
 assert.equal(transport.calls.length,0);
});
