/**
 * Utility functions for date calculations, comparisons, and formatting.
 * Uses local time components to avoid timezone shift issues with ISO strings.
 */

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTomorrowString(fromDateStr?: string): string {
  let baseDate: Date;
  if (fromDateStr) {
    const parts = fromDateStr.split("-").map(Number);
    if (parts.length === 3) {
      baseDate = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      baseDate = new Date(fromDateStr);
    }
  } else {
    baseDate = new Date();
  }

  const nextDay = new Date(baseDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const year = nextDay.getFullYear();
  const month = String(nextDay.getMonth() + 1).padStart(2, "0");
  const day = String(nextDay.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;

  const startParts = checkIn.split("-").map(Number);
  const endParts = checkOut.split("-").map(Number);

  if (startParts.length !== 3 || endParts.length !== 3) return 0;

  const startDate = new Date(startParts[0], startParts[1] - 1, startParts[2]);
  const endDate = new Date(endParts[0], endParts[1] - 1, endParts[2]);

  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
}

export function isDateBeforeToday(dateStr: string): boolean {
  if (!dateStr) return false;
  const todayStr = getTodayString();
  return dateStr < todayStr;
}

export function isValidDateString(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function isCheckOutValid(checkIn: string, checkOut: string): boolean {
  if (!checkIn || !checkOut) return false;
  return checkOut > checkIn;
}
