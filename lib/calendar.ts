import { DateTime } from 'luxon';

interface ICalendarEvent {
  title: string;
  description?: string;
  location?: string;
  start: DateTime;
  end: DateTime;
}

const formatICalendarDateTime = (dateTime: DateTime) =>
  dateTime.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");

const escapeICalendarText = (text: string) =>
  text
    .replaceAll('\\', '\\\\')
    .replaceAll('\r\n', '\\n')
    .replaceAll('\n', '\\n')
    .replaceAll('\r', '\\n')
    .replaceAll(',', '\\,')
    .replaceAll(';', '\\;');

const createCalendarUID = () =>
  typeof globalThis.crypto?.randomUUID === 'function'
    ? globalThis.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const createICalendarEvent = ({
  title,
  description,
  location,
  start,
  end,
}: ICalendarEvent) =>
  [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GoodAction-Hub//EN',
    'BEGIN:VEVENT',
    `UID:${createCalendarUID()}@goodaction-hub`,
    `DTSTAMP:${formatICalendarDateTime(DateTime.now())}`,
    `DTSTART:${formatICalendarDateTime(start)}`,
    `DTEND:${formatICalendarDateTime(end)}`,
    `SUMMARY:${escapeICalendarText(title)}`,
    description && `DESCRIPTION:${escapeICalendarText(description)}`,
    location && `LOCATION:${escapeICalendarText(location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\n');
