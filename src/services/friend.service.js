import { assertSupabase } from './supabase/client'

export const friendService = {
  async fetchFriends(userId) {
    const client = assertSupabase()
    return client
      .from('friendships')
      .select('*')
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
      .eq('status', 'accepted')
  },
}
