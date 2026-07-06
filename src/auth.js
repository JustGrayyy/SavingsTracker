import { supabase } from './supabaseClient.js'

export async function signUp(username, password) {
  try {
    const usernameRegex = /^[a-zA-Z0-9_-]+$/
    if (!usernameRegex.test(username)) {
      return { success: false, error: 'Username can only contain letters, numbers, underscores, and hyphens.' }
    }

    const { data: existingUsers, error: checkError } = await supabase
      .from('user_profile')
      .select('username')
      .eq('username', username)
      .limit(1)

    if (checkError) {
      return { success: false, error: 'Failed to check username availability' }
    }

    if (existingUsers && existingUsers.length > 0) {
      return { success: false, error: 'Username already taken. Please choose another.' }
    }

    const { data, error } = await supabase.auth.signUp({
      email: `${username}@users.savingstracker.app`,
      password: password,
      options: {
        data: {
          username: username
        },
        emailRedirectTo: undefined
      }
    })

    if (error) {
      if (error.message.includes('already registered')) {
        return { success: false, error: 'An account with this username already exists.' }
      }
      return { success: false, error: error.message }
    }

    if (data.session) {
      return { success: true, user: data.user, session: data.session }
    }

    if (data.user && !data.session) {
      return {
        success: true,
        user: data.user,
        requiresConfirmation: true,
        message: 'Account created! You can now sign in.'
      }
    }

    return { success: false, error: 'Failed to create account. Please try again.' }
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function signIn(username, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${username}@users.savingstracker.app`,
      password: password
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, error: 'Invalid username or password.' }
      }
      if (error.message.includes('Email not confirmed')) {
        return { success: false, error: 'Please check your email to confirm your account, or contact support.' }
      }
      return { success: false, error: error.message }
    }

    if (data.user) {
      return { success: true, user: data.user, session: data.session }
    }

    return { success: false, error: 'Failed to sign in. Please try again.' }
  } catch (err) {
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { success: !error, error: error?.message }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    window.location.href = '/signin.html'
    return null
  }
  return user
}

export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('user_profile')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    return null
  }
  return data
}
