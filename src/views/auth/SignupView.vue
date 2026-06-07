<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="auth_box">
    <h1>회원가입</h1>
    <p class="auth_message">회원가입 기능은 Supabase 연동 단계에서 구현됩니다.</p>
    <RouterLink class="btn_primary auth_link" :to="{ name: 'login' }">
      로그인으로 이동
    </RouterLink>
    <p class="auth_footer">
      이미 계정이 있으신가요?
      <RouterLink :to="{ name: 'login' }">로그인</RouterLink>
    </p>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as *;

.auth_box {
  display: flex;
  flex-direction: column;
  gap: $space_md;
}

.auth_message {
  color: $color_text_muted;
}

.auth_link {
  text-align: center;
}

.auth_footer {
  font-size: $font_size_sm;
  color: $color_text_muted;
}
</style>
