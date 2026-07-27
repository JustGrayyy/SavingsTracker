import { supabase } from './supabaseClient.js'

function mapRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    eventTime: row.event_time || '',
    endTime: row.end_time || '',
    location: row.location || '',
    notes: row.notes || '',
    eventDate: row.event_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export async function fetchEvents() {
  const { data, error } = await supabase
    .from('daily_event')
    .select('*')
    .order('event_date', { ascending: true })
    .order('event_time', { ascending: true, nullsFirst: false })

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  return data.map(mapRow)
}

export async function fetchEventsByDate(date) {
  const { data, error } = await supabase
    .from('daily_event')
    .select('*')
    .eq('event_date', date)
    .order('event_time', { ascending: true, nullsFirst: false })

  if (error) {
    console.error('Error fetching events by date:', error)
    return []
  }

  return data.map(mapRow)
}

export async function createEvent(eventData) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('daily_event')
    .insert({
      user_id: user.id,
      title: eventData.title,
      event_time: eventData.eventTime || null,
      end_time: eventData.endTime || null,
      location: eventData.location || null,
      notes: eventData.notes || null,
      event_date: eventData.eventDate
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating event:', error)
    return { success: false, error: error.message }
  }

  return { success: true, event: mapRow(data) }
}

export async function updateEvent(eventId, eventData) {
  const payload = {}
  if (eventData.title !== undefined) payload.title = eventData.title
  if (eventData.eventTime !== undefined) payload.event_time = eventData.eventTime || null
  if (eventData.endTime !== undefined) payload.end_time = eventData.endTime || null
  if (eventData.location !== undefined) payload.location = eventData.location || null
  if (eventData.notes !== undefined) payload.notes = eventData.notes || null
  if (eventData.eventDate !== undefined) payload.event_date = eventData.eventDate

  const { data, error } = await supabase
    .from('daily_event')
    .update(payload)
    .eq('id', eventId)
    .select()
    .single()

  if (error) {
    console.error('Error updating event:', error)
    return { success: false, error: error.message }
  }

  return { success: true, event: mapRow(data) }
}

export async function deleteEvent(eventId) {
  const { data, error } = await supabase
    .from('daily_event')
    .delete()
    .eq('id', eventId)
    .select('id')

  if (error) {
    console.error('Error deleting event:', error)
    return { success: false, error: error.message }
  }

  if (!data || data.length === 0) {
    return { success: false, error: 'Delete failed — no row removed (check auth / RLS)' }
  }

  return { success: true }
}
