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

  async create(payload) {
    const client = assertSupabase()
    return client.from('schedules').insert(payload).select().single()
  },

  async update({ id, payload }) {
    const client = assertSupabase()
    return client.from('schedules').update(payload).eq('id', id).select().single()
  },
}
