import { supabase } from './supabaseClient.js'

export async function checkAuth() {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    window.location.href = '/signin.html'
    return null
  }

  return user
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function logout() {
  await supabase.auth.signOut()
  window.location.href = '/signin.html'
}
