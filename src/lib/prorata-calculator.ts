import type { MonthPeriod } from '@/types/receipt'
import { getDaysInMonth, getDaysOccupied } from './date-utils'

export interface ProrataResult {
  loyerHorsCharges: number
  charges: number
  total: number
  daysOccupied: number
  daysInMonth: number
}

/**
 * Calculate prorata amount for a partial month
 * Formula: (fullAmount / daysInMonth) × daysOccupied
 * Rounds to nearest cent (standard rounding)
 */
export function calculateProrataAmount(
  fullAmount: number,
  daysOccupied: number,
  daysInMonth: number
): number {
  const prorata = (fullAmount / daysInMonth) * daysOccupied
  // Round to 2 decimals (nearest cent)
  return Math.round(prorata * 100) / 100
}

/**
 * Calculate rent and charges for a month period (full or prorated)
 * Applies prorata to both rent and charges if month is partial
 */
export function calculateMonthProrata(
  monthPeriod: MonthPeriod,
  fullLoyer: number,
  fullCharges: number
): ProrataResult {
  const daysInMonth = getDaysInMonth(monthPeriod.year, monthPeriod.month)

  // If full month, return full amounts
  if (!monthPeriod.isPartial) {
    return {
      loyerHorsCharges: fullLoyer,
      charges: fullCharges,
      total: fullLoyer + fullCharges,
      daysOccupied: daysInMonth,
      daysInMonth,
    }
  }

  // Partial month: calculate prorata
  const daysOccupied = getDaysOccupied(monthPeriod.startDate, monthPeriod.endDate)

  const prorataLoyer = calculateProrataAmount(fullLoyer, daysOccupied, daysInMonth)
  const prorataCharges = calculateProrataAmount(fullCharges, daysOccupied, daysInMonth)

  return {
    loyerHorsCharges: prorataLoyer,
    charges: prorataCharges,
    total: prorataLoyer + prorataCharges,
    daysOccupied,
    daysInMonth,
  }
}
