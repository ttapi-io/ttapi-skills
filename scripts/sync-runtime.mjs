import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import {listSkills} from './list-skills.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const runtime = await readFile(join(root, 'scripts', 'ttapi-runtime.mjs'), 'utf8');
for (const {name:skill,directory} of await listSkills()) {
  const { catalog } = await import(pathToFileURL(join(directory, 'scripts', 'catalog.mjs')).href);
  await writeFile(join(directory, 'scripts', 'ttapi.mjs'), runtime);
  await mkdir(join(directory, 'examples'), { recursive: true });
  for (const [name, operation] of Object.entries(catalog.operations)) {
    await writeFile(join(directory, 'examples', `${name}.json`), `${JSON.stringify(operation.example, null, 2)}\n`);
  }
  process.stdout.write(`Synced ${skill}\n`);
}
