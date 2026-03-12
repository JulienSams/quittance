import type { MonthPeriod } from '@/types/receipt'

/**
 * Get the last day of a given month
 */
export function getLastDayOfMonth(year: number, month: number): number {
  // month is 0-indexed (0=Jan, 11=Dec)
  // Setting day to 0 of next month gives last day of current month
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Generate a list of all months between start and end dates (inclusive)
 * Detects partial first and last months
 */
export function generateMonthsInRange(startDate: Date, endDate: Date): MonthPeriod[] {
  const months: MonthPeriod[] = []

  // Start from the first day we need to cover
  let currentYear = startDate.getFullYear()
  let currentMonth = startDate.getMonth()

  const endYear = endDate.getFullYear()
  const endMonth = endDate.getMonth()

  while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
    const lastDayOfMonth = getLastDayOfMonth(currentYear, currentMonth)

    // Determine the actual start and end dates for this month
    let monthStartDate: Date
    let monthEndDate: Date
    let isPartial = false

    // First month: might start mid-month
    if (currentYear === startDate.getFullYear() && currentMonth === startDate.getMonth()) {
      monthStartDate = new Date(startDate)
      isPartial = startDate.getDate() !== 1
    } else {
      monthStartDate = new Date(currentYear, currentMonth, 1)
    }

    // Last month: might end mid-month
    if (currentYear === endYear && currentMonth === endMonth) {
      monthEndDate = new Date(endDate)
      isPartial = isPartial || endDate.getDate() !== lastDayOfMonth
    } else {
      monthEndDate = new Date(currentYear, currentMonth, lastDayOfMonth)
    }

    months.push({
      year: currentYear,
      month: currentMonth,
      startDate: monthStartDate,
      endDate: monthEndDate,
      isPartial,
    })

    // Move to next month
    currentMonth++
    if (currentMonth > 11) {
      currentMonth = 0
      currentYear++
    }
  }

  return months
}

/**
 * Get the number of days in a specific month (handles leap years)
 */
export function getDaysInMonth(year: number, month: number): number {
  return getLastDayOfMonth(year, month)
}

/**
 * Count days between two dates (inclusive)
 * If start=15th, end=20th, that's 6 days (15,16,17,18,19,20)
 */
export function getDaysOccupied(startDate: Date, endDate: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24
  const diffMs = endDate.getTime() - startDate.getTime()
  return Math.floor(diffMs / msPerDay) + 1
}
