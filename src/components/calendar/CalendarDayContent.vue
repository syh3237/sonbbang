<script setup>
import { computed } from 'vue'
import { useScheduleDisplay } from '@/composables/useScheduleDisplay'
import { toDateKey } from '@/utils/date'

const props = defineProps({
  day: { type: Object, required: true },
  dayProps: { type: Object, required: true },
  dayEvents: { type: Object, required: true },
})

const { getSchedulesForDay } = useScheduleDisplay()

/**
 * 슬롯 순서대로 정렬된 행 배열 반환
 * - null 항목 = 슬롯이 비어있는 gap (다른 셀의 이벤트가 이 슬롯을 점유 중)
 * - null을 빈 칸으로 렌더링해야 이벤트 막대 위치가 날짜 전반에 걸쳐 일치
 */
const scheduleRows = computed(() => {
  const currentKey = toDateKey(props.day.date)
  const dayOfWeek = props.day.date.getDay() // 0=일, 6=토

  const daySchedules = getSchedulesForDay(props.day).map((schedule) => {
    const startKey = schedule.start_at.slice(0, 10)
    const endKey = schedule.end_at.slice(0, 10)
    const isSingle = startKey === endKey
    const isActualStart = currentKey === startKey
    const isActualEnd = currentKey === endKey
    const isVisualStart = isSingle || isActualStart || dayOfWeek === 0
    const isVisualEnd = isSingle || isActualEnd || dayOfWeek === 6

    return { ...schedule, isSingle, isVisualStart, isVisualEnd }
  })

  if (!daySchedules.length) return []

  const maxSlot = Math.max(...daySchedules.map(s => s.slotIndex))

  // 슬롯 0 ~ maxSlot 배열 생성, 해당 슬롯 이벤트 없으면 null
  return Array.from({ length: maxSlot + 1 }, (_, i) =>
    daySchedules.find(s => s.slotIndex === i) ?? null
  )
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
    <ul v-if="scheduleRows.length" class="calendar_schedule_list">
      <li
        v-for="(schedule, idx) in scheduleRows"
        :key="schedule ? schedule.id : `gap-${idx}`"
        class="item_schedule"
      >
        <!-- 이벤트 막대 -->
        <span
          v-if="schedule"
          class="calendar_schedule_label"
          :class="{
            is_single: schedule.isSingle,
            is_start: schedule.isVisualStart && !schedule.isVisualEnd,
            is_end: schedule.isVisualEnd && !schedule.isVisualStart,
          }"
          :style="{ backgroundColor: schedule.color }"
          :title="schedule.title"
        >
          <template v-if="schedule.isVisualStart">{{ schedule.title }}</template>
        </span>
        <!-- 빈 슬롯: 다른 셀의 이벤트가 이 줄을 점유 중 -->
        <span v-else class="calendar_schedule_gap" aria-hidden="true" />
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
  color: $color_text;
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
  overflow: hidden;
  min-height: calc(#{$font_size_sm} * 1.6);
  font-size: $font_size_sm;
  line-height: 1.6;
  color: $color_selected_text;
  // backgroundColor는 인라인 스타일로 이벤트별 색상 적용

  &.is_single {
    border-radius: 2px;
    padding: 0 $space_xs;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.is_start {
    border-radius: 2px 0 0 2px;
    padding: 0 0 0 $space_xs;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.is_end {
    border-radius: 0 2px 2px 0;
  }
}

// 빈 슬롯: 막대 높이만큼 공간 확보
.calendar_schedule_gap {
  display: block;
  min-height: calc(#{$font_size_sm} * 1.6);
}
</style>
