import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kvqytvejnjpkcivjzqnk.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_x4SqOB2k6a-qGHug1U8Erw_2UtrWRTl'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
