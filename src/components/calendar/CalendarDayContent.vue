<script setup>
import { computed } from 'vue'
import { useScheduleDisplay } from '@/composables/useScheduleDisplay'
import { toDateKey } from '@/utils/date'

const props = defineProps({
  day: {
    type: Object,
    required: true,
  },
  dayProps: {
    type: Object,
    required: true,
  },
  dayEvents: {
    type: Object,
    required: true,
  },
})

const { getSchedulesForDay } = useScheduleDisplay()

const schedules = computed(() => {
  const currentKey = toDateKey(props.day.date)
  const dayOfWeek = props.day.date.getDay() // 0=일, 6=토

  return getSchedulesForDay(props.day)
    .map((schedule) => {
      const startKey = schedule.start_at.slice(0, 10)
      const endKey = schedule.end_at.slice(0, 10)
      const isSingle = startKey === endKey
      const isActualStart = currentKey === startKey
      const isActualEnd = currentKey === endKey

      // 주 경계(일요일 or 토요일)도 시각적 시작/끝으로 처리
      const isVisualStart = isSingle || isActualStart || dayOfWeek === 0
      const isVisualEnd = isSingle || isActualEnd || dayOfWeek === 6

      // 기간 일정 텍스트 중앙 정렬: 이번 주 행에서 몇 칸을 차지하는지 계산
      let daysInRow = 1
      if (!isSingle && isVisualStart) {
        const endDate = new Date(endKey + 'T00:00:00')
        const cellDate = new Date(currentKey + 'T00:00:00')
        const daysToSaturday = 6 - dayOfWeek
        const daysToEnd = Math.round((endDate - cellDate) / (1000 * 60 * 60 * 24))
        daysInRow = Math.min(daysToSaturday, daysToEnd) + 1
      }

      return { ...schedule, isSingle, isVisualStart, isVisualEnd, daysInRow }
    })
    .sort((a, b) => {
      // 기간 일정(multi-day) 먼저, 단일 일정 나중
      if (!a.isSingle && b.isSingle) return -1
      if (a.isSingle && !b.isSingle) return 1
      // 같은 유형이면 시작일 오름차순
      return a.start_at < b.start_at ? -1 : a.start_at > b.start_at ? 1 : 0
    })
})
</script>

<template>
  <div
    class="calendar_day_content"
    :class="{ is_other_month: !day.inMonth }"
    v-bind="dayProps"
    v-on="dayEvents"
  >
    <span class="calendar_date_number">{{ day.day }}</span>
    <ul v-if="schedules.length" class="calendar_schedule_list">
      <li
        v-for="schedule in schedules"
        :key="schedule.id"
        class="item_schedule"
      >
        <span
          class="calendar_schedule_label"
          :class="{
            is_single: schedule.isSingle,
            is_start: schedule.isVisualStart && !schedule.isVisualEnd,
            is_end: schedule.isVisualEnd && !schedule.isVisualStart,
          }"
          :title="schedule.title"
        >
          <!-- 단일 일정: 텍스트 직접 -->
          <template v-if="schedule.isSingle">{{ schedule.title }}</template>
          <!-- 기간 일정 시작: 전체 span 너비로 텍스트 중앙 정렬 -->
          <span
            v-else-if="schedule.isVisualStart"
            class="label_text_multi"
            :style="{ width: `calc(${schedule.daysInRow} * 100%)` }"
          >{{ schedule.title }}</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as *;

.calendar_day_content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  min-height: 100%;
  text-align: left;

  &.is_other_month {
    .calendar_date_number {
      color: $color_other_month;
    }

    .calendar_schedule_label {
      opacity: 0.4;
    }
  }
}

.calendar_date_number {
  flex-shrink: 0;
  padding: $space_xs $space_xs 0;
  font-size: $font_size_base;
  font-weight: 600;
  line-height: 1.2;
}

.calendar_schedule_list {
  width: 100%;
  margin-top: $space_xs;
}

.item_schedule {
  width: 100%;

  & + & {
    margin-top: $space_xs;
  }
}

.calendar_schedule_label {
  display: block;
  position: relative;
  overflow: visible; // 기간 일정 텍스트가 인접 셀까지 확장되도록
  min-height: calc(#{$font_size_sm} * 1.6);
  background-color: $color_primary;

  // 단일 일정: 텍스트 포함, 클립
  &.is_single {
    border-radius: 2px;
    overflow: hidden;
    font-size: $font_size_sm;
    line-height: 1.6;
    color: $color_selected_text;
    padding: 0 $space_xs;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.is_start { border-radius: 2px 0 0 2px; }
  &.is_end   { border-radius: 0 2px 2px 0; }
  // 중간 셀은 기본값(border-radius: 0)이므로 별도 클래스 불필요
}

// 기간 일정 텍스트: 전체 bar 너비에 걸쳐 중앙 정렬
.label_text_multi {
  display: block;
  font-size: $font_size_sm;
  line-height: 1.6;
  color: $color_selected_text;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  pointer-events: none;
}
</style>
