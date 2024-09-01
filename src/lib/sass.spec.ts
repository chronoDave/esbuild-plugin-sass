import test from 'tape';
import fsp from 'fs/promises';
import path from 'path';

import Sass from './sass.struct';

test('[sass.compile] compiles sass file', async t => {
  const sass = new Sass({ depedencies: ['test/assets/lib'] });

  const { css } = await sass.compile(path.join(process.cwd(), 'test/assets/index.scss'));

  t.true(css && css?.length > 0, 'compiles css');

  t.end();
});

test('[sass.compile] caches results', async t => {
  const sass = new Sass({ depedencies: ['test/assets/lib'] });
  const file = path.join(process.cwd(), 'test/assets/index.scss');

  await sass.compile(file);
  await sass.compile(file);

  t.equal(sass.compilations, 1, 'returns cached result if unmodified');

  await fsp.utimes(file, Date.now() / 1000, Date.now() / 1000);
  await sass.compile(file);

  t.equal(sass.compilations, 2, 'returns fresh result if modified');

  t.end();
});

test('[sass.compile] returns sourcemap if enabled', async t => {
  const sass = new Sass({
    depedencies: ['test/assets/lib'],
    minify: false,
    sourcemap: true
  });

  const { css } = await sass.compile(path.join(process.cwd(), 'test/assets/index.scss'));

  if (typeof css === 'string') {
    t.true(css?.includes('sourceMappingURL'));
  } else {
    t.fail('did not return string');
  }

  t.end();
});

test('[sass.compile] returns depedencies', async t => {
  const sass = new Sass({ depedencies: ['test/assets/lib'] });

  const { depedencies } = await sass.compile(path.join(process.cwd(), 'test/assets/index.scss'));

  t.true(depedencies?.length ?? 0 > 0);

  t.end();
});
