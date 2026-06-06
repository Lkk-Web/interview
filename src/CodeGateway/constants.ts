export const DEFAULT_NAMESPACE = 'default';

export const PAGE_KEY = {
  SUMMARY_EDITOR: 'summary-editor',
  EXPAND_MERMAID: 'expand-mermaid',
  ARCHITECTURE: 'architecture',
  HOME: 'home',
  AI_INDEX: 'ai-index',
} as const;

export const CODE_KEY = {
  // summary-editor
  DEMO_MERMAID: 'demo-mermaid',
  DEMO_MARKDOWN: 'demo-markdown',
  DEMO_HTML: 'demo-html',
  DEMO_JSON: 'demo-json',
  // expand-mermaid
  FLOW_CHART: 'flow-chart',
  SEQUENCE_DIAGRAM: 'sequence-diagram',
  CLASS_DIAGRAM: 'class-diagram',
  STATE_DIAGRAM: 'state-diagram',
  GANTT_CHART: 'gantt-chart',
  PIE_CHART: 'pie-chart',
  MINDMAP: 'mindmap',
  STYLE_DEMO: 'style-demo',
  // architecture
  LAYERED_ARCH: 'layered-arch',
  MICRO_SERVICE: 'micro-service',
  FRONTEND_ARCH: 'frontend-arch',
  MESSAGE_NOTIFY: 'message-notify',
  OPEN_CLAW: 'open-claw',
  OPEN_CLAW_FLOW: 'open-claw-flow',
  // home
  KNOWLEDGE_MAP: 'knowledge-map',
  // ai-index
  AI_OVERVIEW: 'ai-overview',
} as const;
