import test from 'tape';
import path from 'path';

import sass from './sass';

test('[sass.compile] compiles sass file', async t => {
  const context = await sass.context({ depedencies: ['test/assets/lib'] });
  const { css } = await context.compile(path.join(process.cwd(), 'test/assets/index.scss'));

  t.true(css && css.length > 0, 'compiles css');

  await context.dispose();

  t.end();
});

test('[sass.compile] returns sourcemap if enabled', async t => {
  const context = await sass.context({
    depedencies: ['test/assets/lib'],
    minify: false,
    sourcemap: true
  });
  const { css } = await context.compile(path.join(process.cwd(), 'test/assets/index.scss'));

  if (typeof css === 'string') {
    t.true(css.includes('sourceMappingURL'));
  } else {
    t.fail('did not return string');
  }

  await context.dispose();

  t.end();
});

test('[sass.compile] returns depedencies', async t => {
  const context = await sass.context({ depedencies: ['test/assets/lib'] });
  const { depedencies } = await context.compile(path.join(process.cwd(), 'test/assets/index.scss'));

  t.true(depedencies.length > 0);

  await context.dispose();

  t.end();
});

test('[sass.compile] returns urls as plaintext', async t => {
  const context = await sass.context();

  try {
    const { css } = await context.compile(path.join(process.cwd(), 'test/assets/components/image.scss'));

    t.true(css.includes('.png'), 'has plaintext link');
  } catch (err) {
    t.fail((err as Error).message);
  }

  await context.dispose();

  t.end();
});
