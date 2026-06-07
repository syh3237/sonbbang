import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const session = ref(null)
  const profile = ref(null)
  const isInitialized = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!session.value)
  const userId = computed(() => session.value?.user?.id ?? null)

  async function initAuth() {
    // Supabase 연동 단계에서 authService와 연결
    isInitialized.value = true
  }

  return {
    session,
    profile,
    isInitialized,
    error,
    isAuthenticated,
    userId,
    initAuth,
  }
})
