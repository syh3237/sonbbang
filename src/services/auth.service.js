import { assertSupabase } from './supabase/client'

export const authService = {
  async getSession() {
    const client = assertSupabase()
    const { data, error } = await client.auth.getSession()
    return { data: data.session, error }
  },

  onAuthStateChange(callback) {
    const client = assertSupabase()
    return client.auth.onAuthStateChange(callback)
  },

  async signUp({ email, password }) {
    const client = assertSupabase()
    return client.auth.signUp({ email, password })
  },

  async signIn({ email, password }) {
    const client = assertSupabase()
    return client.auth.signInWithPassword({ email, password })
  },

  async signOut() {
    const client = assertSupabase()
    return client.auth.signOut()
  },
}
