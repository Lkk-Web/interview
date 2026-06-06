CREATE TABLE IF NOT EXISTS mermaid_diagrams (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  chart TEXT NOT NULL,
  diagram_type TEXT NOT NULL DEFAULT '',
  theme TEXT NOT NULL DEFAULT 'default',
  zoomable BOOLEAN NOT NULL DEFAULT FALSE,
  editable BOOLEAN NOT NULL DEFAULT FALSE,
  cache_key TEXT UNIQUE,
  source_path TEXT,
  source_component TEXT,
  visibility TEXT NOT NULL DEFAULT 'public',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mermaid_diagrams_category
  ON mermaid_diagrams(category);

CREATE TABLE IF NOT EXISTS mermaid_diagram_versions (
  id BIGSERIAL PRIMARY KEY,
  diagram_id BIGINT NOT NULL REFERENCES mermaid_diagrams(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  chart TEXT NOT NULL,
  change_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(diagram_id, version)
);

CREATE INDEX IF NOT EXISTS idx_mermaid_diagram_versions_diagram
  ON mermaid_diagram_versions(diagram_id, version DESC);
