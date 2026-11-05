#!/usr/bin/env node
/**
 * Umbral de errores de TypeScript (I-01).
 *
 * `next.config.ts` todavía tiene `typescript.ignoreBuildErrors: true`. Mientras se bajan los errores existentes, este
 * script impide que aparezcan nuevos: ejecuta `tsc --noEmit`, cuenta los errores por archivo (sin `.next/`) y falla si
 * el total o el de algún archivo supera lo registrado en `tsc-baseline.json`.
 *
 *   node scripts/check-tsc-baseline.mjs           -> verifica (lo usa CI)
 *   node scripts/check-tsc-baseline.mjs --update  -> guarda los conteos actuales como nuevo umbral
 *                                                    (sólo si no suben: el umbral nunca puede subir)
 *
 * Cuando el total llegue a 0, quitar `ignoreBuildErrors` de next.config.ts y este script.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE_FILE = path.join(ROOT, 'tsc-baseline.json');
const update = process.argv.includes('--update');

const require = createRequire(import.meta.url);

// next-env.d.ts y .next/types no se versionan: se generan igual en local y en CI antes de contar
const typegen = spawnSync(process.execPath, [require.resolve('next/dist/bin/next'), 'typegen'], {
  cwd: ROOT,
  encoding: 'utf8',
});
if (typegen.status !== 0) {
  console.error(`next typegen falló:\n${typegen.stdout}${typegen.stderr}`);
  process.exit(1);
}

const tscBin = require.resolve('typescript/bin/tsc');
const result = spawnSync(process.execPath, [tscBin, '--noEmit', '--pretty', 'false', '-p', ROOT], {
  cwd: ROOT,
  encoding: 'utf8',
  maxBuffer: 256 * 1024 * 1024,
});
if (result.error) throw result.error;

// Sólo archivos versionados (los locales o ignorados por git no existen en CI)
const gitFiles = spawnSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const tracked = gitFiles.status === 0 ? new Set(gitFiles.stdout.split(/\r?\n/).filter(Boolean)) : null;

const counts = {};
for (const line of `${result.stdout}\n${result.stderr}`.split(/\r?\n/)) {
  const match = /^(.+?)\(\d+,\d+\): error TS\d+:/.exec(line);
  if (!match) continue;
  const file = match[1].replace(/\\/g, '/');
  if (file.startsWith('.next/')) continue; // tipos generados por Next (no versionados)
  if (tracked && !tracked.has(file)) continue;
  counts[file] = (counts[file] ?? 0) + 1;
}
const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
const sorted = Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));

const baseline = existsSync(BASELINE_FILE)
  ? JSON.parse(readFileSync(BASELINE_FILE, 'utf8'))
  : { total: Infinity, files: {} };

const worse = Object.entries(counts)
  .filter(([file, n]) => n > (baseline.files[file] ?? 0))
  .map(([file, n]) => `  ${file}: ${baseline.files[file] ?? 0} -> ${n}`);

if (update) {
  if (total > baseline.total) {
    console.error(`No se actualiza el umbral: hay ${total} errores y el umbral es ${baseline.total} (no puede subir).`);
    process.exit(1);
  }
  writeFileSync(BASELINE_FILE, `${JSON.stringify({ total, files: sorted }, null, 2)}\n`);
  console.log(`Umbral actualizado: ${total} errores de TypeScript (antes ${baseline.total}).`);
  process.exit(0);
}

if (total > baseline.total || worse.length > 0) {
  console.error(`Errores de TypeScript: ${total} (umbral ${baseline.total}).`);
  if (worse.length > 0) console.error(`Archivos con más errores que en el umbral:\n${worse.join('\n')}`);
  console.error('Corrige los errores nuevos. Si bajaste errores, actualiza el umbral con: npm run typecheck:update');
  process.exit(1);
}

const fixed = baseline.total - total;
console.log(`TypeScript: ${total} errores (umbral ${baseline.total}).${fixed > 0 ? ` Bajaron ${fixed}: ejecuta npm run typecheck:update para fijar el nuevo umbral.` : ''}`);
