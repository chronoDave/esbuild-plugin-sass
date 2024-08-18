import { build } from 'esbuild';
import path from 'path';
import fs from 'fs';

const outdir = path.join(process.cwd(), 'build');

build({
  entryPoints: fs.readdirSync('src', { recursive: true })
    .reduce((acc, cur) => {
      if (/\.spec\.ts$/u.test(cur)) acc.push(path.join('src', cur));
      return acc;
    }, []),
  outdir,
  bundle: true,
  external: [
    'tape',
    'sass-embedded'
  ],
  platform: 'node',
  format: 'esm',
  plugins: [{
    name: 'clean',
    setup: () => fs.rmSync(outdir, { force: true, recursive: true })
  }]
});
