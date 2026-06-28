import { assertSupabase } from './supabase/client'

export const profileService = {
  async getById(userId) {
    const client = assertSupabase()
    return client.from('profiles').select('*').eq('id', userId).maybeSingle()
  },

  async isUsernameTaken(username) {
    const client = assertSupabase()
    const { data, error } = await client
      .from('profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle()
    if (error) return false
    return !!data
  },

  async create({ userId, username, displayName }) {
    const client = assertSupabase()
    return client.from('profiles').insert({
      id: userId,
      username,
      display_name: displayName ?? username,
    })
  },

  async updateDisplayName({ userId, displayName }) {
    const client = assertSupabase()
    return client
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', userId)
  },
}
