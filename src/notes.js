import { supabase } from './supabaseClient.js'

function mapRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title || 'Untitled',
    contentHtml: row.content_html || '',
    checklist: Array.isArray(row.checklist) ? row.checklist : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    isPinned: !!row.is_pinned,
    isArchived: !!row.is_archived,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export async function fetchNotes() {
  const { data, error } = await supabase
    .from('notebook_note')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching notes:', error)
    return []
  }

  return data.map(mapRow)
}

export async function createNote(noteData = {}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('notebook_note')
    .insert({
      user_id: user.id,
      title: noteData.title || 'Untitled',
      content_html: noteData.contentHtml || '',
      checklist: noteData.checklist || [],
      tags: noteData.tags || [],
      is_pinned: !!noteData.isPinned,
      is_archived: !!noteData.isArchived
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating note:', error)
    return { success: false, error: error.message }
  }

  return { success: true, note: mapRow(data) }
}

export async function updateNote(noteId, noteData) {
  const payload = {}
  if (noteData.title !== undefined) payload.title = noteData.title || 'Untitled'
  if (noteData.contentHtml !== undefined) payload.content_html = noteData.contentHtml || ''
  if (noteData.checklist !== undefined) payload.checklist = noteData.checklist || []
  if (noteData.tags !== undefined) payload.tags = noteData.tags || []
  if (noteData.isPinned !== undefined) payload.is_pinned = !!noteData.isPinned
  if (noteData.isArchived !== undefined) payload.is_archived = !!noteData.isArchived

  const { data, error } = await supabase
    .from('notebook_note')
    .update(payload)
    .eq('id', noteId)
    .select()
    .single()

  if (error) {
    console.error('Error updating note:', error)
    return { success: false, error: error.message }
  }

  return { success: true, note: mapRow(data) }
}

export async function togglePin(noteId, isPinned) {
  return updateNote(noteId, { isPinned })
}

export async function toggleArchive(noteId, isArchived) {
  return updateNote(noteId, { isArchived })
}

export async function deleteNote(noteId) {
  const { data, error } = await supabase
    .from('notebook_note')
    .delete()
    .eq('id', noteId)
    .select('id')

  if (error) {
    console.error('Error deleting note:', error)
    return { success: false, error: error.message }
  }

  if (!data || data.length === 0) {
    return { success: false, error: 'Delete failed — no row removed (check auth / RLS)' }
  }

  return { success: true }
}
