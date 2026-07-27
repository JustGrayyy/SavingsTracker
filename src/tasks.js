import { supabase } from './supabaseClient.js'

function mapRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    subject: row.subject,
    title: row.title,
    details: row.details || '',
    links: row.links || '',
    taskType: row.task_type,
    status: row.status,
    priority: row.priority,
    dateGiven: row.date_given,
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export async function fetchTasks() {
  const { data, error } = await supabase
    .from('academic_task')
    .select('*')
    .order('due_date', { ascending: true, nullsFirst: false })

  if (error) {
    console.error('Error fetching tasks:', error)
    return []
  }

  return data.map(mapRow)
}

export async function createTask(taskData) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('academic_task')
    .insert({
      user_id: user.id,
      subject: taskData.subject,
      title: taskData.title,
      details: taskData.details || null,
      links: taskData.links || null,
      task_type: taskData.taskType || 'other',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      date_given: taskData.dateGiven || null,
      due_date: taskData.dueDate || null
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating task:', error)
    return { success: false, error: error.message }
  }

  return { success: true, task: mapRow(data) }
}

export async function updateTask(taskId, taskData) {
  const payload = {}
  if (taskData.subject !== undefined) payload.subject = taskData.subject
  if (taskData.title !== undefined) payload.title = taskData.title
  if (taskData.details !== undefined) payload.details = taskData.details || null
  if (taskData.links !== undefined) payload.links = taskData.links || null
  if (taskData.taskType !== undefined) payload.task_type = taskData.taskType
  if (taskData.status !== undefined) payload.status = taskData.status
  if (taskData.priority !== undefined) payload.priority = taskData.priority
  if (taskData.dateGiven !== undefined) payload.date_given = taskData.dateGiven || null
  if (taskData.dueDate !== undefined) payload.due_date = taskData.dueDate || null

  const { data, error } = await supabase
    .from('academic_task')
    .update(payload)
    .eq('id', taskId)
    .select()
    .single()

  if (error) {
    console.error('Error updating task:', error)
    return { success: false, error: error.message }
  }

  return { success: true, task: mapRow(data) }
}

export async function deleteTask(taskId) {
  const { data, error } = await supabase
    .from('academic_task')
    .delete()
    .eq('id', taskId)
    .select('id')

  if (error) {
    console.error('Error deleting task:', error)
    return { success: false, error: error.message }
  }

  if (!data || data.length === 0) {
    return { success: false, error: 'Delete failed — no row removed (check auth / RLS)' }
  }

  return { success: true }
}
