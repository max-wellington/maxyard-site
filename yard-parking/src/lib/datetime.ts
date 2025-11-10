import { DateTime } from 'luxon';

export const DEFAULT_TIMEZONE = 'America/New_York';

export function formatDate(date: Date, timezone = DEFAULT_TIMEZONE) {
  return DateTime.fromJSDate(date).setZone(timezone).toLocaleString(DateTime.DATE_MED);
}

export function formatTime(date: Date, timezone = DEFAULT_TIMEZONE) {
  return DateTime.fromJSDate(date).setZone(timezone).toLocaleString(DateTime.TIME_SIMPLE);
}

export function formatDateTime(date: Date, timezone = DEFAULT_TIMEZONE) {
  return DateTime.fromJSDate(date)
    .setZone(timezone)
    .toLocaleString({ ...DateTime.DATETIME_MED, hour12: true });
}

export function humanizeDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours && remainingMinutes) {
    return `${hours} hr ${remainingMinutes} min`;
  }

  if (hours) {
    return `${hours} hr`;
  }

  return `${remainingMinutes} min`;
}

export function subtractHours(date: Date, hours: number, timezone = DEFAULT_TIMEZONE) {
  return DateTime.fromJSDate(date).setZone(timezone).minus({ hours }).toJSDate();
}

