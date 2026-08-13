export interface HoursRange {
  open: string; // "HH:MM" 24-hour
  close: string; // "HH:MM" 24-hour
}

// Mirrors the hours listed in the site footer. Sunday is closed.
const HOURS_BY_WEEKDAY: Record<number, HoursRange | null> = {
  0: null, // Sunday - closed
  1: { open: '09:00', close: '18:00' }, // Monday
  2: { open: '09:00', close: '18:00' }, // Tuesday
  3: { open: '09:00', close: '18:00' }, // Wednesday
  4: { open: '09:00', close: '18:00' }, // Thursday
  5: { open: '09:00', close: '18:00' }, // Friday
  6: { open: '09:00', close: '16:00' }, // Saturday
};

// Used as the time input's min/max before a date has been chosen, so the
// native picker stays interactive instead of showing an empty range.
export const DEFAULT_HOURS: HoursRange = HOURS_BY_WEEKDAY[1] as HoursRange;

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayDateString(): string {
  return formatLocalDate(new Date());
}

function getWeekday(dateStr: string): number | null {
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day).getDay();
}

export function getHoursForDate(dateStr: string): HoursRange | null {
  if (!dateStr) return null;
  const weekday = getWeekday(dateStr);
  if (weekday === null) return null;
  return HOURS_BY_WEEKDAY[weekday];
}

export function isClosedOn(dateStr: string): boolean {
  if (!dateStr) return false;
  const weekday = getWeekday(dateStr);
  return weekday !== null && HOURS_BY_WEEKDAY[weekday] === null;
}

export function isTimeWithinHours(dateStr: string, timeStr: string): boolean {
  const hours = getHoursForDate(dateStr);
  if (!hours || !timeStr) return false;
  return timeStr >= hours.open && timeStr <= hours.close;
}

function formatTime12Hour(time: string): string {
  const [hourStr, minuteStr] = time.split(':');
  const hour = Number(hourStr);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minuteStr} ${period}`;
}

export function formatHoursLabel(dateStr: string): string {
  const hours = getHoursForDate(dateStr);
  if (!hours) return "Closed";
  return `${formatTime12Hour(hours.open)} – ${formatTime12Hour(hours.close)}`;
}
