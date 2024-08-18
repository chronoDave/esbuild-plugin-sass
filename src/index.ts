import type { SassOptions } from './lib/sass';
import type { Plugin } from 'esbuild';

import Sass from './lib/sass';

export default (options: SassOptions): Plugin => ({
  name: '@chronocide/esbuild-plugin-sass',
  setup: build => {
    const sass = new Sass(options);

    build.onLoad({ filter: /\.scss$/u }, args => sass.render(args.path));
  }
});
