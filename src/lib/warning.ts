import type { PartialMessage } from 'esbuild';
import type { Warning } from './sass';

/**
 * `sass` warning message to `esbuild` format
 */
export default (file?: string) => (warning: Warning): PartialMessage => {
  if (!warning.options.span) return { text: warning.message };
  return {
    text: warning.message,
    location: {
      file: warning.options.span.url?.pathname ?? file,
      line: warning.options.span.start.line,
      column: warning.options.span.start.column,
      lineText: warning.options.span.text
    },
    detail: {
      deprecation: warning.options.deprecation,
      stack: warning.options.stack
    }
  };
};
