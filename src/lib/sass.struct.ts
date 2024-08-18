import Sass, { SassOptions } from './sass';

export default class SassDebug extends Sass {
  compilations: number;

  async _compile(file: string) {
    const result = await super._compile(file);

    this.compilations += 1;

    return result;
  }

  constructor(options: SassOptions) {
    super(options);

    this.compilations = 0;
  }
}