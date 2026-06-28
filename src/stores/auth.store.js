import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import { profileService } from '@/services/profile.service'
import { toKoreanError } from '@/utils/auth-errors'

export const useAuthStore = defineStore('auth', () => {
  const session = ref(null)
  const profile = ref(null)
  const isInitialized = ref(false)
  const isLoading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!session.value)
  const userId = computed(() => session.value?.user?.id ?? null)

  const displayName = computed(() => {
    if (profile.value?.display_name) {
      return profile.value.display_name
    }
    if (session.value?.user?.user_metadata?.display_name) {
      return session.value.user.user_metadata.display_name
    }
  })

  async function initAuth() {
    const { data, error: err } = await authService.getSession()
    session.value = data ?? null
    error.value = err ?? null
    isInitialized.value = true

    authService.onAuthStateChange((_event, newSession) => {
      session.value = newSession ?? null
    })
  }

  async function signIn({ username, password }) {
    isLoading.value = true
    error.value = null

    // username → email 변환
    const { data: email, error: rpcErr } = await authService.getEmailByUsername(username)
    if (rpcErr || !email) {
      error.value = '아이디 또는 비밀번호를 확인해 주세요.'
      isLoading.value = false
      return { error: { message: error.value } }
    }

    const { data, error: err } = await authService.signIn({ email, password })
    if (err) {
      error.value = '아이디 또는 비밀번호를 확인해 주세요.'
    } else {
      session.value = data.session
    }
    isLoading.value = false
    return { error: err }
  }

  async function signUp({ email, password, username }) {
    isLoading.value = true
    error.value = null

    // username 중복 체크
    const isTaken = await profileService.isUsernameTaken(username)
    if (isTaken) {
      error.value = '이미 사용 중인 아이디입니다.'
      isLoading.value = false
      return { error: { message: error.value } }
    }

    // 계정 생성 (트리거가 자동으로 profiles 행 생성)
    const { data, error: err } = await authService.signUp({ email, password, username })
    if (err) {
      error.value = toKoreanError(err.message)
      isLoading.value = false
      return { error: { message: error.value } }
    }

    session.value = data.session
    isLoading.value = false
    return { error: null }
  }

  async function signOut() {
    await authService.signOut()
    session.value = null
    profile.value = null
  }

  async function findUsername(email) {
    isLoading.value = true
    const { data: username, error: err } = await authService.getUsernameByEmail(email)
    isLoading.value = false
    if (err || !username) return { username: null, error: '해당 이메일로 가입된 아이디가 없습니다.' }
    return { username, error: null }
  }

  async function resetPassword(email) {
    isLoading.value = true
    const { error: err } = await authService.resetPasswordForEmail(email)
    isLoading.value = false
    if (err) return { error: toKoreanError(err.message) }
    return { error: null }
  }

  async function signInWithGoogle() {
    const { error: err } = await authService.signInWithGoogle()
    if (err) return { error: toKoreanError(err.message) }
    return { error: null }
  }

  async function updateDisplayName(displayName) {
    isLoading.value = true
    const { error: err } = await profileService.updateDisplayName({
      userId: userId.value,
      displayName,
    })
    isLoading.value = false
    if (err) return { error: toKoreanError(err.message) }
    if (profile.value) profile.value.display_name = displayName
    return { error: null }
  }

  async function updatePassword(newPassword) {
    isLoading.value = true
    const { error: err } = await authService.updatePassword(newPassword)
    isLoading.value = false
    if (err) return { error: toKoreanError(err.message) }
    return { error: null }
  }

  return {
    session,
    profile,
    isInitialized,
    isLoading,
    error,
    isAuthenticated,
    userId,
    displayName,
    initAuth,
    signIn,
    signUp,
    signOut,
    findUsername,
    resetPassword,
    signInWithGoogle,
    updateDisplayName,
    updatePassword,
  }
})
