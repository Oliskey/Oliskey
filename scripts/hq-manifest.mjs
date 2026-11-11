// Content hashes for everything under public/hq, so a changed 3D file gets a new URL (?v=hash) and phones never mix
// new code with an old cached file (/hq/ is cached for a week). Runs before every build.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
const root = new URL('../public', import.meta.url).pathname;
const out = {};
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else out['/' + relative(root, p)] = createHash('md5').update(readFileSync(p)).digest('hex').slice(0, 10);
  }
};
walk(join(root, 'hq'));
writeFileSync(new URL('../src/three/hqManifest.json', import.meta.url), JSON.stringify(out, null, 0) + '\n');
console.log('hq manifest:', Object.keys(out).length, 'files');
