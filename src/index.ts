import type { Plugin } from 'esbuild';
import type { SassOptions } from './lib/sass.ts';

import sass from './lib/sass.ts';

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
          warnings: result.warnings?.map(warning => {
            if (!warning.options.span) return { text: warning.message };
            return {
              text: warning.message,
              location: {
                file: warning.options.span.url?.pathname ?? args.path,
                line: warning.options.span.start.line,
                column: warning.options.span.start.column,
                lineText: warning.options.span.text
              },
              detail: {
                deprecation: warning.options.deprecation,
                stack: warning.options.stack
              }
            };
          })
        };
      } catch (err) {
        return {
          watchFiles: options?.depedencies,
          errors: [{ text: (err as Error).message }]
        };
      }
    });

    build.onDispose(async () => {
      await context.dispose();
    });
  }
});
