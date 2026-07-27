import { supabase } from './supabaseClient.js'

function mapRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    className: row.class_name,
    courseCode: row.course_code || '',
    instructor: row.instructor || '',
    room: row.room || '',
    dayOfWeek: row.day_of_week,
    startTime: row.start_time,
    endTime: row.end_time,
    color: row.color || '#8b5cf6',
    isBreak: !!row.is_break,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export async function fetchClassSlots() {
  const { data, error } = await supabase
    .from('class_slot')
    .select('*')
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) {
    console.error('Error fetching class slots:', error)
    return []
  }

  return data.map(mapRow)
}

export async function createClassSlot(slotData) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('class_slot')
    .insert({
      user_id: user.id,
      class_name: slotData.className,
      course_code: slotData.courseCode || null,
      instructor: slotData.instructor || null,
      room: slotData.room || null,
      day_of_week: slotData.dayOfWeek,
      start_time: slotData.startTime,
      end_time: slotData.endTime,
      color: slotData.color || '#8b5cf6',
      is_break: !!slotData.isBreak
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating class slot:', error)
    return { success: false, error: error.message }
  }

  return { success: true, slot: mapRow(data) }
}

export async function updateClassSlot(slotId, slotData) {
  const payload = {}
  if (slotData.className !== undefined) payload.class_name = slotData.className
  if (slotData.courseCode !== undefined) payload.course_code = slotData.courseCode || null
  if (slotData.instructor !== undefined) payload.instructor = slotData.instructor || null
  if (slotData.room !== undefined) payload.room = slotData.room || null
  if (slotData.dayOfWeek !== undefined) payload.day_of_week = slotData.dayOfWeek
  if (slotData.startTime !== undefined) payload.start_time = slotData.startTime
  if (slotData.endTime !== undefined) payload.end_time = slotData.endTime
  if (slotData.color !== undefined) payload.color = slotData.color
  if (slotData.isBreak !== undefined) payload.is_break = !!slotData.isBreak

  const { data, error } = await supabase
    .from('class_slot')
    .update(payload)
    .eq('id', slotId)
    .select()
    .single()

  if (error) {
    console.error('Error updating class slot:', error)
    return { success: false, error: error.message }
  }

  return { success: true, slot: mapRow(data) }
}

export async function deleteClassSlot(slotId) {
  const { data, error } = await supabase
    .from('class_slot')
    .delete()
    .eq('id', slotId)
    .select('id')

  if (error) {
    console.error('Error deleting class slot:', error)
    return { success: false, error: error.message }
  }

  if (!data || data.length === 0) {
    return { success: false, error: 'Delete failed — no row removed (check auth / RLS)' }
  }

  return { success: true }
}
