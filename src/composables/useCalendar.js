import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCalendarStore } from '@/stores/calendar.store'
import { parseDateKey, toDateKey } from '@/utils/date'

export function useCalendar() {
  const calendarStore = useCalendarStore()
  const { selectedDateKey } = storeToRefs(calendarStore)

  const selectedDate = computed({
    get() {
      if (!selectedDateKey.value) return new Date()
      return parseDateKey(selectedDateKey.value)
    },
    set(date) {
      if (date instanceof Date && !Number.isNaN(date.getTime())) {
        calendarStore.selectDate(toDateKey(date))
      }
    },
  })

  const calendarMasks = {
    title: 'YYYY년 MMMM',
    weekdays: 'WWW',
  }

  function onPagesUpdate(pages) {
    const page = pages[0]
    if (page) {
      calendarStore.setMonth(page.year, page.month)
    }
  }

  return {
    selectedDate,
    calendarMasks,
    onPagesUpdate,
    goToToday: calendarStore.goToToday,
  }
}
