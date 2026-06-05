import React from 'react';
import CodeEditor from '../CodeEditor';
import Mermaid from '../Mermaid';
import { useCodeSource } from './useCodeSource';
import type { CodeGatewayProps } from './types';
import './index.less';

const CodeGateway: React.FC<CodeGatewayProps> = (props) => {
  const { data, loading, error } = useCodeSource({ pageKey: props.pageKey, codeKey: props.codeKey });

  if (loading) {
    return <div className="code-gateway-state">代码加载中...</div>;
  }

  if (error || !data) {
    return <div className="code-gateway-state code-gateway-state--error">未找到 codeKey: {props.codeKey}</div>;
  }

  const cacheKey = props.cacheKey ?? data.cacheKey ?? data.codeKey;

  if (data.lang === 'mermaid') {
    return (
      <Mermaid
        chart={data.code}
        cacheKey={cacheKey}
        editable={props.editable ?? data.editable}
        zoomable={props.zoomable ?? data.zoomable}
      />
    );
  }

  return (
    <CodeEditor
      lang={data.lang}
      code={data.code}
      cacheKey={cacheKey}
      defaultOpen={props.defaultOpen ?? data.defaultOpen}
      editorHeight={props.editorHeight ?? data.editorHeight}
    />
  );
};

export type { CodeGatewayProps };
export { resolveCodeSource, useCodeSource } from './useCodeSource';
export default CodeGateway;
