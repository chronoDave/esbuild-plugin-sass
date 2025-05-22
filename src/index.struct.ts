import type { Options } from './index.ts';

import esbuild from 'esbuild';
import path from 'path';
import fsp from 'fs/promises';

import sass from './index.ts';

export default () => {
  const outdir = 'tmp';
  const root = path.join(process.cwd(), outdir);

  return {
    root,
    outdir,
    cleanup: async () => fsp.rm(root, { recursive: true, force: true }),
    build: async (entryPoints: string[], options?: Options) => esbuild.build({
      entryPoints,
      plugins: [sass(options)],
      outdir
    })
  };
};
