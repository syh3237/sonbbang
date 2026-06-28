<script setup>
import { computed } from 'vue'
import { Calendar } from 'v-calendar'
import CalendarDayContent from '@/components/calendar/CalendarDayContent.vue'
import { useCalendar } from '@/composables/useCalendar'

const { selectedDate, calendarMasks, onPagesUpdate } = useCalendar()

const selectAttribute = computed(() => ({
  key: 'selected',
  highlight: true,
  dates: selectedDate.value,
  pinPage: true,
}))

function handleDayClick(day) {
  selectedDate.value = day.date
}
</script>

<template>
  <Calendar
    locale="ko"
    :masks="calendarMasks"
    :attributes="[selectAttribute]"
    borderless
    expanded
    transparent
    @dayclick="handleDayClick"
    @update:pages="onPagesUpdate"
  >
    <template #day-content="{ day, dayProps, dayEvents }">
      <CalendarDayContent
        :day="day"
        :day-props="dayProps"
        :day-events="dayEvents"
      />
    </template>
  </Calendar>
</template>
