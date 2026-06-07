import { useAuthStore } from '@/stores/auth.store'

export function setupRouterGuards(router) {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore()

    if (!authStore.isInitialized) {
      await authStore.initAuth()
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return {
        name: 'login',
        query: { redirect: to.fullPath },
      }
    }

    if (to.meta.guestOnly && authStore.isAuthenticated) {
      return { name: 'home' }
    }

    return true
  })
}
