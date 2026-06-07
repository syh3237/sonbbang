<script setup>
import { DatePicker } from 'v-calendar'
import { useCalendar } from '@/composables/useCalendar'

const { selectedDate, calendarMasks, onPagesUpdate, goToToday } = useCalendar()
</script>

<template>
  <section class="calendar_wrap">
    <h1 class="blind">일정 캘린더</h1>

    <div class="calendar_area">
      <div class="calendar_box">
        <DatePicker v-model="selectedDate" locale="ko" mode="date" :popover="false" :masks="calendarMasks" borderless
          expanded transparent @update:pages="onPagesUpdate" />
      </div>

      <div class="calendar_toolbar">
        <button type="button" class="btn_ghost calendar_today_button" @click="goToToday">
          오늘
        </button>
      </div>

      <aside class="calendar_selected_area" aria-live="polite">
        <p class="calendar_selected_label">
          선택한 날짜:
          <time class="calendar_selected_date"></time>
        </p>
        <p class="calendar_selected_hint">
          일정 등록 기능은 다음 단계에서 연결됩니다.
        </p>
      </aside>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as *;

.calendar_wrap {
  width: 100%;
}

.calendar_area {
  display: flex;
  flex-direction: column;
}

.calendar_box {
  border: $border_width solid $color_border;
  border-radius: $radius_md;
  overflow: hidden;

  :deep(.vc-container) {
    width: 100%;
    font-family: $font_family_base;
    --vc-accent-50: #{$color_today};
    --vc-accent-100: #{$color_today};
    --vc-accent-200: #{$color_primary};
    --vc-accent-500: #{$color_primary};
    --vc-accent-600: #{$color_primary};
    --vc-accent-700: #{$color_primary_dark};
    --vc-accent-800: #{$color_primary_dark};
    --vc-accent-900: #{$color_primary_dark};
  }

  :deep(.vc-weeks) {
    padding: 0;
  }

  :deep(.vc-weekday:nth-child(1)) {
    color: $color_sunday;
  }

  :deep(.vc-weekday:nth-child(7)) {
    color: $color_primary;
  }

  :deep(.vc-day.is-not-in-month .vc-day-content) {
    color: $color_other_month;
  }

  :deep(.vc-weekday) {
    font-size: $font_size_sm;
  }

  :deep(.vc-weekdays) {
    &+.vc-week {
      border-top: 1px solid $color_border;
    }
  }

  :deep(.vc-day) {
    align-items: flex-start;
    min-height: $calendar_cell_min_height;

    .vc-day-content {
      font-size: $font_size_base;
      height: $font_size_lg;

      &:hover {
        background-color: transparent;
        box-shadow: none;
      }
    }

    .vc-highlight {
      width: 100%;
      height: 100%;
    }

    .vc-highlight-bg-solid {
      border-radius: 0;
    }
  }
}

.calendar_toolbar {
  display: flex;
  justify-content: flex-end;
  margin-top: $space_sm;
}

.calendar_today_button {
  padding: $space_sm $space_md;
  font-size: $font_size_sm;
  font-weight: 600;
  color: $color_primary;
}

.calendar_selected_area {
  margin: $space_lg $space_md $space_md;
  padding: $space_md;
  border-radius: $radius_sm;
  background-color: $color_background;
}

.calendar_selected_label {
  font-size: $font_size_lg;
  font-weight: 600;
  color: $color_text;
}

.calendar_selected_hint {
  margin-top: $space_xs;
  font-size: $font_size_base;
  color: $color_text_muted;
}
</style>
