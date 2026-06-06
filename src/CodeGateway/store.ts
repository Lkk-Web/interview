import { create } from 'zustand';

interface CodeEditorState {
  /** cacheKey -> 用户编辑后的内容 */
  editedMap: Record<string, string>;
  setEdited: (cacheKey: string, code: string) => void;
  resetEdited: (cacheKey: string) => void;
}

export const useCodeEditorStore = create<CodeEditorState>((set) => ({
  editedMap: {},
  setEdited: (cacheKey, code) =>
    set((s) => ({ editedMap: { ...s.editedMap, [cacheKey]: code } })),
  resetEdited: (cacheKey) =>
    set((s) => {
      const next = { ...s.editedMap };
      delete next[cacheKey];
      return { editedMap: next };
    }),
}));
