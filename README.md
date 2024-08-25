<div align="center">
  <h1>@chronocide/esbuild-plugin-sass</h1>
  <p><a href="https://sass-lang.com/">SASS</a> plugin for <a href="https://esbuild.github.io/">esbuild</a>.</p>
</div>

<div align="center">
  <a href="/LICENSE">
    <img alt="License GPLv3" src="https://img.shields.io/badge/license-GPLv3-blue.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@chronocide/spider">
    <img alt="NPM" src="https://img.shields.io/npm/v/@chronocide/spider?label=npm">
  </a>
  <a href="https://packagephobia.com/result?p=@chronocide/spider">
    <img alt="Bundle size" src="https://packagephobia.com/badge?p=@chronocide/spider">
  </a>
</div>

## Why?

[`esbuild-sass-plugin`](https://github.com/glromeo/esbuild-sass-plugin) makes use of [`tea`](https://github.com/glromeo/esbuild-sass-plugin/blob/main/tea.yaml), which is a [crypto scam](https://www.web3isgoinggreat.com/?collection=teaxyz). I do not wish to support such packages and therefore made my own.

## Installation

Install using [npm](npmjs.org):

```sh
npm i @chronocide/esbuild-plugin-sass -D
```

## Usage

```JS
import esbuild from 'esbuild';
import sass from 'esbuild-plugin-sass';

esbuild.build({
  ...
  plugins: [sass()]
});
```

### Options

| Option | Type | Default
| - | - | - |
| `depedencies` | `string[]` | `[]` |
| `minify` | `boolean` | `false` |
| `sourcemap` | `boolean` | `false` |

#### `depedencies`

List of paths used by rules like `@use` and `@import`, similar to [`loadPaths`](https://sass-lang.com/documentation/js-api/interfaces/options/#loadPaths).

```JS
import esbuild from 'esbuild';
import sass from 'esbuild-plugin-sass';

esbuild.build({
  ...
  plugins: [sass({
    depedencies: ['src/scss/lib']
  })]
});
```

#### `minify`

Minifies output, similar to [`style`](https://sass-lang.com/documentation/js-api/interfaces/options/#style).

```JS
import esbuild from 'esbuild';
import sass from 'esbuild-plugin-sass';

esbuild.build({
  ...
  plugins: [sass({
    minify: true
  })]
});
```

#### `sourcemap`

Generates sourcemap, similar to [`sourceMap`](https://sass-lang.com/documentation/js-api/interfaces/options/#sourceMap). Sourcemaps will always be generated inline and [include sources](https://sass-lang.com/documentation/js-api/interfaces/options/#sourceMapIncludeSources).

```JS
import esbuild from 'esbuild';
import sass from 'esbuild-plugin-sass';

esbuild.build({
  ...
  plugins: [sass({
    sourcemap: true
  })]
});
```
