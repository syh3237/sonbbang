import { assertSupabase } from './supabase/client'

export const profileService = {
  async getById(userId) {
    const client = assertSupabase()
    return client.from('profiles').select('*').eq('id', userId).maybeSingle()
  },
}
