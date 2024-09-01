import type { SassOptions } from './lib/sass';
import type { Plugin } from 'esbuild';

import Sass from './lib/sass';

export default (options: SassOptions): Plugin => ({
  name: '@chronocide/esbuild-plugin-sass',
  setup: build => {
    const sass = new Sass(options);

    build.onLoad({ filter: /\.scss$/u }, async args => {
      try {
        const { css, depedencies } = await sass.compile(args.path);

        return {
          loader: 'css',
          watchFiles: depedencies,
          contents: css
        };
      } catch (err) {
        return {
          errors: [{
            text: (err as Error).message
          }]
        };
      }
    });
  }
});
