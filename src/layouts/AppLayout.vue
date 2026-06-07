<script setup>
import AppFnb from '@/components/common/AppFnb.vue'
</script>

<template>
  <div class="wrap">
    <main id="main">
      <RouterView />
    </main>
    <AppFnb />
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as *;

.wrap {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0 auto;
  background-color: $color_surface;
}

#main {
  flex: 1;
  padding-bottom: calc(#{$fnb_height} + #{$space_md});
}
</style>
