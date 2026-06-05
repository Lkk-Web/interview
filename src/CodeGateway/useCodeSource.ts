import { useMemo } from 'react';
import { mockCodeSourceMap } from './mock';
import type { CodeSource, UseCodeSourceOptions, UseCodeSourceResult } from './types';

const DEFAULT_PAGE_KEY = 'summary-editor';

function getSourceKey(pageKey: string, codeKey: string) {
  return `${pageKey}:${codeKey}`;
}

export function resolveCodeSource({
  pageKey = DEFAULT_PAGE_KEY,
  codeKey,
}: UseCodeSourceOptions): CodeSource | undefined {
  return mockCodeSourceMap[getSourceKey(pageKey, codeKey)];
}

export function useCodeSource(options: UseCodeSourceOptions): UseCodeSourceResult {
  return useMemo(() => {
    const data = resolveCodeSource(options);
    return {
      data,
      loading: false,
      error: data ? undefined : new Error(`未找到 codeKey: ${options.codeKey}`),
    };
  }, [options.pageKey, options.codeKey]);
}
