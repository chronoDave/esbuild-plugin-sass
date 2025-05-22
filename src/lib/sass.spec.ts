import test from 'node:test';
import path from 'path';

import sass from './sass.ts';

test('[sass.compile] compiles sass file', async t => {
  const context = await sass.context({ depedencies: ['test/assets/lib'] });
  const { css } = await context.compile(path.join(process.cwd(), 'test/assets/index.scss'));

  t.assert.equal(css && css.length > 0, true, 'compiles css');

  await context.dispose();
});

test('[sass.compile] returns sourcemap if enabled', async t => {
  const context = await sass.context({
    depedencies: ['test/assets/lib'],
    minify: false,
    sourcemap: true
  });
  const { css } = await context.compile(path.join(process.cwd(), 'test/assets/index.scss'));

  if (typeof css === 'string') {
    t.assert.equal(css.includes('sourceMappingURL'), true);
  } else {
    t.assert.fail('did not return string');
  }

  await context.dispose();
});

test('[sass.compile] returns depedencies', async t => {
  const context = await sass.context({ depedencies: ['test/assets/lib'] });
  const { depedencies } = await context.compile(path.join(process.cwd(), 'test/assets/index.scss'));

  t.assert.equal(depedencies.length > 0, true);

  await context.dispose();
});

test('[sass.compile] returns urls as plaintext', async t => {
  const context = await sass.context();

  try {
    const { css } = await context.compile(path.join(process.cwd(), 'test/assets/components/image.scss'));

    t.assert.equal(css.includes('.png'), true, 'has plaintext link');
  } catch (err) {
    t.assert.fail(err as Error);
  }

  await context.dispose();
});
