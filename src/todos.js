import { supabase } from './supabaseClient.js'

function mapRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    notes: row.notes || '',
    isCompleted: !!row.is_completed,
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export async function fetchTodos() {
  const { data, error } = await supabase
    .from('master_todo')
    .select('*')
    .order('is_completed', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching todos:', error)
    return []
  }

  return data.map(mapRow)
}

export async function createTodo(todoData) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('master_todo')
    .insert({
      user_id: user.id,
      title: todoData.title,
      notes: todoData.notes || null,
      is_completed: false,
      sort_order: todoData.sortOrder ?? 0
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating todo:', error)
    return { success: false, error: error.message }
  }

  return { success: true, todo: mapRow(data) }
}

export async function updateTodo(todoId, todoData) {
  const payload = {}
  if (todoData.title !== undefined) payload.title = todoData.title
  if (todoData.notes !== undefined) payload.notes = todoData.notes || null
  if (todoData.isCompleted !== undefined) payload.is_completed = !!todoData.isCompleted
  if (todoData.sortOrder !== undefined) payload.sort_order = todoData.sortOrder

  const { data, error } = await supabase
    .from('master_todo')
    .update(payload)
    .eq('id', todoId)
    .select()
    .single()

  if (error) {
    console.error('Error updating todo:', error)
    return { success: false, error: error.message }
  }

  return { success: true, todo: mapRow(data) }
}

export async function toggleTodo(todoId, isCompleted) {
  return updateTodo(todoId, { isCompleted })
}

export async function deleteTodo(todoId) {
  const { data, error } = await supabase
    .from('master_todo')
    .delete()
    .eq('id', todoId)
    .select('id')

  if (error) {
    console.error('Error deleting todo:', error)
    return { success: false, error: error.message }
  }

  if (!data || data.length === 0) {
    return { success: false, error: 'Delete failed — no row removed (check auth / RLS)' }
  }

  return { success: true }
}
