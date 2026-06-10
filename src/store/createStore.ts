import { useCallback, useEffect, useState } from 'react';

export function createStore<T>(initialState: T | (() => T)) {
  const getInitial: () => T =
    typeof initialState === 'function' ? (initialState as () => T) : () => initialState;

  let state: T = getInitial();
  const listeners = new Set<(s: T) => void>();

  function notify() {
    listeners.forEach((fn) => fn(state));
  }

  function getState(): T {
    return state;
  }

  function setState(patch: Partial<T> | ((prev: T) => T)) {
    state = typeof patch === 'function' ? (patch as (prev: T) => T)(state) : { ...state, ...patch };
    notify();
  }

  function reset() {
    state = getInitial();
    notify();
  }

  function useStore(): T;
  function useStore<S>(selector: (s: T) => S): S;
  function useStore<S>(selector?: (s: T) => S): T | S {
    const sel = selector ?? ((s: T) => s as unknown as S);
    const [value, setValue] = useState<S>(() => sel(state));

    const listener = useCallback(
      (s: T) => {
        const next = sel(s);
        setValue((prev) => (Object.is(prev, next) ? prev : next));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    useEffect(() => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }, [listener]);

    return value;
  }

  return { useStore, getState, setState, reset };
}

/**
 * Namespace 级 store 工厂。
 * 每个 namespace 独立维护一份 T 状态，互不干扰。
 * editor.ts 等消费方只需关心单个 namespace 的状态形状，不用管路由逻辑。
 */
export function createNamespacedStore<T>(initialNamespace: T | (() => T)) {
  const getInitial: () => T =
    typeof initialNamespace === 'function' ? (initialNamespace as () => T) : () => initialNamespace;

  let namespaces: Record<string, T> = {};
  const listeners = new Set<(ns: Record<string, T>) => void>();

  function notify() {
    listeners.forEach((fn) => fn(namespaces));
  }

  function getState(namespace: string): T {
    return namespaces[namespace] ?? getInitial();
  }

  function setState(namespace: string, patch: Partial<T> | ((prev: T) => T)) {
    const prev = getState(namespace);
    const next =
      typeof patch === 'function' ? (patch as (prev: T) => T)(prev) : { ...prev, ...patch };
    namespaces = { ...namespaces, [namespace]: next };
    notify();
  }

  function reset(namespace: string) {
    const { [namespace]: _, ...rest } = namespaces;
    namespaces = rest as Record<string, T>;
    notify();
  }

  function useStore(namespace: string): T;
  function useStore<S>(namespace: string, selector: (s: T) => S): S;
  function useStore<S>(namespace: string, selector?: (s: T) => S): T | S {
    const sel = selector ?? ((s: T) => s as unknown as S);
    const [value, setValue] = useState<S>(() => sel(getState(namespace)));

    const listener = useCallback(
      (ns: Record<string, T>) => {
        const next = sel(ns[namespace] ?? getInitial());
        setValue((prev) => (Object.is(prev, next) ? prev : next));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    useEffect(() => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    }, [listener]);

    return value;
  }

  return { useStore, getState, setState, reset };
}
