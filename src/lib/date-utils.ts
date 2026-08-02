/** `YYYY-MM-DD` in UTC — concert dates are stored as UTC midnight. */
export const toUtcDateString = (date: Date) => date.toISOString().slice(0, 10)

/** `HH:MM` in UTC, or `''` when the time is midnight, which means "no start time given". */
export const toUtcTimeString = (date: Date) => {
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  if (hours === 0 && minutes === 0) return ''
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
