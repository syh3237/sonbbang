<script setup>
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')
const errorMessage = ref('')

async function handleSubmit() {
  errorMessage.value = ''
  const { error } = await authStore.signIn({
    username: username.value.trim(),
    password: password.value,
  })
  if (error) {
    errorMessage.value = error.message
  } else {
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  }
}

async function handleGoogleLogin() {
  const { error } = await authStore.signInWithGoogle()
  if (error) errorMessage.value = error
}
</script>

<template>
  <section class="auth_box">
    <h1>로그인</h1>

    <form class="auth_form" @submit.prevent="handleSubmit" novalidate>
      <div class="form_field">
        <label class="form_label" for="username">아이디</label>
        <input
          id="username"
          v-model="username"
          class="form_input"
          type="text"
          placeholder="아이디 입력"
          autocomplete="username"
          required
        />
      </div>

      <div class="form_field">
        <label class="form_label" for="password">비밀번호</label>
        <input
          id="password"
          v-model="password"
          class="form_input"
          type="password"
          placeholder="비밀번호 입력"
          autocomplete="current-password"
          required
        />
      </div>

      <p v-if="errorMessage" class="auth_message is_error">{{ errorMessage }}</p>

      <button
        type="submit"
        class="btn_primary auth_submit"
        :class="{ is_disabled: authStore.isLoading }"
        :disabled="authStore.isLoading"
      >
        {{ authStore.isLoading ? '처리 중...' : '로그인' }}
      </button>
    </form>

    <div class="auth_divider">
      <span>또는</span>
    </div>

    <button type="button" class="btn_google" @click="handleGoogleLogin">
      <svg class="btn_google_icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Google로 로그인
    </button>

    <div class="auth_links">
      <RouterLink class="btn_text" :to="{ name: 'signup' }">회원가입</RouterLink>
    </div>
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

  &.is_error {
    color: $color_sunday;
  }
}

.auth_divider {
  display: flex;
  align-items: center;
  gap: $space_md;
  color: $color_text_muted;
  font-size: $font_size_sm;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: $border_width;
    background-color: $color_border;
  }
}

.btn_google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space_sm;
  width: 100%;
  min-height: $btn_min_height;
  border: $border_width solid $color_border;
  border-radius: $radius_sm;
  font-weight: 600;
  color: $color_text;
  background-color: $color_surface;

  &:focus-visible {
    outline: $outline_width solid $color_primary;
    outline-offset: $outline_offset;
  }
}

.btn_google_icon {
  width: 1.25rem;
  height: 1.25rem;
}

.auth_links {
  display: flex;
  justify-content: center;
  font-size: $font_size_sm;
}

.btn_text {
  font-size: $font_size_sm;
  font-weight: 600;
  color: $color_primary;
  text-decoration: underline;
}
</style>
