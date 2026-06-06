import { DeadlineItem, EventData } from './data';

export const ACTIVITIES_API_URL =
  'https://goodaction-hub.github.io/GoodAction-data/activities.json';

export interface ExternalEventData {
  id: string;
  link: string;
  start_time?: string;
  end_time?: string;
  timeline: { deadline: string; comment: string }[];
  timezone: string;
  place: string;
}

export interface ExternalDeadlineItem {
  title: string;
  description: string;
  category: 'meetup' | 'conference' | 'competition';
  tags: string[];
  events: ExternalEventData[];
}

let _activitiesCache: ExternalDeadlineItem[] | null = null;

export async function fetchActivitiesCatalog(): Promise<
  ExternalDeadlineItem[]
> {
  if (_activitiesCache) return _activitiesCache;
  const res = await fetch(ACTIVITIES_API_URL, { cache: 'force-cache' });
  if (!res.ok) throw new URIError(`Failed to fetch activities: ${res.status}`);
  _activitiesCache = (await res.json()) as ExternalDeadlineItem[];
  return _activitiesCache;
}

export function transformEvent(event: ExternalEventData): EventData {
  const startTime = event.start_time ?? event.timeline[0]?.deadline ?? '';
  const startDate = startTime ? new Date(startTime.replace(' ', 'T')) : null;
  const year = startDate ? startDate.getFullYear() : new Date().getFullYear();

  const formatDate = (d: Date) =>
    `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  let date = startDate ? formatDate(startDate) : '';
  if (startDate && event.end_time) {
    const endDate = new Date(event.end_time.replace(' ', 'T'));
    if (endDate.getTime() !== startDate.getTime())
      date = `${date}-${endDate.getMonth() + 1}月${endDate.getDate()}日`;
  }

  return {
    year,
    id: event.id,
    link: event.link,
    timeline: event.timeline,
    timezone: event.timezone,
    date,
    place: event.place,
  };
}

export function transformItem(item: ExternalDeadlineItem): DeadlineItem {
  return {
    title: item.title,
    description: item.description,
    category: item.category === 'meetup' ? 'activity' : item.category,
    tags: item.tags ?? [],
    events: item.events.map(transformEvent),
  };
}
