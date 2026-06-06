import { useMemo } from 'react';
import { mockCodeSourceMap } from './mock';
import { useCodeEditorStore } from './store';
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
  const editedMap = useCodeEditorStore((s) => s.editedMap);

  return useMemo(() => {
    const base = resolveCodeSource(options);
    if (!base) {
      return {
        data: undefined,
        loading: false,
        error: new Error(`未找到 codeKey: ${options.codeKey}`),
      };
    }
    const cacheKey = base.cacheKey ?? base.codeKey;
    const edited = editedMap[cacheKey];
    return {
      data: edited !== undefined ? { ...base, code: edited } : base,
      loading: false,
    };
  }, [options.pageKey, options.codeKey, editedMap]);
}
