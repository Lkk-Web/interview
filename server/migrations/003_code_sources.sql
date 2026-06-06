-- code_sources 替代原来的 mermaid_diagrams，支持所有代码语言类型。
-- page_key + code_key 是业务唯一标识，对应前端 CodeSource 的 pageKey + codeKey。
CREATE TABLE IF NOT EXISTS code_sources (
  id           BIGSERIAL PRIMARY KEY,
  page_key     TEXT NOT NULL,
  code_key     TEXT NOT NULL,
  -- 组合唯一约束，保证同一页面下每个 code_key 只有一条记录
  UNIQUE(page_key, code_key),
  -- lang 对应前端 SupportedLang：mermaid/markdown/html/json/javascript/typescript/css/text
  lang         TEXT NOT NULL DEFAULT 'mermaid',
  -- code 存实际代码或 Mermaid 图表内容
  code         TEXT NOT NULL DEFAULT '',
  -- cache_key 兼容前端 CodeEditor 的 localStorage 草稿 key
  cache_key    TEXT,
  title        TEXT,
  description  TEXT,
  -- Mermaid 专属展示配置
  theme        TEXT NOT NULL DEFAULT 'default',
  zoomable     BOOLEAN NOT NULL DEFAULT FALSE,
  -- CodeEditor 专属配置
  default_open  BOOLEAN NOT NULL DEFAULT FALSE,
  editor_height INTEGER,
  visibility   TEXT NOT NULL DEFAULT 'public',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_code_sources_page_key
  ON code_sources(page_key);

-- code_source_versions 保存编辑历史，和原 mermaid_diagram_versions 同样的思路。
CREATE TABLE IF NOT EXISTS code_source_versions (
  id             BIGSERIAL PRIMARY KEY,
  code_source_id BIGINT NOT NULL REFERENCES code_sources(id) ON DELETE CASCADE,
  version        INTEGER NOT NULL,
  code           TEXT NOT NULL,
  change_note    TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(code_source_id, version)
);

CREATE INDEX IF NOT EXISTS idx_code_source_versions_source
  ON code_source_versions(code_source_id, version DESC);
