import { ChinaMapWrapper } from '@/components/ChinaMapWrapper';
import { CommentBox } from '@/components/CommentBox';
import { TimelineItem } from '@/components/TimelineItem';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeadlineItem, EventData } from '@/lib/data';
import { formatTimezoneToUTC } from '@/lib/utils';
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  MessageSquare,
  Pencil,
} from 'lucide-react';
import { DateTime } from 'luxon';
import Link from 'next/link';

const DATA_EDIT_URL =
  'https://github.com/GoodAction-Hub/GoodAction-data/edit/main/activities.json';

const ACTIVITIES_API_URL =
  'https://goodaction-hub.github.io/GoodAction-data/activities.json';

interface ExternalEventData {
  id: string;
  link: string;
  start_time?: string;
  end_time?: string;
  timeline: { deadline: string; comment: string }[];
  timezone: string;
  place: string;
}

interface ExternalDeadlineItem {
  title: string;
  description: string;
  category: 'meetup' | 'conference' | 'competition';
  tags: string[];
  events: ExternalEventData[];
}

function transformEvent(event: ExternalEventData): EventData {
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

function transformItem(item: ExternalDeadlineItem): DeadlineItem {
  return {
    title: item.title,
    description: item.description,
    category: item.category === 'meetup' ? 'activity' : item.category,
    tags: item.tags ?? [],
    events: item.events.map(transformEvent),
  };
}

async function findActivity(id: string) {
  try {
    const res = await fetch(ACTIVITIES_API_URL, { cache: 'force-cache' });
    if (!res.ok) return null;
    const externalData = (await res.json()) as ExternalDeadlineItem[];
    for (const raw of externalData) {
      const item = transformItem(raw);
      for (const event of item.events)
        if (event.id === id) return { item, event };
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch activity:', error);
    return null;
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const found = await findActivity(id);

  if (!found) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔍</div>
          <h2 className="text-xl font-semibold text-gray-700">未找到该活动</h2>
          <Link href="/activities">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const { item, event } = found;
  const displayTimezone = 'Asia/Shanghai';
  const now = DateTime.now().setZone(displayTimezone);

  const upcomingDeadlines = event.timeline
    .map((tl, index) => ({
      ...tl,
      date: DateTime.fromISO(tl.deadline, { zone: event.timezone }),
      index,
    }))
    .filter((tl) => tl.date.setZone(displayTimezone) > now)
    .sort((a, b) => a.date.toMillis() - b.date.toMillis());

  const nextDeadline = upcomingDeadlines[0];
  const upcomingIndexes = upcomingDeadlines.map((tl) => tl.index);
  const ended = upcomingDeadlines.length === 0;

  const eventTimezoneUTC = formatTimezoneToUTC(event.timezone);

  const categoryStyle = {
    conference: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
    competition: 'bg-gradient-to-r from-pink-500 to-pink-600 text-white',
    activity: 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white',
  }[item.category];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
        {/* Back + Edit buttons */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/activities">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Button>
          </Link>
          <a href={DATA_EDIT_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2">
              <Pencil className="w-4 h-4" />在 GitHub 上编辑
            </Button>
          </a>
        </div>

        {/* Main card */}
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-5">
            {/* Category badge + title */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <div
                  className={`inline-flex px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${categoryStyle}`}
                >
                  {item.category === 'conference'
                    ? '会议'
                    : item.category === 'competition'
                      ? '竞赛'
                      : '活动'}
                </div>
                <Badge variant="outline" className="text-xs">
                  {event.year}
                </Badge>
                {ended && (
                  <Badge variant="secondary" className="text-xs">
                    已结束
                  </Badge>
                )}
              </div>

              <div className="flex items-start gap-2">
                <Link
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1 group"
                >
                  <h1 className="text-2xl font-bold leading-tight break-words underline">
                    {item.title}
                  </h1>
                  <ExternalLink className="w-5 h-5 flex-shrink-0 opacity-70 group-hover:opacity-100" />
                </Link>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Date / timezone / place */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 text-sm text-muted-foreground">
              {event.date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>{event.date}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{eventTimezoneUTC}</span>
              </div>
              {event.place && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>{event.place}</span>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="w-4 h-4" />
                时间轴
              </div>
              <div className="relative bg-gray-50 rounded-lg border h-16 flex items-center">
                <div className="absolute left-[10%] right-[10%] h-0.5 bg-gray-300 top-1/2 -translate-y-1/2" />
                <div className="relative w-full h-full">
                  {event.timeline.map((timelineEvent, index) => (
                    <TimelineItem
                      key={index}
                      event={timelineEvent}
                      timezone={event.timezone}
                      isEnded={ended}
                      isActive={nextDeadline?.index === index}
                      isUpcoming={upcomingIndexes.slice(1).includes(index)}
                      totalEvents={event.timeline.length}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map section */}
        {event.place && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5" />
                活动地点
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChinaMapWrapper
                zoom={10}
                title={item.title}
                address={event.place}
              />
            </CardContent>
          </Card>
        )}

        {/* Comments section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5" />
              评论
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CommentBox />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
