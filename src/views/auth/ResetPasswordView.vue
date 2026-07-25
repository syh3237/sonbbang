<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { authService } from '@/services/auth.service'

const authStore = useAuthStore()
const router = useRouter()

const newPassword = ref('')
const confirmPassword = ref('')
const message = ref('')
const isError = ref(false)
const isReady = ref(false) // PASSWORD_RECOVERY 세션 확인 완료

onMounted(() => {
  // Supabase가 URL 해시의 토큰을 처리할 때 PASSWORD_RECOVERY 이벤트 발생
  const { data: { subscription } } = authService.onAuthStateChange((event) => {
    if (event === 'PASSWORD_RECOVERY') {
      isReady.value = true
    }
  })

  // 이미 PASSWORD_RECOVERY 세션이 있는 경우 대비 (페이지 새로고침)
  if (authStore.isAuthenticated) {
    isReady.value = true
  }

  return () => subscription.unsubscribe()
})

async function handleSubmit() {
  message.value = ''
  isError.value = false

  if (!newPassword.value) {
    message.value = '새 비밀번호를 입력해 주세요.'
    isError.value = true
    return
  }
  if (newPassword.value.length < 6) {
    message.value = '비밀번호는 6자 이상이어야 합니다.'
    isError.value = true
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    message.value = '비밀번호가 일치하지 않습니다.'
    isError.value = true
    return
  }

  const { error } = await authStore.updatePassword(newPassword.value)
  if (error) {
    message.value = error
    isError.value = true
  } else {
    message.value = '비밀번호가 변경됐습니다. 다시 로그인해 주세요.'
    await authStore.signOut()
    setTimeout(() => router.push({ name: 'login' }), 1500)
  }
}
</script>

<template>
  <section class="auth_box">
    <h1>비밀번호 재설정</h1>

    <template v-if="isReady">
      <form class="auth_form" @submit.prevent="handleSubmit" novalidate>
        <div class="form_field">
          <label class="form_label" for="new_password">새 비밀번호</label>
          <input
            id="new_password"
            v-model="newPassword"
            class="form_input"
            type="password"
            placeholder="6자 이상 입력"
            autocomplete="new-password"
            required
          />
        </div>

        <div class="form_field">
          <label class="form_label" for="confirm_password">비밀번호 확인</label>
          <input
            id="confirm_password"
            v-model="confirmPassword"
            class="form_input"
            type="password"
            placeholder="비밀번호 재입력"
            autocomplete="new-password"
            required
          />
        </div>

        <p v-if="message" class="auth_message" :class="{ is_error: isError }">
          {{ message }}
        </p>

        <button
          type="submit"
          class="btn_primary auth_submit"
          :class="{ is_disabled: authStore.isLoading }"
          :disabled="authStore.isLoading"
        >
          {{ authStore.isLoading ? '처리 중...' : '비밀번호 변경' }}
        </button>
      </form>
    </template>

    <template v-else>
      <p class="auth_message">유효하지 않은 접근입니다. 이메일의 재설정 링크를 다시 클릭해 주세요.</p>
    </template>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as *;

.auth_box {
  display: flex;
  flex-direction: column;
  gap: $space_lg;
}

.auth_form {
  display: flex;
  flex-direction: column;
  gap: $space_md;
}

.auth_submit {
  width: 100%;
  border-radius: $radius_sm;
}

.auth_message {
  font-size: $font_size_sm;
  color: $color_primary;

  &.is_error { color: $color_sunday; }
}
</style>
