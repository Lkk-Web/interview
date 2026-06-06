import { useMemo } from 'react';
import { mockCodeSourceMap } from './mock';
import { PAGE_KEY } from './constants';
import type { CodeSource, UseCodeSourceOptions, UseCodeSourceResult } from './types';

function getSourceKey(pageKey: string, codeKey: string) {
  return `${pageKey}:${codeKey}`;
}

export function resolveCodeSource({
  pageKey = PAGE_KEY.SUMMARY_EDITOR,
  codeKey,
}: UseCodeSourceOptions): CodeSource | undefined {
  return mockCodeSourceMap[getSourceKey(pageKey, codeKey)];
}

export function useCodeSource(options: UseCodeSourceOptions): UseCodeSourceResult {
  const base = resolveCodeSource(options);

  return useMemo(() => {
    if (!base) {
      return {
        data: undefined,
        loading: false,
        error: new Error(`未找到 codeKey: ${options.codeKey}`),
      };
    }
    return { data: base, loading: false };
  }, [base]);
}
