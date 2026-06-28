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

  async signUp({ email, password, username }) {
    const client = assertSupabase()
    return client.auth.signUp({
      email,
      password,
      options: { data: { username } },
    })
  },

  async signIn({ email, password }) {
    const client = assertSupabase()
    return client.auth.signInWithPassword({ email, password })
  },

  async signOut() {
    const client = assertSupabase()
    return client.auth.signOut()
  },

  async getEmailByUsername(username) {
    const client = assertSupabase()
    const { data, error } = await client.rpc('get_email_by_username', { p_username: username })
    return { data, error }
  },

  async getUsernameByEmail(email) {
    const client = assertSupabase()
    const { data, error } = await client.rpc('get_username_by_email', { p_email: email })
    return { data, error }
  },

  async resetPasswordForEmail(email) {
    const client = assertSupabase()
    return client.auth.resetPasswordForEmail(email)
  },

  async updatePassword(newPassword) {
    const client = assertSupabase()
    return client.auth.updateUser({ password: newPassword })
  },

  async signInWithGoogle() {
    const client = assertSupabase()
    return client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    })
  },
}
