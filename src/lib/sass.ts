import * as sass from 'sass-embedded';
import path from 'path';
import fs from 'fs';
import fsp from 'fs/promises';
import { fileURLToPath, pathToFileURL } from 'url';

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
  importers?: Array<sass.NodePackageImporter | sass.Importer<'async'>>;
  alert?: {
    /** https://sass-lang.com/documentation/js-api/interfaces/options/#alertAscii */
    ascii?: boolean;
    /** https://sass-lang.com/documentation/js-api/interfaces/options/#alertColor */
    colour?: boolean;
  };
  deprecations?: {
    /** https://sass-lang.com/documentation/js-api/interfaces/options/#fatalDeprecations */
    fatal?: Array<sass.DeprecationOrId | sass.Version>;
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

export type Warning = {
  message: string;
  options: (
    | {
      deprecation: true;
      deprecationType: sass.Deprecation;
    }
    | { deprecation: false }
  ) & { span?: sass.SourceSpan; stack?: string };
};

export type SassResult = {
  css: string;
  depedencies: string[];
  warnings?: Warning[];
};

export default class Sass {
  static async context(options?: SassOptions) {
    const compiler = await sass.initAsyncCompiler();

    return new Sass(compiler, options);
  }

  private readonly _compiler: sass.AsyncCompiler;
  private readonly _options?: SassOptions;

  private constructor(compiler: sass.AsyncCompiler, options?: SassOptions) {
    this._compiler = compiler;
    this._options = options;
  }

  /**
   * Compile raw CSS string
   * 
   * @see https://sass-lang.com/documentation/js-api/functions/compileasync/
  */
  async compile(root: string): Promise<SassResult> {
    const warnings: Warning[] = [];
    const importers = this._options?.importers ?? [];
    const result = await this._compiler.compileAsync(root, {
      style: this._options?.minify ? 'compressed' : 'expanded',
      sourceMap: this._options?.sourcemap,
      sourceMapIncludeSources: this._options?.sourcemap,
      loadPaths: this._options?.depedencies?.map(depedency => path.join(process.cwd(), depedency)),
      functions: this._options?.plugins,
      alertAscii: this._options?.alert?.ascii,
      alertColor: this._options?.alert?.colour,
      fatalDeprecations: this._options?.deprecations?.fatal,
      futureDeprecations: this._options?.deprecations?.future,
      silenceDeprecations: this._options?.deprecations?.ignore,
      logger: this._options?.logger ?? {
        warn: (message, options) => {
          warnings.push({ message, options });
        }
      },
      quietDeps: this._options?.quiet,
      verbose: this._options?.verbose,
      importers: [{
        load: async url => ({
          contents: await fsp.readFile(fileURLToPath(url), 'utf-8'),
          syntax: url.pathname.endsWith('.scss') ? 'scss' : 'indented'
        }),
        canonicalize: url => {
          const depedencies = this._options?.depedencies ?? [];
          const dirs = [root, ...depedencies];

          for (const dir of dirs) {
            const file = path.join(dir, url);

            if (fs.existsSync(file)) return pathToFileURL(file);
          }

          return null;
        }
      }, ...importers]
    });

    let { css } = result;
    if (this._options?.sourcemap) css += `\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,${Buffer.from(JSON.stringify(result.sourceMap), 'utf-8').toString('base64')} */`;

    return {
      css,
      warnings,
      depedencies: result.loadedUrls.map(url => fileURLToPath(url))
    };
  }

  /**
   * @see https://sass-lang.com/documentation/js-api/classes/asynccompiler/#dispose
   */
  async dispose() {
    return this._compiler.dispose();
  }
}