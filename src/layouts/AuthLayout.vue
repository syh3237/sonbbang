<template>
  <div class="auth_wrap">
    <div class="auth_area">
      <RouterView />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as *;

.auth_wrap {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0 auto;
  padding: $space_xl $space_md;
  background-color: $color_surface;
}

.auth_area {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
