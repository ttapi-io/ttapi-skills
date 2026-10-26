import {readdir,access} from 'node:fs/promises';
import {dirname,join,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
export const root=dirname(dirname(fileURLToPath(import.meta.url)));
export async function listSkills(directory=join(root,'skills')) {
  const result=[];
  async function walk(current) {
    try { await access(join(current,'SKILL.md'));result.push({directory:current,name:relative(join(root,'skills'),current).split(/[\\/]/).at(-1),category:relative(join(root,'skills'),current).split(/[\\/]/).length===1?'combined':relative(join(root,'skills'),current).split(/[\\/]/)[0]});return; } catch {}
    for(const entry of (await readdir(current,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name)))if(entry.isDirectory())await walk(join(current,entry.name));
  }
  await walk(directory);
  return result;
}
