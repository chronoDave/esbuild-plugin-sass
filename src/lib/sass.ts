import type { OnLoadResult } from 'esbuild';
import type { RawSourceMap } from './sourcemap';

import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import * as sass from 'sass-embedded';
import * as sourcemap from './sourcemap';

type CompileResult = Omit<sass.CompileResult, 'sourceMap'> & {
  sourceMap?: RawSourceMap;
};

export type SassOptions = {
  depedencies?: string[];
  minify?: boolean;
  sourcemap?: boolean;
};

export default class Sass {
  private readonly _depedencies: string[];
  private readonly _sourcemap: boolean;
  private readonly _minify: boolean;

  protected _compile(file: string): Promise<CompileResult> {
    return sass.compileAsync(file, {
      style: this._minify ? 'compressed' : 'expanded',
      sourceMap: this._sourcemap,
      sourceMapIncludeSources: true,
      loadPaths: this._depedencies.map(dir => path.join(process.cwd(), dir)),
      importers: [{
        load: async url => ({
          contents: await fsp.readFile(fileURLToPath(url), 'utf-8'),
          syntax: url.pathname.endsWith('.scss') ? 'scss' : 'indented'
        }),
        canonicalize: url => {
          const dirs = [path.parse(file).dir, ...this._depedencies];

          for (const dir of dirs) {
            const file = path.join(dir, url);
            if (fs.existsSync(file)) return pathToFileURL(file);
          }

          return null;
        }
      }]
    });
  }

  constructor(options: SassOptions) {
    this._depedencies = options.depedencies ?? [];
    this._minify = !!options.minify;
    this._sourcemap = !!options.sourcemap;
  }

  async render(file: string): Promise<OnLoadResult> {
    try {
      const { css, loadedUrls, sourceMap } = await this._compile(file);
      const watchFiles = loadedUrls.map(x => fileURLToPath(x));
      const contents = sourceMap ?
        `${css}\n${sourcemap.toUrl(sourceMap)}` :
        css;

      return {
        loader: 'css',
        watchFiles,
        contents
      };
    } catch (err) {
      return {
        errors: [{
          text: (err as Error).message
        }]
      };
    }
  }
}