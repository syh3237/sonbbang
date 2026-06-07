/**
 * @param {number} year
 * @param {number} month 1-12
 */
export function formatYearMonth(year, month) {
  return `${year}년 ${month}월`
}

/**
 * @param {Date} date
 * @returns {string} YYYY-MM-DD
 */
export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * @param {string} dateKey YYYY-MM-DD
 */
export function parseDateKey(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function isToday(date) {
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/**
 * @param {number} year
 * @param {number} month 1-12
 * @returns {{ date: Date, dateKey: string, isCurrentMonth: boolean }[]}
 */
export function buildCalendarDays(year, month) {
  const firstOfMonth = new Date(year, month - 1, 1)
  const startOffset = firstOfMonth.getDay()
  const gridStart = new Date(year, month - 1, 1 - startOffset)

  const days = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + i)
    days.push({
      date,
      dateKey: toDateKey(date),
      isCurrentMonth: date.getMonth() === month - 1,
    })
  }
  return days
}

/**
 * @param {number} year
 * @param {number} month 1-12
 */
export function getMonthRange(year, month) {
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 0, 23, 59, 59, 999)
  return { start, end }
}
