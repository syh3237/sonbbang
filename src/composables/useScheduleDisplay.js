import { storeToRefs } from 'pinia'
import { useScheduleStore } from '@/stores/schedule.store'
import { toDateKey } from '@/utils/date'
import { getScheduleDateRange, isDateInScheduleRange } from '@/utils/schedule'

export function useScheduleDisplay() {
  const scheduleStore = useScheduleStore()
  const { items } = storeToRefs(scheduleStore)

  function getSchedulesForDay(day) {
    const dateKey = toDateKey(day.date)

    return items.value.filter((schedule) => {
      const { start, end } = getScheduleDateRange(schedule.start_at, schedule.end_at)
      return isDateInScheduleRange(dateKey, start, end)
    })
  }

  return {
    getSchedulesForDay,
  }
}
