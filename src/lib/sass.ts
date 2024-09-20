import type { RawSourceMap } from './sourcemap';

import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import * as sass from 'sass-embedded';
import * as sourcemap from './sourcemap';

type Cache = {
  contents: string;
  watchFiles: string[];
  lastModified: number;
};

export type SassOptions = {
  /** https://sass-lang.com/documentation/js-api/interfaces/options/#loadPaths */
  depedencies?: string[];
  /** If true, sets [style](https://sass-lang.com/documentation/js-api/interfaces/options/#style) to `compressed` */
  minify?: boolean;
  /**
   * https://sass-lang.com/documentation/js-api/interfaces/options/#sourceMap
   * 
   * Enables [sourceMapIncludeSources](https://sass-lang.com/documentation/js-api/interfaces/options/#sourceMapIncludeSources) as well.
   * */
  sourcemap?: boolean;
  /** https://sass-lang.com/documentation/js-api/interfaces/options/#functions */
  plugins?: Record<string, sass.CustomFunction<'async'>>;
  /** https://sass-lang.com/documentation/js-api/interfaces/options/#importers */
  importers?: (sass.NodePackageImporter | sass.Importer<'async'>)[];
  alert?: {
    /** https://sass-lang.com/documentation/js-api/interfaces/options/#alertAscii */
    ascii?: boolean;
    /** https://sass-lang.com/documentation/js-api/interfaces/options/#alertColor */
    colour?: boolean;
  };
  deprecations?: {
    /** https://sass-lang.com/documentation/js-api/interfaces/options/#fatalDeprecations */
    fatal?: (sass.DeprecationOrId | sass.Version)[];
    /** https://sass-lang.com/documentation/js-api/interfaces/options/#futureDeprecations */
    future?: sass.DeprecationOrId[];
    /** https://sass-lang.com/documentation/js-api/interfaces/options/#silenceDeprecations */
    ignore?: sass.DeprecationOrId[];
  };
  /** https://sass-lang.com/documentation/js-api/interfaces/options/#quietDeps */
  quiet?: boolean;
  /** https://sass-lang.com/documentation/js-api/interfaces/options/#logger */
  logger?: sass.Logger;
  /** https://sass-lang.com/documentation/js-api/interfaces/options/#verbose */
  verbose?: boolean;
};

export type CompileResult = {
  css: string;
  depedencies: string[];
};

export default class Sass {
  private readonly _depedencies: string[];
  private readonly _sourcemap: boolean;
  private readonly _minify: boolean;
  private readonly _importers: (sass.NodePackageImporter | sass.Importer<'async'>)[];
  private readonly _cache: Map<string, Cache>;
  private readonly _quiet: boolean;
  private readonly _verbose: boolean;
  private readonly _plugins?: Record<string, sass.CustomFunction<'async'>>;
  private readonly _alert?: SassOptions['alert'];
  private readonly _deprecations?: SassOptions['deprecations'];
  private readonly _logger?: sass.Logger;

  private async _getLastModified(...files: string[]) {
    const stats = await Promise.all([...files, ...this._depedencies].map(x => fsp.stat(x)));
    return stats.reduce((acc, cur) => acc + cur.mtimeMs, 0);
  }

  protected _compile(file: string): Promise<Omit<sass.CompileResult, 'sourceMap'> & { sourceMap?: RawSourceMap }> {
    return sass.compileAsync(file, {
      style: this._minify ? 'compressed' : 'expanded',
      sourceMap: this._sourcemap,
      sourceMapIncludeSources: true,
      loadPaths: this._depedencies.map(dir => path.join(process.cwd(), dir)),
      functions: this._plugins,
      alertAscii: this._alert?.ascii,
      alertColor: this._alert?.colour,
      fatalDeprecations: this._deprecations?.fatal,
      futureDeprecations: this._deprecations?.future,
      silenceDeprecations: this._deprecations?.ignore,
      logger: this._logger,
      quietDeps: this._quiet,
      verbose: this._verbose,
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
      }, ...this._importers]
    });
  }

  constructor(options?: SassOptions) {
    this._depedencies = options?.depedencies ?? [];
    this._minify = !!options?.minify;
    this._sourcemap = !!options?.sourcemap;
    this._plugins = options?.plugins;
    this._importers = options?.importers ?? [];
    this._alert = options?.alert;
    this._deprecations = options?.deprecations;
    this._quiet = options?.quiet ?? false;
    this._verbose = options?.verbose ?? false;
    this._logger = options?.logger;

    this._cache = new Map();
  }

  async compile(file: string): Promise<CompileResult> {
    const cache = this._cache.get(file);
    const lastModified = await this._getLastModified(file, ...cache?.watchFiles ?? []);

    if (cache?.lastModified === lastModified) return { depedencies: cache.watchFiles, css: cache.contents };

    const { css, loadedUrls, sourceMap } = await this._compile(file);
    const watchFiles = loadedUrls.map(x => fileURLToPath(x));
    const contents = sourceMap ?
      `${css}\n${sourcemap.toUrl(sourceMap)}` :
      css;

    this._cache.set(file, {
      contents,
      watchFiles,
      // watchFiles will not be included in lastModified if cache is empty
      lastModified: cache ?
        lastModified :
        await this._getLastModified(file, ...watchFiles)
    });

    return { css: contents, depedencies: watchFiles };
  }
}