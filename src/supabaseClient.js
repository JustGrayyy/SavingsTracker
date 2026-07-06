import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kvqytvejnjpkcivjzqnk.supabase.co'
const supabaseAnonKey = 'sb_publishable_x4SqOB2k6a-qGHug1U8Erw_2UtrWRTl'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
