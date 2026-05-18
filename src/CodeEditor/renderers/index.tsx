import React from 'react';
import { marked } from 'marked';

export const MarkdownRenderer: React.FC<{ code: string }> = ({ code }) => {
  let html = '';
  try {
    // marked.parse 在 v4 中是同步的
    html = marked.parse(code) as string;
  } catch {
    html = code;
  }
  return (
    <div
      style={{ padding: '12px 16px', lineHeight: 1.8 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const HtmlRenderer: React.FC<{ code: string }> = ({ code }) => (
  <iframe
    srcDoc={code}
    style={{ width: '100%', minHeight: 200, border: 'none' }}
    sandbox="allow-scripts"
    title="html-preview"
  />
);

export const JsonRenderer: React.FC<{ code: string }> = ({ code }) => {
  let formatted = code;
  let error = '';
  try {
    formatted = JSON.stringify(JSON.parse(code), null, 2);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  if (error) {
    return (
      <div style={{ padding: 12, color: '#ff4d4f', fontSize: 13 }}>JSON 解析错误：{error}</div>
    );
  }

  return (
    <pre
      style={{
        margin: 0,
        padding: '12px 16px',
        fontSize: 13,
        lineHeight: 1.6,
        overflowX: 'auto',
        background: '#fafafa',
      }}
    >
      {formatted}
    </pre>
  );
};

export const TextRenderer: React.FC<{ code: string }> = ({ code }) => (
  <pre
    style={{
      margin: 0,
      padding: '12px 16px',
      fontSize: 13,
      lineHeight: 1.6,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-all',
    }}
  >
    {code}
  </pre>
);
