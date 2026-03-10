'use client';

import { EventCard } from '@/components/EventCard';
import { FilterBar } from '@/components/FilterBar';
import { GitCodeIcon } from '@/components/icons/GitCodeIcon';
import { GitHubIcon } from '@/components/icons/GitHubIcon';

import { DeadlineItem, EventData } from '@/lib/data';
import { useEventStore } from '@/lib/store';
import Fuse from 'fuse.js';

import { DateTime } from 'luxon';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface FlatEvent {
  item: DeadlineItem;
  event: EventData;
  nextDeadline: DateTime;
  timeRemaining: number;
}

export default function Home() {
  const {
    items,
    loading,
    fetchItems,
    selectedCategory,
    selectedTags,
    selectedLocations,
    searchQuery,
    favorites,
    showOnlyFavorites,
  } = useEventStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const { t } = useTranslation();

  const flatEvents: FlatEvent[] = useMemo(
    () =>
      items.flatMap((item) =>
        item.events.map((event) => {
          const now = DateTime.now().setZone('Asia/Shanghai');
          const upcomingDeadlines = event.timeline
            .map((t) => DateTime.fromISO(t.deadline, { zone: event.timezone }))
            .filter((d) => d > now)
            .sort((a, b) => a.toMillis() - b.toMillis());

          const nextDeadline =
            upcomingDeadlines[0] ||
            DateTime.fromISO(
              event.timeline[event.timeline.length - 1].deadline,
              { zone: event.timezone },
            );
          const timeRemaining = nextDeadline.toMillis() - now.toMillis();

          return { item, event, nextDeadline, timeRemaining };
        }),
      ),
    [items],
  );

  // 为每个事件添加搜索用的日期字段
  const eventsWithSearchDates = useMemo(() => {
    return flatEvents.map((flatEvent) => ({
      ...flatEvent,
      searchableDate: flatEvent.nextDeadline.toFormat('yyyy-MM-dd'),
      searchableMonth: flatEvent.nextDeadline.toFormat('MM'),
      searchableYear: flatEvent.nextDeadline.toFormat('yyyy'),
    }));
  }, [flatEvents]);

  const filteredEvents = useMemo(() => {
    let filtered = eventsWithSearchDates;

    // 分类过滤
    if (selectedCategory) {
      filtered = filtered.filter(
        (flatEvent) => flatEvent.item.category === selectedCategory,
      );
    }

    // 标签过滤
    if (selectedTags.length > 0) {
      filtered = filtered.filter((flatEvent) =>
        selectedTags.some((tag) => flatEvent.item.tags?.includes(tag)),
      );
    }

    // 地点过滤
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((flatEvent) =>
        selectedLocations.includes(flatEvent.event.place),
      );
    }

    // 收藏过滤
    if (showOnlyFavorites) {
      console.log('Filtering favorites:', {
        favorites,
        showOnlyFavorites,
        totalEvents: filtered.length,
      });
      filtered = filtered.filter((flatEvent) => {
        const eventId = `${flatEvent.event.id}`;
        const isFavorited = favorites.includes(eventId);
        console.log(
          `Event ${eventId}: ${isFavorited ? 'favorited' : 'not favorited'}`,
        );
        return isFavorited;
      });
      console.log('Filtered favorites result:', filtered.length);
    }

    // 搜索过滤
    if (searchQuery.trim()) {
      const fuse = new Fuse(filtered, {
        keys: [
          { name: 'item.title', weight: 0.4 },
          { name: 'item.tags', weight: 0.3 },
          { name: 'event.place', weight: 0.2 },
          { name: 'searchableDate', weight: 0.1 },
          { name: 'searchableMonth', weight: 0.1 },
          { name: 'searchableYear', weight: 0.1 },
        ],
        threshold: 0.3,
        includeScore: true,
      });

      const results = fuse.search(searchQuery);
      filtered = results.map((result) => result.item);
    }

    // 排序逻辑：未结束的活动按 timeRemaining 升序，已结束的活动放在最后
    return filtered.sort((a, b) => {
      const aCompleted = a.timeRemaining < 0;
      const bCompleted = b.timeRemaining < 0;

      // 如果一个已结束，一个未结束，未结束的排在前面
      if (aCompleted && !bCompleted) return 1;
      if (!aCompleted && bCompleted) return -1;

      // 如果都未结束，按 timeRemaining 升序（即将到期的在前）
      if (!aCompleted && !bCompleted) {
        return a.timeRemaining - b.timeRemaining;
      }

      // 如果都已结束，按 timeRemaining 降序（最近结束的在前）
      return b.timeRemaining - a.timeRemaining;
    });
  }, [
    eventsWithSearchDates,
    selectedCategory,
    selectedTags,
    selectedLocations,
    searchQuery,
    showOnlyFavorites,
    favorites,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-700">{t('events.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 relative overflow-hidden">
      {/* 动态背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-300/10 to-cyan-300/10 rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header Section */}
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

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-8">
          <FilterBar />
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map(({ item, event }) => (
            <EventCard key={`${event.id}`} item={item} event={event} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {t('events.notFound')}
            </h3>
            <p className="text-gray-600 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
              {t('events.hint')}
            </p>
          </div>
        )}

        {/* Footer */}
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
