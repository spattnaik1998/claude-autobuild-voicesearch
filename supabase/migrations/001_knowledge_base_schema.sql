-- Knowledge Base Schema
-- Execute this in Supabase SQL Editor to set up all tables

-- Create knowledge_notes table
CREATE TABLE IF NOT EXISTS knowledge_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  workspace_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  search_query TEXT,
  source_searches JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_reviewed_at TIMESTAMPTZ,
  metadata JSONB
);

-- Create indexes for knowledge_notes
CREATE INDEX IF NOT EXISTS idx_knowledge_notes_workspace ON knowledge_notes(workspace_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_notes_created ON knowledge_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_notes_user ON knowledge_notes(user_id);

-- Create note_tags table
CREATE TABLE IF NOT EXISTS note_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID NOT NULL REFERENCES knowledge_notes(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(note_id, tag)
);

-- Create indexes for note_tags
CREATE INDEX IF NOT EXISTS idx_note_tags_note_id ON note_tags(note_id);
CREATE INDEX IF NOT EXISTS idx_note_tags_tag ON note_tags(tag);

-- Create note_links table
CREATE TABLE IF NOT EXISTS note_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_note_id UUID NOT NULL REFERENCES knowledge_notes(id) ON DELETE CASCADE,
  to_note_id UUID NOT NULL REFERENCES knowledge_notes(id) ON DELETE CASCADE,
  link_type TEXT DEFAULT 'wikilink',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(from_note_id, to_note_id)
);

-- Create indexes for note_links
CREATE INDEX IF NOT EXISTS idx_note_links_from ON note_links(from_note_id);
CREATE INDEX IF NOT EXISTS idx_note_links_to ON note_links(to_note_id);

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  workspace_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for collections
CREATE INDEX IF NOT EXISTS idx_collections_workspace ON collections(workspace_id);
CREATE INDEX IF NOT EXISTS idx_collections_user ON collections(user_id);

-- Create collection_notes table
CREATE TABLE IF NOT EXISTS collection_notes (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  note_id UUID NOT NULL REFERENCES knowledge_notes(id) ON DELETE CASCADE,
  position INT,
  added_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (collection_id, note_id)
);

-- Create indexes for collection_notes
CREATE INDEX IF NOT EXISTS idx_collection_notes_collection ON collection_notes(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_notes_note ON collection_notes(note_id);

-- Enable Row Level Security (RLS)
ALTER TABLE knowledge_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (Allow all for development)
-- Replace these with user-specific policies when implementing authentication
CREATE POLICY "Allow all operations on knowledge_notes" ON knowledge_notes
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on note_tags" ON note_tags
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on note_links" ON note_links
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on collections" ON collections
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on collection_notes" ON collection_notes
  FOR ALL USING (true) WITH CHECK (true);

-- Create views for common queries
CREATE VIEW notes_with_tags AS
SELECT
  kn.id,
  kn.workspace_id,
  kn.title,
  kn.content,
  kn.search_query,
  kn.created_at,
  kn.updated_at,
  array_agg(DISTINCT nt.tag) FILTER (WHERE nt.tag IS NOT NULL) as tags
FROM knowledge_notes kn
LEFT JOIN note_tags nt ON kn.id = nt.note_id
GROUP BY kn.id, kn.workspace_id, kn.title, kn.content, kn.search_query, kn.created_at, kn.updated_at;

CREATE VIEW notes_with_link_count AS
SELECT
  kn.id,
  kn.workspace_id,
  kn.title,
  COUNT(DISTINCT nl_out.id) as outgoing_links,
  COUNT(DISTINCT nl_in.id) as incoming_links
FROM knowledge_notes kn
LEFT JOIN note_links nl_out ON kn.id = nl_out.from_note_id
LEFT JOIN note_links nl_in ON kn.id = nl_in.to_note_id
GROUP BY kn.id, kn.workspace_id, kn.title;
