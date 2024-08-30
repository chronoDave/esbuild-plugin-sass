import test from 'tape';
import path from 'path';

import Sass from './sass.struct';

test('[sass.render] renders sass file', async t => {
  const sass = new Sass({ depedencies: ['test/assets/lib'] });

  const { contents } = await sass.render(path.join(process.cwd(), 'test/assets/index.scss'));

  t.true(contents && contents?.length > 0, 'renders css');

  t.end();
});

test('[sass.render] returns sourcemap if enabled', async t => {
  const sass = new Sass({
    depedencies: ['test/assets/lib'],
    minify: false,
    sourcemap: true
  });

  const { contents } = await sass.render(path.join(process.cwd(), 'test/assets/index.scss'));

  if (typeof contents === 'string') {
    t.true(contents?.includes('sourceMappingURL'));
  } else {
    t.fail('did not return string');
  }

  t.end();
});

test('[sass.render] returns watchFiles', async t => {
  const sass = new Sass({ depedencies: ['test/assets/lib'] });

  const { watchFiles } = await sass.render(path.join(process.cwd(), 'test/assets/index.scss'));

  t.true(watchFiles?.length ?? 0 > 0);

  t.end();
});
