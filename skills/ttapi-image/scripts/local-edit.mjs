#!/usr/bin/env node
// Prepare a documented JSON GPT Image 2 edit request; never calls an API.
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

async function dataUrl(path, mask = false) {
  const bytes = await readFile(path);
  let mime;
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) mime = 'image/png';
  else if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) mime = 'image/jpeg';
  else if (bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') mime = 'image/webp';
  else throw new Error('Use a readable PNG, JPEG or WebP source image.');
  if (mask && mime !== 'image/png') throw new Error('The local mask helper accepts PNG masks.');
  return `data:${mime};base64,${bytes.toString('base64')}`;
}

try {
  const args = process.argv.slice(2);
  if (args.length < 3 || args.length > 4 || !args[2].trim()) throw new Error('Usage: node scripts/local-edit.mjs SOURCE_IMAGE NEW_REQUEST_JSON "EDIT_PROMPT" [MASK_PNG]');
  const [source, destination, prompt, mask] = args;
  const request = { model: 'gpt-image-2', prompt, images: [{ image_url: await dataUrl(source) }], stream: false };
  if (mask) request.mask = { image_url: await dataUrl(mask, true) };
  await writeFile(destination, JSON.stringify(request, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  process.stdout.write(JSON.stringify({ requestFile: resolve(destination), operation: 'image2-edit', submitted: false }) + '\n');
} catch (error) {
  process.stderr.write(JSON.stringify({ error: error.message }) + '\n');
  process.exitCode = 1;
}
