<script setup>
import { computed, onMounted } from 'vue'
import { useCalendar } from '@/composables/useCalendar'
import { useSchedule } from '@/composables/useSchedule'
import { useScheduleDisplay } from '@/composables/useScheduleDisplay'
import { useScheduleStore } from '@/stores/schedule.store'
import { useCalendarStore } from '@/stores/calendar.store'
import ScheduleCalendar from '@/components/calendar/ScheduleCalendar.vue'
import ScheduleFormPanel from '@/components/schedule/ScheduleFormPanel.vue'

const { selectedDate, goToToday } = useCalendar()
const { isFormOpen, openForm, openEditForm, closeForm } = useSchedule()
const { getSchedulesForDay } = useScheduleDisplay()
const scheduleStore = useScheduleStore()
const calendarStore = useCalendarStore()

const selectedSchedules = computed(() =>
  getSchedulesForDay({ date: selectedDate.value })
)

onMounted(() => {
  scheduleStore.fetchByMonth(calendarStore.currentYear, calendarStore.currentMonth)
})
</script>

<template>
  <section class="calendar_wrap">
    <h1 class="blind">일정 캘린더</h1>

    <div class="calendar_area">
      <div class="calendar_box">
        <ScheduleCalendar />
      </div>

      <div class="calendar_toolbar">
        <button type="button" class="btn_ghost calendar_today_button" @click="goToToday">
          오늘
        </button>
      </div>

      <aside class="calendar_selected_area" aria-live="polite">
        <p class="calendar_selected_label">
          <time class="calendar_selected_date" :datetime="selectedDate.toISOString().slice(0, 10)">
            {{ selectedDate.getMonth() + 1 }}월 {{ selectedDate.getDate() }}일
          </time>
        </p>
        <ul v-if="selectedSchedules.length" class="selected_schedule_list">
          <li
            v-for="schedule in selectedSchedules"
            :key="schedule.id"
            class="selected_schedule_item"
          >
            <span class="selected_schedule_title">{{ schedule.title }}</span>
            <button
              type="button"
              class="btn_schedule_edit"
              @click="openEditForm(schedule)"
            >
              수정
            </button>
          </li>
        </ul>
        <p v-else class="calendar_selected_hint">
          일정을 추가하면 캘린더에 일정 제목이 표시됩니다.
        </p>
      </aside>

      <button type="button" class="btn_primary btn_add" aria-label="일정 추가" @click="openForm">
        <span class="btn_add_icon" aria-hidden="true">+</span>
      </button>
    </div>

    <Teleport to="body">
      <Transition name="schedule_overlay_fade">
        <button
          v-if="isFormOpen"
          type="button"
          class="schedule_overlay"
          aria-label="일정 등록 닫기"
          @click="closeForm"
        />
      </Transition>

      <Transition name="schedule_slide">
        <ScheduleFormPanel v-if="isFormOpen" />
      </Transition>
    </Teleport>
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
    & + .vc-week {
      border-top: $border_width solid $color_border;
    }
  }

  :deep(.vc-day) {
    align-items: flex-start;
    min-height: $calendar_cell_min_height;

    .vc-highlight {
      width: 100%;
      height: 100%;
    }

    .vc-highlight-bg-solid {
      border-radius: 0;
      background-color: transparent !important;
      box-shadow: inset 0 0 0 2px #{$color_primary};
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

.selected_schedule_list {
  display: flex;
  flex-direction: column;
  gap: $space_xs;
  margin-top: $space_xs;
}

.selected_schedule_item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space_sm;
  padding: $space_sm $space_md;
  border-radius: $radius_sm;
  background-color: $color_surface;
}

.selected_schedule_title {
  font-size: $font_size_sm;
  color: $color_text;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn_schedule_edit {
  flex-shrink: 0;
  font-size: $font_size_sm;
  font-weight: 600;
  color: $color_primary;
  text-decoration: underline;
}

.btn_add {
  position: fixed;
  right: $space_md;
  bottom: calc(#{$fnb_height} + #{$space_md});
  z-index: $z_fnb - 1;
  width: $btn_icon_min_size;
  height: $btn_icon_min_size;
  padding: 0;
  border-radius: 50%;
}

.btn_add_icon {
  font-size: $font_size_xl;
  line-height: 1;
}

.schedule_overlay {
  position: fixed;
  inset: 0;
  z-index: $z_schedule_overlay;
  border: none;
  background-color: rgba(0, 0, 0, 0.4);
  cursor: default;
}

:global(.schedule_overlay_fade_enter-active),
:global(.schedule_overlay_fade_leave-active) {
  transition: opacity 0.3s ease;
}

:global(.schedule_overlay_fade-enter-from),
:global(.schedule_overlay_fade-leave-to) {
  opacity: 0;
}

:global(.schedule_slide-enter-active),
:global(.schedule_slide-leave-active) {
  transition: transform 0.3s ease;
}

:global(.schedule_slide-enter-from),
:global(.schedule_slide-leave-to) {
  transform: translateX(100%);
}
</style>
