<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

const mode = ref('find_id') // 'find_id' | 'find_pw'
const email = ref('')
const message = ref('')
const isError = ref(false)
const isDone = ref(false)

function switchMode(next) {
  mode.value = next
  email.value = ''
  message.value = ''
  isError.value = false
  isDone.value = false
}

async function handleSubmit() {
  message.value = ''
  isError.value = false
  isDone.value = false

  const trimmed = email.value.trim()
  if (!trimmed) {
    message.value = '이메일을 입력해 주세요.'
    isError.value = true
    return
  }

  if (mode.value === 'find_id') {
    const { username, error } = await authStore.findUsername(trimmed)
    if (error) {
      message.value = error
      isError.value = true
    } else {
      message.value = `가입된 아이디: ${username}`
      isDone.value = true
    }
  } else {
    const { error } = await authStore.resetPassword(trimmed)
    if (error) {
      message.value = error
      isError.value = true
    } else {
      message.value = '비밀번호 재설정 링크를 이메일로 보냈습니다.'
      isDone.value = true
    }
  }
}
</script>

<template>
  <section class="auth_box">
    <h1>계정 찾기</h1>

    <div class="tab_row">
      <button
        type="button"
        class="tab_btn"
        :class="{ is_active: mode === 'find_id' }"
        @click="switchMode('find_id')"
      >아이디 찾기</button>
      <button
        type="button"
        class="tab_btn"
        :class="{ is_active: mode === 'find_pw' }"
        @click="switchMode('find_pw')"
      >비밀번호 찾기</button>
    </div>

    <form class="auth_form" @submit.prevent="handleSubmit" novalidate>
      <div class="form_field">
        <label class="form_label" for="email">
          {{ mode === 'find_id' ? '가입 시 사용한 이메일' : '가입된 이메일' }}
        </label>
        <input
          id="email"
          v-model="email"
          class="form_input"
          type="email"
          placeholder="이메일 입력"
          autocomplete="email"
          required
        />
      </div>

      <p v-if="message" class="auth_message" :class="{ is_error: isError, is_success: isDone }">
        {{ message }}
      </p>

      <button
        v-if="!isDone"
        type="submit"
        class="btn_primary auth_submit"
        :class="{ is_disabled: authStore.isLoading }"
        :disabled="authStore.isLoading"
      >
        {{ authStore.isLoading ? '처리 중...' : (mode === 'find_id' ? '아이디 찾기' : '재설정 메일 보내기') }}
      </button>
    </form>

    <div class="auth_links">
      <RouterLink class="btn_text" :to="{ name: 'login' }">로그인으로 돌아가기</RouterLink>
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

.tab_row {
  display: flex;
  border-bottom: $border_width solid $color_border;
}

.tab_btn {
  flex: 1;
  padding: $space_sm 0;
  font-size: $font_size_base;
  font-weight: 600;
  color: $color_text_muted;
  border-bottom: 2px solid transparent;
  margin-bottom: -$border_width;
  transition: color 0.15s, border-color 0.15s;

  &.is_active {
    color: $color_primary;
    border-bottom-color: $color_primary;
  }
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

  &.is_error { color: $color_sunday; }
  &.is_success { color: $color_primary; }
}

.auth_links {
  display: flex;
  justify-content: center;
}

.btn_text {
  font-size: $font_size_sm;
  font-weight: 600;
  color: $color_primary;
  text-decoration: underline;
}
</style>
