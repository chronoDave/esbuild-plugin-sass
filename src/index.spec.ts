import test from 'tape';
import fs from 'fs';
import path from 'path';

import struct from './index.struct';

test('[esbuild-plugin-sass] transforms scss into css', async t => {
  const { build, cleanup } = struct();
  const input = 'test/assets/index.scss';

  try {
    await build([input], { depedencies: ['test/assets/lib'] });

    const out = path.resolve(process.cwd(), 'tmp/index.css');
    t.true(fs.existsSync(out), 'writes file');
  } catch (err) {
    t.fail((err as Error).message);
  } finally {
    await cleanup();
  }

  t.end();
});
