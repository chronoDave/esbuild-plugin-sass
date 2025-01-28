import type { SassOptions } from './lib/sass';
import type { Plugin } from 'esbuild';

import Sass from './lib/sass';

export type Options = SassOptions & {
  /** If true, returns CSS string */
  inline?: boolean;
};

export default (options: Options): Plugin => ({
  name: '@chronocide/esbuild-plugin-sass',
  setup: build => {
    const sass = new Sass(options);

    build.onLoad({ filter: /\.scss$/u }, async args => {
      const { css, depedencies } = await sass.compile(args.path);

      return {
        loader: options.inline ? 'text' : 'css',
        watchFiles: depedencies,
        contents: css
      };
    });
  }
});
