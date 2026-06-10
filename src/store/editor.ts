import { createNamespacedStore } from './createStore';

interface NamespaceState {
  editedMap: Record<string, string>;
}

const store = createNamespacedStore<NamespaceState>({ editedMap: {} });

export const useEditorStore = store.useStore;

export const editorActions = {
  setEdited(namespace: string, cacheKey: string, code: string) {
    store.setState(namespace, (prev) => ({
      ...prev,
      editedMap: { ...prev.editedMap, [cacheKey]: code },
    }));
  },

  resetEdited(namespace: string, cacheKey: string) {
    store.setState(namespace, (prev) => {
      const next = { ...prev.editedMap };
      delete next[cacheKey];
      return { ...prev, editedMap: next };
    });
  },

  clearNamespace: store.reset,

  getEdited(namespace: string, cacheKey: string): string | undefined {
    return store.getState(namespace).editedMap[cacheKey];
  },
};
