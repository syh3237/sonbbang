<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

async function handleSubmit() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!username.value.trim()) {
    errorMessage.value = '아이디를 입력해 주세요.'
    return
  }

  const { error } = await authStore.signUp({
    email: email.value,
    password: password.value,
    username: username.value.trim(),
  })

  if (error) {
    errorMessage.value = error.message
  } else {
    successMessage.value = '가입 확인 이메일을 발송했습니다. 이메일을 확인해 주세요.'
  }
}
</script>

<template>
  <section class="auth_box">
    <h1>회원가입</h1>

    <form class="auth_form" @submit.prevent="handleSubmit" novalidate>
      <div class="form_field">
        <label class="form_label" for="username">아이디</label>
        <input
          id="username"
          v-model="username"
          class="form_input"
          type="text"
          placeholder="사용할 아이디 입력"
          autocomplete="username"
          required
        />
      </div>

      <div class="form_field">
        <label class="form_label" for="email">이메일</label>
        <input
          id="email"
          v-model="email"
          class="form_input"
          type="email"
          placeholder="example@email.com"
          autocomplete="email"
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
          placeholder="6자 이상 입력"
          autocomplete="new-password"
          required
        />
      </div>

      <p v-if="errorMessage" class="auth_message is_error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="auth_message">{{ successMessage }}</p>

      <button
        type="submit"
        class="btn_primary auth_submit"
        :class="{ is_disabled: authStore.isLoading }"
        :disabled="authStore.isLoading"
      >
        {{ authStore.isLoading ? '처리 중...' : '회원가입' }}
      </button>
    </form>

    <div class="auth_links">
      <RouterLink class="btn_text" :to="{ name: 'login' }">이미 계정이 있으신가요? 로그인</RouterLink>
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
