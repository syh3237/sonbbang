import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export function assertSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase 환경 변수가 설정되지 않았습니다. .env.local에 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY를 추가하세요.',
    )
  }
  return supabase
}
