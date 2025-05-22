import test from 'node:test';
import fs from 'fs';
import path from 'path';

import struct from './index.struct.ts';

test('[esbuild-plugin-sass] transforms scss into css', async t => {
  const { build, cleanup } = struct();
  const input = 'test/assets/index.scss';

  try {
    await build([input], { depedencies: ['test/assets/lib'] });

    const out = path.resolve(process.cwd(), 'tmp/index.css');
    t.assert.equal(fs.existsSync(out), true, 'writes file');
  } catch (err) {
    t.assert.fail(err as Error);
  } finally {
    await cleanup();
  }
});
