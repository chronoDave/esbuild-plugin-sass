export type RawSourceMap = {
  version: number;
  sources: string[];
  names: string[];
  sourceRoot?: string;
  sourcesContent?: string[];
  mappings: string;
  file: string;
};

export const toUrl = (x: RawSourceMap) => {
  const b64 = Buffer.from(JSON.stringify(x), 'utf-8').toString('base64');

  return `/*# sourceMappingURL=data:application/json;charset=utf-8;base64,${b64} */`;
};
