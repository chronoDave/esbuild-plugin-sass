import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';

const input = 'src/index.ts';
const output = type => `dist/esbuild-plugin-sass.${type}`;

export default [{
  input,
  plugins: [
    esbuild({
      target: 'esnext'
    })
  ],
  external: [
    'path',
    'fs/promises',
    'sass-embedded',
    'fs',
    'url',
    'esbuild'
  ],
  output: [{
    file: output('js'),
    exports: 'auto',
    format: 'esm'
  }, {
    file: output('cjs'),
    exports: 'auto',
    format: 'cjs'
  }]
}, {
  input,
  plugins: [dts()],
  output: {
    file: output('d.ts'),
    format: 'esm'
  }
}];
