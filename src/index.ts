import type { SassOptions } from './lib/sass';
import type { Plugin } from 'esbuild';

import Sass from './lib/sass';

export default (options: SassOptions): Plugin => ({
  name: '@chronocide/esbuild-plugin-sass',
  setup: build => {
    const sass = new Sass(options);

    build.onLoad({ filter: /\.scss$/u }, async args => {
      const { css, depedencies } = await sass.compile(args.path);

      return {
        loader: 'css',
        watchFiles: depedencies,
        contents: css
      };
    });
  }
});
