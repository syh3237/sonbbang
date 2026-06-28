/**
 * @param {string} startAt ISO datetime or YYYY-MM-DD
 * @param {string} endAt ISO datetime or YYYY-MM-DD
 * @returns {{ start: string, end: string }} YYYY-MM-DD
 */
export function getScheduleDateRange(startAt, endAt) {
  const start = startAt.slice(0, 10)
  const end = endAt.slice(0, 10)
  return { start, end }
}

/**
 * @param {string} dateKey YYYY-MM-DD
 * @param {string} start YYYY-MM-DD
 * @param {string} end YYYY-MM-DD
 */
export function isDateInScheduleRange(dateKey, start, end) {
  return dateKey >= start && dateKey <= end
}
