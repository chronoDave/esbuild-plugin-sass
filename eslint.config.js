import { config, env } from '@chronocide/eslint-config';

export default [
  config.base,
  config.typescript,
  {
    languageOptions: {
      globals: {
        ...env.node
      }
    }
  }
];
