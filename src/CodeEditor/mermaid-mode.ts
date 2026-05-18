import CodeMirror from 'codemirror';

/**
 * 简单的 Mermaid 语法高亮 mode
 * 支持：关键字、节点/参与者名、箭头、注释
 */
CodeMirror.defineMode('mermaid', () => {
  const keywords =
    /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|gitGraph|mindmap|timeline|journey|quadrantChart|requirementDiagram)\b/;
  const flowKeywords = /^(subgraph|end|direction|LR|RL|TD|TB|BT)\b/;
  const seqKeywords =
    /^(participant|actor|activate|deactivate|loop|alt|else|opt|par|and|rect|note|over|left of|right of|autonumber|critical|break|option)\b/;
  const arrows = /^(-[-.]?>>?|==>>?|-->>?|\.\.>>?|--[ox]|==|-->|->|==>|~~>)/;
  const comment = /^%%/;

  return {
    token(stream: any) {
      // 注释
      if (stream.match(comment)) {
        stream.skipToEnd();
        return 'comment';
      }

      // 图表类型关键字
      if (stream.match(keywords)) return 'keyword';

      // 流程图关键字
      if (stream.match(flowKeywords)) return 'keyword';

      // 时序图关键字
      if (stream.match(seqKeywords)) return 'def';

      // 箭头
      if (stream.match(arrows)) return 'operator';

      // 方括号内容（节点标签）
      if (stream.peek() === '[') {
        stream.next();
        return 'bracket';
      }
      if (stream.peek() === ']') {
        stream.next();
        return 'bracket';
      }

      // 引号字符串
      if (stream.peek() === '"') {
        stream.next();
        while (!stream.eol()) {
          const ch = stream.next();
          if (ch === '"') break;
        }
        return 'string';
      }

      // 冒号后面的内容（标签）
      if (stream.peek() === ':') {
        stream.next();
        return 'operator';
      }

      // 节点 ID（字母数字下划线）
      if (stream.match(/^[A-Za-z_][A-Za-z0-9_]*/)) return 'variable';

      // 数字
      if (stream.match(/^\d+/)) return 'number';

      // 其他字符跳过
      stream.next();
      return null;
    },
  };
});
