import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { CodeEditorProps, SupportedLang } from './types';
import { MarkdownRenderer, HtmlRenderer, JsonRenderer, TextRenderer } from './renderers';
import { useCodeEditorStore } from '../CodeGateway/store';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-darker.css';
import './mermaid-mode';
import './index.less';

const LANG_LABEL: Record<SupportedLang, string> = {
  mermaid: 'Mermaid',
  markdown: 'Markdown',
  html: 'HTML',
  json: 'JSON',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  css: 'CSS',
  text: 'Text',
};

const CM_MODE: Record<SupportedLang, string> = {
  mermaid: 'mermaid',
  markdown: 'text/x-markdown',
  html: 'text/html',
  json: 'application/json',
  javascript: 'text/javascript',
  typescript: 'text/typescript',
  css: 'text/css',
  text: 'text/plain',
};

function renderByLang(
  lang: SupportedLang,
  code: string,
  customRenderer?: (code: string) => React.ReactNode,
) {
  if (customRenderer) return customRenderer(code);
  switch (lang) {
    case 'markdown':
      return <MarkdownRenderer code={code} />;
    case 'html':
      return <HtmlRenderer code={code} />;
    case 'json':
      return <JsonRenderer code={code} />;
    default:
      return <TextRenderer code={code} />;
  }
}

// CodeMirror 编辑器子组件
const CMEditor: React.FC<{
  value: string;
  mode: string;
  height: number;
  onChange: (val: string) => void;
}> = ({ value, mode, height, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cmRef = useRef<any>(null);

  useEffect(() => {
    if (!textareaRef.current || cmRef.current) return;

    try {
      cmRef.current = CodeMirror.fromTextArea(textareaRef.current, {
        mode,
        theme: 'material-darker',
        lineNumbers: true,
        lineWrapping: true,
        tabSize: 2,
        indentWithTabs: false,
        autofocus: false,
      });
      cmRef.current.setSize('100%', '100%');
      cmRef.current.on('change', (editor: any) => {
        onChange(editor.getValue() ?? '');
      });
    } catch (e) {
      console.error('CodeMirror init failed:', e);
    }

    return () => {
      if (cmRef.current) {
        try {
          cmRef.current.toTextArea();
        } catch {}
        cmRef.current = null;
      }
    };
  }, []);

  // 外部 value 变化时同步（仅重置时）
  useEffect(() => {
    if (cmRef.current && cmRef.current.getValue() !== value) {
      cmRef.current.setValue(value);
    }
  }, [value]);

  return <textarea ref={textareaRef} defaultValue={value} style={{ display: 'none' }} />;
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  lang,
  code: initialCode,
  renderer,
  cacheKey,
  editorHeight = 300,
  defaultOpen = false,
}) => {
  const effectiveCacheKey = cacheKey || `${lang}:${(initialCode || '').slice(0, 40)}`;
  const { editedMap, setEdited, resetEdited } = useCodeEditorStore();

  const [code, setCode] = useState<string>(
    () => editedMap[effectiveCacheKey] ?? initialCode ?? '',
  );

  const [editorOpen, setEditorOpen] = useState(defaultOpen);
  const [previewCode, setPreviewCode] = useState(code);
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleCodeChange = useCallback(
    (val: string) => {
      const safeVal = val ?? '';
      setCode(safeVal);
      setEdited(effectiveCacheKey, safeVal);
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        setPreviewCode(safeVal);
      }, 300);
    },
    [effectiveCacheKey, setEdited],
  );

  const handleReset = useCallback(() => {
    const safe = initialCode || '';
    setCode(safe);
    setPreviewCode(safe);
    resetEdited(effectiveCacheKey);
  }, [initialCode, effectiveCacheKey, resetEdited]);

  useEffect(() => {
    setPreviewCode(code);
  }, []);

  useEffect(() => {
    return () => clearTimeout(debounceTimer.current);
  }, []);

  const hasChanged = code !== (initialCode || '');

  return (
    <div className="code-editor-wrapper">
      {/* 工具栏 */}
      <div className="code-editor-toolbar">
        <span className="code-editor-lang-badge">{LANG_LABEL[lang]}</span>
        <div className="code-editor-toolbar-actions">
          {hasChanged && (
            <button
              className="code-editor-btn code-editor-btn-reset"
              onClick={handleReset}
              title="重置"
            >
              ↺ 重置
            </button>
          )}
          <button
            className={`code-editor-btn ${editorOpen ? 'code-editor-btn-active' : ''}`}
            onClick={() => setEditorOpen((v) => !v)}
          >
            {editorOpen ? '收起' : '✎ 编辑'}
          </button>
        </div>
      </div>

      {/* 主体 */}
      <div className={`code-editor-body ${editorOpen ? 'code-editor-body--open' : ''}`}>
        <div className="code-editor-preview">{renderByLang(lang, previewCode, renderer)}</div>

        {editorOpen && (
          <div className="code-editor-editor" style={{ height: editorHeight }}>
            <CMEditor
              value={code}
              mode={CM_MODE[lang]}
              height={editorHeight}
              onChange={handleCodeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
