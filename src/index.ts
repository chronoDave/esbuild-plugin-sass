import type { SassOptions } from './lib/sass';
import type { Plugin } from 'esbuild';

import sass from './lib/sass';
import formatWarning from './lib/warning';

export type Options = SassOptions & {
  /** If true, returns CSS string */
  inline?: boolean;
};

export default (options?: Options): Plugin => ({
  name: '@chronocide/esbuild-plugin-sass',
  setup: async build => {
    const context = await sass.context(options);

    build.onLoad({ filter: /\.scss$/u }, async args => {
      try {
        const result = await context.compile(args.path);

        return {
          contents: result.css,
          watchFiles: [
            ...result.depedencies,
            ...options?.depedencies ?? []
          ],
          loader: options?.inline ? 'text' : 'css',
          warnings: result.warnings?.map(formatWarning(args.path))
        };
      } catch (err) {
        return {
          watchFiles: options?.depedencies,
          errors: [{ text: (err as Error).message }]
        };
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    build.onDispose(async () => {
      await context.dispose();
    });
  }
});
