<div align="center">
  <h1>@chronocide/esbuild-plugin-sass</h1>
  <p><a href="https://sass-lang.com/">Sass</a> plugin for <a href="https://esbuild.github.io/">esbuild</a>.</p>
</div>

<div align="center">
  <a href="/LICENSE">
    <img alt="License GPLv3" src="https://img.shields.io/badge/license-GPLv3-blue.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@chronocide/esbuild-plugin-sass">
    <img alt="NPM" src="https://img.shields.io/npm/v/@chronocide/esbuild-plugin-sass?label=npm">
  </a>
  <a href="https://packagephobia.com/result?p=@chronocide/esbuild-plugin-sass">
    <img alt="Install size" src="https://packagephobia.com/badge?p=@chronocide/esbuild-plugin-sass">
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

Supports most [sass](https://sass-lang.com/documentation/js-api/interfaces/options/) options.

| Option | Type | Default
| - | - | - |
| [`depedencies`](https://sass-lang.com/documentation/js-api/interfaces/options/#loadPaths) | `string[]` | `[]` |
| [`minify`](https://sass-lang.com/documentation/js-api/interfaces/options/#style) | `boolean` | `false` |
| [`sourcemap`](https://sass-lang.com/documentation/js-api/interfaces/options/#sourceMap) | `boolean` | `false` |
| [`plugins`](https://sass-lang.com/documentation/js-api/interfaces/options/#functions) | `Record<string, sass.CustomFunction<'async'>>` | `undefined` |
| [`importers`](https://sass-lang.com/documentation/js-api/interfaces/options/#importers) | `(sass.NodePackageImporter \| sass.Importer<'async'>)[]` | `[]` |
| [`alert.ascii`](https://sass-lang.com/documentation/js-api/interfaces/options/#alertAscii) | `boolean` | `undefined` |
| [`alert.colour`](https://sass-lang.com/documentation/js-api/interfaces/options/#alertColor) | `boolean` | `undefined` |
| [`deprecations.fatal`](https://sass-lang.com/documentation/js-api/interfaces/options/#fatalDeprecations) | `(sass.DeprecationOrId \| sass.Version)[]` | `undefined` |
| [`deprecations.future`](https://sass-lang.com/documentation/js-api/interfaces/options/#futureDeprecations) | `sass.DeprecationOrId[]` | `undefined` |
| [`deprecations.ignore`](https://sass-lang.com/documentation/js-api/interfaces/options/#silenceDeprecations) | `sass.DeprecationOrId[]` | `undefined` |
| [`quiet`](https://sass-lang.com/documentation/js-api/interfaces/options/#quietDeps) | `boolean` | `undefined` |
| [`logger`](https://sass-lang.com/documentation/js-api/interfaces/options/#logger) | `sass.Logger` | `undefined` |
| [`verbose`](https://sass-lang.com/documentation/js-api/interfaces/options/#verbose) | `boolean` | `undefined` |
