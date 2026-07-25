import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useScheduleStore } from '@/stores/schedule.store'
import { toDateKey } from '@/utils/date'
import { getScheduleDateRange, isDateInScheduleRange } from '@/utils/schedule'

// 이벤트별 자동 색상 팔레트
const COLOR_PALETTE = [
  '#4f7ef8', // blue
  '#e85d75', // rose
  '#0ea5e9', // sky
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#10b981', // emerald
  '#f97316', // orange
  '#06b6d4', // cyan
]

function hashId(id) {
  let hash = 0
  const str = String(id)
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

function getEventColor(id) {
  return COLOR_PALETTE[hashId(id) % COLOR_PALETTE.length]
}

/**
 * 전체 이벤트에 slotIndex 할당
 * - 겹치는 이벤트끼리 서로 다른 슬롯을 사용하도록 보장
 * - 같은 이벤트는 날짜가 달라져도 항상 같은 슬롯에 위치
 */
function assignSlots(events) {
  // 시작일 오름차순, 동일 시작이면 기간 긴 것 먼저 (낮은 슬롯 선점)
  const sorted = [...events].sort((a, b) => {
    const sa = a.start_at.slice(0, 10)
    const sb = b.start_at.slice(0, 10)
    if (sa !== sb) return sa < sb ? -1 : 1
    const ea = a.end_at.slice(0, 10)
    const eb = b.end_at.slice(0, 10)
    return eb > ea ? 1 : eb < ea ? -1 : 0
  })

  const slotEnds = [] // slotEnds[i] = 슬롯 i를 마지막으로 쓴 이벤트의 endKey
  const slotMap = new Map() // id → slotIndex

  for (const event of sorted) {
    const startKey = event.start_at.slice(0, 10)
    const endKey = event.end_at.slice(0, 10)
    // 빈 슬롯 중 가장 낮은 번호를 찾음 (없으면 새 슬롯 추가)
    let slot = slotEnds.findIndex(slotEnd => startKey > slotEnd)
    if (slot === -1) slot = slotEnds.length
    slotEnds[slot] = endKey
    slotMap.set(event.id, slot)
  }

  return events.map(e => ({
    ...e,
    slotIndex: slotMap.get(e.id),
    color: getEventColor(e.id),
  }))
}

export function useScheduleDisplay() {
  const scheduleStore = useScheduleStore()
  const { items } = storeToRefs(scheduleStore)

  // items 변경 시에만 슬롯/색상 재계산
  const itemsWithMeta = computed(() => assignSlots(items.value))

  function getSchedulesForDay(day) {
    const dateKey = toDateKey(day.date)
    return itemsWithMeta.value.filter((schedule) => {
      const { start, end } = getScheduleDateRange(schedule.start_at, schedule.end_at)
      return isDateInScheduleRange(dateKey, start, end)
    })
  }

  return { getSchedulesForDay }
}
