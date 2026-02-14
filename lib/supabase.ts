import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase environment variables not configured. Knowledge Base features will be unavailable.',
    'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
)

// Type definitions for Supabase tables
export interface KnowledgeNoteDB {
  id: string
  user_id: string | null
  workspace_id: string
  title: string
  content: string
  search_query: string | null
  source_searches: string[] | null
  created_at: string
  updated_at: string
  last_reviewed_at: string | null
  metadata: Record<string, unknown> | null
}

export interface NoteTagDB {
  id: string
  note_id: string
  tag: string
  created_at: string
}

export interface NoteLinkDB {
  id: string
  from_note_id: string
  to_note_id: string
  link_type: string
  created_at: string
}

export interface CollectionDB {
  id: string
  user_id: string | null
  workspace_id: string
  name: string
  description: string | null
  icon: string | null
  created_at: string
  updated_at: string
}
