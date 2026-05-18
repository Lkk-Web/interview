import type { ReactNode } from 'react';

export type SupportedLang =
  | 'mermaid'
  | 'markdown'
  | 'html'
  | 'json'
  | 'javascript'
  | 'typescript'
  | 'css'
  | 'text';

export interface CodeEditorProps {
  /** 语言类型，决定语法高亮和渲染方式 */
  lang: SupportedLang;
  /** 初始代码内容 */
  code: string;
  /** 自定义渲染器，传入代码字符串，返回 ReactNode */
  renderer?: (code: string) => ReactNode;
  /** 本地缓存 key，相同 key 共享缓存 */
  cacheKey?: string;
  /** 编辑区高度，默认 300px */
  editorHeight?: number;
  /** 预览区高度，默认 auto */
  previewHeight?: number;
  /** 是否默认展开编辑器，默认 false */
  defaultOpen?: boolean;
}
