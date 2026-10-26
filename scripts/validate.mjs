import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { validateInput, planRequest } from './ttapi-runtime.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const canonical = await readFile(join(root, 'scripts/ttapi-runtime.mjs'), 'utf8');
let operations = 0;
for (const name of ['ttapi-image', 'ttapi-video', 'ttapi-audio']) {
  const directory = join(root, 'skills', name);
  const source = await readFile(join(directory, 'SKILL.md'), 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert(frontmatter, `${name}: missing YAML frontmatter`);
  assert(frontmatter[1].includes(`name: ${name}`), `${name}: incorrect name`);
  const description = frontmatter[1].match(/^description: (.+)$/m)?.[1];
  assert(description?.trim() && description.length <= 1024, `${name}: missing or overlong description`);
  assert(!/\[TODO:|TODO_REPLACE|PLACEHOLDER_SKILL/.test(source), `${name}: unfinished instructions`);
  assert.equal(await readFile(join(directory, 'scripts/ttapi.mjs'), 'utf8'), canonical, `${name}: runtime is stale; run npm run sync`);
  for (const match of source.matchAll(/\]\(([^)]+)\)/g)) {
    const link = match[1].split('#')[0];
    if (!link || /^[a-z]+:/i.test(link)) continue;
    const target = resolve(directory, link);
    assert(target.startsWith(`${directory}/`) || target.startsWith(`${directory}\\`), `${name}: reference escapes the installed Skill`);
    await access(target);
  }
  const { catalog } = await import(pathToFileURL(join(directory, 'scripts/catalog.mjs')).href);
  assert.equal(catalog.skill, name);
  for (const [id, operation] of Object.entries(catalog.operations)) {
    assert(/^[a-z0-9-]+$/.test(id), `Invalid operation ID ${id}`);
    assert(operation.docs?.every(url => url.startsWith('https://docs.ttapi.io/')), `${id}: missing official sources`);
    assert(!JSON.stringify(operation.schema).includes('"$ref"'), `${id}: schema must be self-contained`);
    validateInput(operation, operation.example);
    planRequest(operation, operation.example);
    if (operation.poll) planRequest(operation, undefined, 'sample-task-id');
    const example = JSON.parse(await readFile(join(directory, 'examples', `${id}.json`), 'utf8'));
    assert.deepEqual(example, operation.example, `${id}: example is stale; run npm run sync`);
    operations++;
  }
  process.stdout.write(`Validated ${name}\n`);
}
process.stdout.write(`Validated ${operations} documented operations and all independent bundles.\n`);
