import Fuse from 'fuse.js';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { headers } from 'next/headers';

import { createI18nStore, loadSSRLanguage } from '@/i18n';
import { EventCard } from '@/components/EventCard';
import { GitCodeIcon } from '@/components/icons/GitCodeIcon';
import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { Pager } from '@/components/ui/mobx-restful-shadcn/pager';
import {
  fetchActivitiesCatalog,
  transformItem,
  ExternalDeadlineItem,
} from '@/lib/activities';
import { parsePage } from '@/lib/pagination';

interface FlatEvent {
  item: ReturnType<typeof transformItem>;
  event: ReturnType<typeof transformItem>['events'][number];
  nextDeadline: DateTime;
  timeRemaining: number;
}

const PAGE_SIZE = 10;
const ACTIVITY_CATEGORIES = ['conference', 'competition', 'activity'] as const;

type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

type PageSearchParams = Promise<{
  pageIndex?: string;
  keywords?: string;
  category?: string;
  tag?: string | string[];
}>;

const isActivityCategory = (value: string): value is ActivityCategory =>
  ACTIVITY_CATEGORIES.includes(value as ActivityCategory);

function parseCategory(rawCategory?: string) {
  const normalized = rawCategory?.trim().toLowerCase();
  return normalized && isActivityCategory(normalized) ? normalized : null;
}

function parseTags(rawTag?: string | string[]) {
  const values = Array.isArray(rawTag) ? rawTag : rawTag ? [rawTag] : [];

  return [...new Set(values.flatMap((value) => value.split(',')))]
    .map((value) => value.trim())
    .filter(Boolean);
}

function buildActivitiesHref({
  pageIndex,
  keywords,
  category,
  tags,
}: {
  pageIndex?: number;
  keywords: string;
  category?: ActivityCategory | null;
  tags: string[];
}) {
  const params = new URLSearchParams();

  if (pageIndex && pageIndex > 1) params.set('pageIndex', String(pageIndex));
  if (keywords) params.set('keywords', keywords);
  if (category) params.set('category', category);
  for (const tag of tags) params.append('tag', tag);

  return params + '' ? `/activities?${params}` : '/activities';
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
  const rawSearchParams = await searchParams;
  const {
    pageIndex: rawPageIndex,
    keywords: rawKeywords,
    category: rawCategory,
    tag: rawTag,
  } = rawSearchParams;
  const keywords = rawKeywords?.trim() ?? '';
  const selectedCategory = parseCategory(rawCategory);
  const selectedTags = parseTags(rawTag);
  const headerStore = await headers();
  const { language, languageMap } = await loadSSRLanguage({
    cookie: headerStore.get('cookie') ?? '',
    acceptLanguage: headerStore.get('accept-language') ?? '',
    query: rawSearchParams,
  });
  const { t } = createI18nStore(language, languageMap);

  const flatEvents = await getFlatEvents();

  const allTags = [
    ...new Set(flatEvents.flatMap(({ item }) => item.tags)),
  ].sort((a, b) => a.localeCompare(b, language));

  let filteredEvents = flatEvents.filter(({ item }) => {
    if (selectedCategory && item.category !== selectedCategory) return false;
    if (
      selectedTags.length > 0 &&
      !selectedTags.some((tag) => item.tags.includes(tag))
    )
      return false;

    return true;
  });

  if (keywords) {
    const fuse = new Fuse(filteredEvents, {
      keys: ['item.title', 'item.tags', 'event.place'],
      threshold: 0.3,
    });
    filteredEvents = fuse.search(keywords).map(({ item }) => item);
  }

  filteredEvents = filteredEvents.sort((a, b) => {
    const aCompleted = a.timeRemaining < 0;
    const bCompleted = b.timeRemaining < 0;
    const completedSort = aCompleted === bCompleted ? 0 : aCompleted ? 1 : -1;
    return (
      completedSort ||
      (aCompleted
        ? b.timeRemaining - a.timeRemaining
        : a.timeRemaining - b.timeRemaining)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  const currentPage = Math.min(parsePage(rawPageIndex), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pagedEvents = filteredEvents.slice(start, start + PAGE_SIZE);

  const clearHref = '/activities';

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
            {t('activities_list_text_title')}
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
            {t('activities_list_text_subtitle')}
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

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8 space-y-5">
          <form action={clearHref} method="get" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="keywords"
                defaultValue={keywords}
                placeholder={t('activities_list_text_search_placeholder')}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm bg-white"
              />
              {selectedCategory && (
                <input type="hidden" name="category" value={selectedCategory} />
              )}
              {selectedTags.map((tag) => (
                <input key={tag} type="hidden" name="tag" value={tag} />
              ))}
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium"
              >
                {t('activities_list_text_search_button')}
              </button>
              <Link
                href={clearHref}
                className="px-5 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors text-center"
              >
                {t('activities_list_text_filter_reset')}
              </Link>
            </div>
          </form>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-gray-700">
                {t('activities_list_text_filter_category')}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={buildActivitiesHref({
                  keywords,
                  tags: selectedTags,
                })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  !selectedCategory
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {t('activities_list_text_filter_all')}
              </Link>
              {ACTIVITY_CATEGORIES.map((category) => (
                <Link
                  key={category}
                  href={buildActivitiesHref({
                    keywords,
                    category: selectedCategory === category ? null : category,
                    tags: selectedTags,
                  })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t(`activities_detail_text_category_${category}`)}
                </Link>
              ))}
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-gray-700">
                {t('activities_list_text_filter_tags')}
              </h2>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-auto pr-1">
                {allTags.map((tag) => {
                  const active = selectedTags.includes(tag);
                  const nextTags = active
                    ? selectedTags.filter((value) => value !== tag)
                    : [...selectedTags, tag];

                  return (
                    <Link
                      key={tag}
                      href={buildActivitiesHref({
                        keywords,
                        category: selectedCategory,
                        tags: nextTags,
                      })}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        active
                          ? 'bg-purple-100 border-purple-300 text-purple-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tag}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
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
              {t('activities_list_text_no_result_title')}
            </h3>
            <p className="text-gray-600 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
              {t('activities_list_text_no_result_tip')}
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Pager
            pageSize={PAGE_SIZE}
            pageIndex={currentPage}
            pageCount={totalPages}
          />
        </div>

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
