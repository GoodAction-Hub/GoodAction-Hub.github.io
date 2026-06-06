import { EventCard } from '@/components/EventCard';
import { GitCodeIcon } from '@/components/icons/GitCodeIcon';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import {
  fetchActivitiesCatalog,
  transformItem,
  ExternalDeadlineItem,
} from '@/lib/activities';
import { getVisiblePages, parsePage } from '@/lib/pagination';
import Fuse from 'fuse.js';
import { DateTime } from 'luxon';
import Link from 'next/link';

interface FlatEvent {
  item: ReturnType<typeof transformItem>;
  event: ReturnType<typeof transformItem>['events'][number];
  nextDeadline: DateTime;
  timeRemaining: number;
}

const PAGE_SIZE = 10;

type PageSearchParams = Promise<{
  page?: string;
  query?: string;
}>;

function getPageHref(page: number, query: string): string {
  const params = new URLSearchParams();
  if (query) params.set('query', query);
  if (page > 1) params.set('page', String(page));
  const queryString = params.toString();
  return queryString ? `/activities?${queryString}` : '/activities';
}

async function getFlatEvents(): Promise<FlatEvent[]> {
  const externalData = await fetchActivitiesCatalog();
  const items = externalData.map((item: ExternalDeadlineItem) =>
    transformItem(item),
  );

  return items.flatMap((item) =>
    item.events.map((event) => {
      const now = DateTime.now().setZone('Asia/Shanghai');
      const upcomingDeadlines = event.timeline
        .map((timeline) =>
          DateTime.fromISO(timeline.deadline, { zone: event.timezone }),
        )
        .filter((deadline) => deadline > now)
        .sort((a, b) => a.toMillis() - b.toMillis());

      const nextDeadline =
        upcomingDeadlines[0] ||
        DateTime.fromISO(event.timeline[event.timeline.length - 1].deadline, {
          zone: event.timezone,
        });

      return {
        item,
        event,
        nextDeadline,
        timeRemaining: nextDeadline.toMillis() - now.toMillis(),
      };
    }),
  );
}

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const { page: rawPage, query: rawQuery } = await searchParams;
  const query = rawQuery?.trim() ?? '';

  const flatEvents = await getFlatEvents();

  let filteredEvents = flatEvents;
  if (query) {
    const fuse = new Fuse(filteredEvents, {
      keys: ['item.title', 'item.tags', 'event.place'],
      threshold: 0.3,
    });
    filteredEvents = fuse.search(query).map((result) => result.item);
  }

  filteredEvents = filteredEvents.sort((a, b) => {
    const aCompleted = a.timeRemaining < 0;
    const bCompleted = b.timeRemaining < 0;

    if (aCompleted && !bCompleted) return 1;
    if (!aCompleted && bCompleted) return -1;
    if (!aCompleted && !bCompleted) return a.timeRemaining - b.timeRemaining;
    return b.timeRemaining - a.timeRemaining;
  });

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  const currentPage = Math.min(parsePage(rawPage), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pagedEvents = filteredEvents.slice(start, start + PAGE_SIZE);
  const visiblePages = getVisiblePages(totalPages, currentPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-300/10 to-cyan-300/10 rounded-full blur-3xl"></div>
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
          <div className="text-sm text-gray-600 space-y-1">
            <p className="bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
              所有截止日期均默认转换为北京时间，如果您不知道当前所在时区，请点击时区选择器右侧的&ldquo;自动检测&rdquo;
            </p>
            <p className="text-gray-500 bg-white/40 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
              *免责声明：本站数据由人工维护，仅供参考
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8">
          <form action="/activities" method="get" className="flex gap-3">
            <input
              type="text"
              name="query"
              defaultValue={query}
              placeholder="搜索活动标题、标签、地点..."
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium"
            >
              搜索
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {pagedEvents.map(({ item, event }) => (
            <EventCard key={`${event.id}`} item={item} event={event} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              未找到结果
            </h3>
            <p className="text-gray-600 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
              请尝试其他关键词
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {currentPage > 1 && (
              <Link
                href={getPageHref(currentPage - 1, query)}
                className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm"
              >
                上一页
              </Link>
            )}
            {visiblePages.map((page) => (
              <Link
                key={page}
                href={getPageHref(page, query)}
                aria-current={page === currentPage ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-md border text-sm ${
                  page === currentPage
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              >
                {page}
              </Link>
            ))}
            {currentPage < totalPages && (
              <Link
                href={getPageHref(currentPage + 1, query)}
                className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm"
              >
                下一页
              </Link>
            )}
          </div>
        )}

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
