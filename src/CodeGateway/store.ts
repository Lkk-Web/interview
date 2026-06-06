import { useCallback, useEffect, useState } from 'react';

interface NamespaceState {
  editedMap: Record<string, string>;
}

interface EditorState {
  namespaces: Record<string, NamespaceState>;
}

type Listener = (state: EditorState) => void;

let state: EditorState = { namespaces: {} };
const listeners = new Set<Listener>();

function setState(patch: Partial<EditorState>) {
  state = { ...state, ...patch };
  listeners.forEach((fn) => fn(state));
}

function getNamespace(namespace: string): NamespaceState {
  return state.namespaces[namespace] ?? { editedMap: {} };
}

function setNamespace(namespace: string, ws: NamespaceState) {
  setState({ namespaces: { ...state.namespaces, [namespace]: ws } });
}

export function useEditorStore<T>(selector: (s: EditorState) => T): T {
  const [value, setValue] = useState(() => selector(state));

  const listener = useCallback(
    (s: EditorState) => {
      const next = selector(s);
      setValue((prev) => (prev === next ? prev : next));
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

export const editorActions = {
  setEdited(namespace: string, cacheKey: string, code: string) {
    const ws = getNamespace(namespace);
    setNamespace(namespace, {
      ...ws,
      editedMap: { ...ws.editedMap, [cacheKey]: code },
    });
  },

  resetEdited(namespace: string, cacheKey: string) {
    const ws = getNamespace(namespace);
    const next = { ...ws.editedMap };
    delete next[cacheKey];
    setNamespace(namespace, { ...ws, editedMap: next });
  },

  clearNamespace(namespace: string) {
    const next = { ...state.namespaces };
    delete next[namespace];
    setState({ namespaces: next });
  },

  getEdited(namespace: string, cacheKey: string): string | undefined {
    return getNamespace(namespace).editedMap[cacheKey];
  },
};
