import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { toDateKey } from '@/utils/date'

export const useCalendarStore = defineStore('calendar', () => {
  const now = new Date()

  const currentYear = ref(now.getFullYear())
  const currentMonth = ref(now.getMonth() + 1)
  const selectedDateKey = ref(toDateKey(now))

  const selectedDate = computed(() => {
    if (!selectedDateKey.value) return null
    const [y, m, d] = selectedDateKey.value.split('-').map(Number)
    return new Date(y, m - 1, d)
  })

  function setMonth(year, month) {
    currentYear.value = year
    currentMonth.value = month
  }

  function selectDate(dateKey) {
    selectedDateKey.value = dateKey
  }

  function goToPrevMonth() {
    if (currentMonth.value === 1) {
      setMonth(currentYear.value - 1, 12)
    } else {
      setMonth(currentYear.value, currentMonth.value - 1)
    }
  }

  function goToNextMonth() {
    if (currentMonth.value === 12) {
      setMonth(currentYear.value + 1, 1)
    } else {
      setMonth(currentYear.value, currentMonth.value + 1)
    }
  }

  function goToToday() {
    const today = new Date()
    setMonth(today.getFullYear(), today.getMonth() + 1)
    selectedDateKey.value = toDateKey(today)
  }

  return {
    currentYear,
    currentMonth,
    selectedDateKey,
    selectedDate,
    setMonth,
    selectDate,
    goToPrevMonth,
    goToNextMonth,
    goToToday,
  }
})
