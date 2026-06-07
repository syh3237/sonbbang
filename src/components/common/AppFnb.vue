<script setup>
import { useRoute } from 'vue-router'
import IconExpense from '@/components/common/icons/IconExpense.vue'
import IconHome from '@/components/common/icons/IconHome.vue'
import IconMypage from '@/components/common/icons/IconMypage.vue'

const route = useRoute()

const fnbItems = [
  {
    name: 'expense',
    label: '가계부',
    icon: IconExpense,
    is_disabled: true,
  },
  {
    name: 'home',
    label: '홈',
    icon: IconHome,
    to: { name: 'home' },
  },
  {
    name: 'mypage',
    label: '마이페이지',
    icon: IconMypage,
    to: { name: 'mypage' },
  },
]

function isActive(name) {
  return route.name === name
}
</script>

<template>
  <nav class="app_fnb" aria-label="하단 메뉴">
    <ul class="app_fnb_list">
      <li
        v-for="item in fnbItems"
        :key="item.name"
        class="app_fnb_item"
      >
        <button
          v-if="item.is_disabled"
          type="button"
          class="app_fnb_link is_disabled"
          :aria-label="`${item.label}, 준비중`"
          disabled
        >
          <component :is="item.icon" class="app_fnb_icon" />
          <span class="blind">{{ item.label }}</span>
        </button>
        <RouterLink
          v-else
          :to="item.to"
          class="app_fnb_link"
          :class="{ is_active: isActive(item.name) }"
          :aria-label="item.label"
        >
          <component :is="item.icon" class="app_fnb_icon" />
          <span class="blind">{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as *;

.app_fnb {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: $z_fnb;
  width: 100%;
  border-top: $border_width solid $color_border;
  background-color: $color_surface;
}

.app_fnb_list {
  display: flex;
}

.app_fnb_item {
  flex: 1;
}

.app_fnb_link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: $fnb_height;
  padding: $space_sm $space_xs;
  color: $color_text_muted;

  &.is_active {
    color: $color_primary;
  }

  &.is_disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.app_fnb_icon {
  display: block;
  width: $icon_size_fnb;
  height: $icon_size_fnb;
}
</style>
