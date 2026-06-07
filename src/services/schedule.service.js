import { assertSupabase } from './supabase/client'

export const scheduleService = {
  async fetchByRange({ start, end, ownerId }) {
    const client = assertSupabase()
    let query = client
      .from('schedules')
      .select('*')
      .gte('start_at', start.toISOString())
      .lte('start_at', end.toISOString())

    if (ownerId) {
      query = query.eq('owner_id', ownerId)
    }

    return query
  },
}
