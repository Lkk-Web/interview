import type { SupportedLang } from '../CodeEditor/types';

export interface CodeSource {
  /** 页面或业务域 key，用于隔离不同页面的代码数据 */
  pageKey: string;
  /** 代码内容 key，md 层通过它选择要展示的代码 */
  codeKey: string;
  /** 代码语言，决定渲染到 Mermaid 还是 CodeEditor */
  lang: SupportedLang;
  /** 实际代码内容 */
  code: string;
  /** 本地缓存 key，相同 key 共享编辑缓存 */
  cacheKey?: string;
  /** 是否默认展开 CodeEditor 编辑区 */
  defaultOpen?: boolean;
  /** CodeEditor 编辑区高度 */
  editorHeight?: number;
  /** Mermaid 是否开启编辑模式 */
  editable?: boolean;
  /** Mermaid 是否开启缩放和拖拽 */
  zoomable?: boolean;
}

export interface UseCodeSourceOptions {
  /** 页面或业务域 key，默认使用 summary-editor */
  pageKey?: string;
  /** 要读取的代码内容 key */
  codeKey: string;
}

export interface UseCodeSourceResult {
  /** 解析后的代码数据 */
  data?: CodeSource;
  /** 是否正在加载代码数据 */
  loading: boolean;
  /** 加载或解析失败时的错误信息 */
  error?: Error;
}

export interface CodeGatewayProps extends UseCodeSourceOptions {
  /** 覆盖数据源中的本地缓存 key */
  cacheKey?: string;
  /** 覆盖数据源中的默认展开状态 */
  defaultOpen?: boolean;
  /** 覆盖数据源中的编辑区高度 */
  editorHeight?: number;
  /** 覆盖数据源中的 Mermaid 编辑模式 */
  editable?: boolean;
  /** 覆盖数据源中的 Mermaid 缩放和拖拽配置 */
  zoomable?: boolean;
}
