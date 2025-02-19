import type { SassOptions } from './lib/sass';
import type { PartialMessage, Plugin } from 'esbuild';

import fsp from 'fs/promises';

import sass from './lib/sass';
import formatWarning from './lib/warning';

export type Options = SassOptions & {
  /** If true, returns CSS string */
  inline?: boolean;
};

type Cache = {
  input: string;
  output: {
    css: string;
    depedencies: string[];
  };
};

export default (options?: Options): Plugin => ({
  name: '@chronocide/esbuild-plugin-sass',
  setup: async build => {
    const cache = new Map<string, Cache>();
    const context = await sass.context(options);

    build.onLoad({ filter: /\.scss$/u }, async args => {
      const raw = await fsp.readFile(args.path, 'utf-8');
      const cached = cache.get(args.path);

      const warnings: PartialMessage[] = [];
      const errors: PartialMessage[] = [];

      let output = cached?.output;
      if (!cached || cached.input !== raw) {
        try {
          const result = await context.compile(args.path);
          output = result;

          if (result.warnings) {
            result.warnings.map(formatWarning(args.path)).forEach(warning => {
              warnings.push(warning);
            });
          }

          cache.set(args.path, { input: raw, output });
        } catch (err) {
          errors.push({
            text: (err as Error).message
          });

          cache.delete(args.path);
        }
      }

      return {
        loader: options?.inline ? 'text' : 'css',
        errors,
        warnings,
        watchFiles: output?.depedencies,
        contents: output?.css
      };
    });

    build.onDispose(async () => {
      await context.dispose();
    });
  }
});
