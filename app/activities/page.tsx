import { EventCard } from '@/components/EventCard';
import {
  FavoriteEventItem,
  FavoriteEventsToggle,
} from '@/components/FavoriteEventsFilter';
import { GitCodeIcon } from '@/components/icons/GitCodeIcon';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { Pagination } from '@/components/Pagination';
import { TimezoneSelector } from '@/components/TimezoneSelector';
import { fetchActivities } from '@/lib/activities';
import { DeadlineItem, EventData } from '@/lib/data';
import { DateTime } from 'luxon';
import { Search } from 'lucide-react';
import Link from 'next/link';

const PAGE_SIZE = 10;

interface ActivitiesPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

interface FlatEvent {
  item: DeadlineItem;
  event: EventData;
  nextDeadline: DateTime;
  timeRemaining: number;
  searchableText: string;
}

const categories = [
  { value: '', label: '全部' },
  { value: 'conference', label: '会议' },
  { value: 'competition', label: '竞赛' },
  { value: 'activity', label: '活动' },
];

const single = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const pageNumber = (value: string | undefined) => {
  const page = Number.parseInt(value || '1', 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
};

function flattenEvents(items: DeadlineItem[]): FlatEvent[] {
  const now = DateTime.now().setZone('Asia/Shanghai');

  return items
    .flatMap((item) =>
      item.events.map((event) => {
        const upcomingDeadlines = event.timeline
          .map((t) => DateTime.fromISO(t.deadline, { zone: event.timezone }))
          .filter((d) => d > now)
          .sort((a, b) => a.toMillis() - b.toMillis());

        const nextDeadline =
          upcomingDeadlines[0] ||
          DateTime.fromISO(event.timeline[event.timeline.length - 1].deadline, {
            zone: event.timezone,
          });
        const timeRemaining = nextDeadline.toMillis() - now.toMillis();
        const searchableText = [
          item.title,
          item.description,
          item.category,
          item.tags.join(' '),
          event.place,
          nextDeadline.toFormat('yyyy-MM-dd MM yyyy'),
        ]
          .join(' ')
          .toLowerCase();

        return { item, event, nextDeadline, timeRemaining, searchableText };
      }),
    )
    .sort((a, b) => {
      const aCompleted = a.timeRemaining < 0;
      const bCompleted = b.timeRemaining < 0;

      if (aCompleted && !bCompleted) return 1;
      if (!aCompleted && bCompleted) return -1;
      if (!aCompleted && !bCompleted) return a.timeRemaining - b.timeRemaining;
      return b.timeRemaining - a.timeRemaining;
    });
}

export default async function ActivitiesPage({
  searchParams,
}: ActivitiesPageProps) {
  const params = (await searchParams) ?? {};
  const query = single(params.query)?.trim() ?? '';
  const category = single(params.category)?.trim() ?? '';
  const currentPage = pageNumber(single(params.page));

  const events = flattenEvents(await fetchActivities()).filter((flatEvent) => {
    if (category && flatEvent.item.category !== category) return false;
    if (!query) return true;
    return flatEvent.searchableText.includes(query.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(events.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageEvents = events.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            公益慈善活动截止日期
          </h1>
          <div className="flex justify-center gap-3 mb-4">
            <Link
              href="https://gitcode.com/Fenju/GoodAction-Hub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <GitCodeIcon className="w-5 h-5" />
              GitCode
            </Link>
            <Link
              href="https://github.com/FenjuFu/GoodAction-Hub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <GitHubIcon className="w-5 h-5" />
              GitHub
            </Link>
            <Link
              href="https://github.com/GoodAction-Hub/GoodAction-data/issues/new?template=activity.yml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              + 发布活动
            </Link>
          </div>
          <p className="text-lg text-gray-700 mb-4 font-medium">
            公益慈善会议、竞赛和活动重要截止日期概览，不再错过参与公益事业、奉献爱心和社会服务的机会
          </p>
        </div>

        <form
          method="GET"
          className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8 space-y-4"
        >
          <div className="relative bg-white rounded-xl shadow-lg border-2 border-gray-200 focus-within:border-blue-500 transition-all duration-300">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-6 h-6" />
            <input
              type="search"
              name="query"
              defaultValue={query}
              placeholder="输入主题、地点、时间探索"
              className="w-full pl-14 pr-6 py-4 text-xl font-medium bg-transparent border-0 rounded-xl placeholder:text-gray-400 focus:ring-0 focus:outline-none text-gray-800"
            />
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map(({ value, label }) => (
                <label
                  key={value || 'all'}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    category === value
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-purple-50'
                  }`}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="category"
                    value={value}
                    defaultChecked={category === value}
                  />
                  {label}
                </label>
              ))}
              <button
                type="submit"
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
              >
                搜索
              </button>
              <FavoriteEventsToggle />
            </div>
            <TimezoneSelector />
          </div>
        </form>

        <div className="space-y-4">
          {pageEvents.map(({ item, event }) => (
            <FavoriteEventItem key={`${event.id}`} eventId={`${event.id}`}>
              <EventCard item={item} event={event} />
            </FavoriteEventItem>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              没有找到活动
            </h3>
            <p className="text-gray-600 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
              请调整关键词或分类后重试
            </p>
          </div>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          searchParams={{ query, category }}
        />

        <footer className="mt-16 text-center text-gray-600">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 inline-block">
            <p className="text-sm">
              公益慈善活动追踪平台 - 让爱心传递，让公益更简单
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
