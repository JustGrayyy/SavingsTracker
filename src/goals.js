import { supabase } from './supabaseClient.js'

export async function fetchGoals() {
  const { data, error } = await supabase
    .from('savings_goal')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching goals:', error)
    return []
  }

  return data.map(goal => ({
    id: goal.id,
    name: goal.name,
    target: parseFloat(goal.target),
    current: parseFloat(goal.current),
    deadline: goal.deadline,
    notes: goal.notes,
    emoji: goal.emoji || '🏖️'
  }))
}

export async function createGoal(goalData) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('savings_goal')
    .insert({
      user_id: user.id,
      name: goalData.name,
      target: goalData.target,
      current: 0,
      deadline: goalData.deadline || null,
      notes: goalData.notes || null,
      emoji: goalData.emoji || '🏖️'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating goal:', error)
    return { success: false, error: error.message }
  }

  return {
    success: true,
    goal: {
      id: data.id,
      name: data.name,
      target: parseFloat(data.target),
      current: parseFloat(data.current),
      deadline: data.deadline,
      notes: data.notes,
      emoji: data.emoji
    }
  }
}

export async function updateGoal(goalId, goalData) {
  const { data, error } = await supabase
    .from('savings_goal')
    .update({
      name: goalData.name,
      target: goalData.target,
      deadline: goalData.deadline || null,
      notes: goalData.notes || null,
      emoji: goalData.emoji
    })
    .eq('id', goalId)
    .select()
    .single()

  if (error) {
    console.error('Error updating goal:', error)
    return { success: false, error: error.message }
  }

  return {
    success: true,
    goal: {
      id: data.id,
      name: data.name,
      target: parseFloat(data.target),
      current: parseFloat(data.current),
      deadline: data.deadline,
      notes: data.notes,
      emoji: data.emoji
    }
  }
}

export async function deleteGoal(goalId) {
  const { error } = await supabase
    .from('savings_goal')
    .delete()
    .eq('id', goalId)

  if (error) {
    console.error('Error deleting goal:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function depositToGoal(goalId, amount) {
  const { data: goal, error: fetchError } = await supabase
    .from('savings_goal')
    .select('current, target')
    .eq('id', goalId)
    .single()

  if (fetchError) {
    return { success: false, error: 'Failed to fetch goal' }
  }

  const newAmount = Math.min(parseFloat(goal.current) + amount, parseFloat(goal.target))

  const { data, error } = await supabase
    .from('savings_goal')
    .update({ current: newAmount })
    .eq('id', goalId)
    .select()
    .single()

  if (error) {
    console.error('Error depositing:', error)
    return { success: false, error: error.message }
  }

  return {
    success: true,
    goal: {
      id: data.id,
      name: data.name,
      target: parseFloat(data.target),
      current: parseFloat(data.current),
      deadline: data.deadline,
      notes: data.notes,
      emoji: data.emoji
    }
  }
}

export async function withdrawFromGoal(goalId, amount) {
  const { data: goal, error: fetchError } = await supabase
    .from('savings_goal')
    .select('current')
    .eq('id', goalId)
    .single()

  if (fetchError) {
    return { success: false, error: 'Failed to fetch goal' }
  }

  const newAmount = Math.max(parseFloat(goal.current) - amount, 0)

  const { data, error } = await supabase
    .from('savings_goal')
    .update({ current: newAmount })
    .eq('id', goalId)
    .select()
    .single()

  if (error) {
    console.error('Error withdrawing:', error)
    return { success: false, error: error.message }
  }

  return {
    success: true,
    goal: {
      id: data.id,
      name: data.name,
      target: parseFloat(data.target),
      current: parseFloat(data.current),
      deadline: data.deadline,
      notes: data.notes,
      emoji: data.emoji
    }
  }
}
