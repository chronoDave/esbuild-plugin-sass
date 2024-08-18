import type { OnLoadResult } from 'esbuild';

import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import * as sass from 'sass-embedded';

export type SassOptions = {
  depedencies?: string[];
};

export default class Sass {
  private readonly _cache: Map<string, { css: string; lastModified: number }>;
  private readonly _depedencies: string[];

  private async _getLastModified(file: string) {
    const stats = await Promise.all([file, ...this._depedencies].map(x => fsp.stat(x)));
    return stats.reduce((acc, cur) => acc + cur.mtimeMs, 0);
  }

  protected _compile(file: string) {
    return sass.compileAsync(file, {
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
    this._cache = new Map();
  }

  async render(file: string): Promise<OnLoadResult> {
    const cached = this._cache.get(file);
    const lastModified = await this._getLastModified(file);

    if (cached?.lastModified === lastModified) return { loader: 'css', contents: cached.css };

    try {
      const { css } = await this._compile(file);
      this._cache.set(file, { css, lastModified });

      return { loader: 'css', contents: css };
    } catch (err) {
      return {
        errors: [{
          text: (err as Error).message
        }]
      };
    }
  }
}