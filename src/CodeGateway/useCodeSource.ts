import { useMemo } from 'react';
import { mockCodeSourceMap } from './mock';
import { useEditorStore } from './store';
import { DEFAULT_NAMESPACE, PAGE_KEY } from './constants';
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
  const namespace = options.pageKey ?? DEFAULT_NAMESPACE;
  const cacheKey = base?.cacheKey ?? base?.codeKey ?? '';
  const edited = useEditorStore((s) => s.namespaces[namespace]?.editedMap[cacheKey]);

  return useMemo(() => {
    if (!base) {
      return {
        data: undefined,
        loading: false,
        error: new Error(`未找到 codeKey: ${options.codeKey}`),
      };
    }
    return {
      data: edited !== undefined ? { ...base, code: edited } : base,
      loading: false,
    };
  }, [base, edited]);
}
