import Fuse from 'fuse.js';
import { DateTime } from 'luxon';

import { EventCard } from '@/components/EventCard';
import { loadSSRI18nFromRequest } from '@/i18n/server';
import { fetchActivitiesCatalog, transformItem } from '@/lib/activities';
import { DeadlineItem, EventData } from '@/lib/data';
import { pickFirstSearchParam } from '@/lib/pagination';

interface FlatEvent {
  item: DeadlineItem;
  event: EventData;
  nextDeadline: DateTime;
  timeRemaining: number;
}

type PageSearchParams = Promise<{
  keywords?: string | string[];
}>;

async function getFlatEvents(): Promise<FlatEvent[]> {
  const data = await fetchActivitiesCatalog();
  const items = data.map(transformItem);

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

function getRecommendations(flatEvents: FlatEvent[], keywords: string) {
  const results = keywords.trim()
    ? new Fuse(flatEvents, {
        keys: ['item.title', 'item.description', 'item.tags', 'event.place'],
        threshold: 0.3,
      })
        .search(keywords.trim())
        .map((result) => result.item)
    : flatEvents;

  return results.sort((a, b) => {
    const aEnded = a.timeRemaining < 0;
    const bEnded = b.timeRemaining < 0;

    if (aEnded && !bEnded) return 1;
    if (!aEnded && bEnded) return -1;
    if (aEnded && bEnded) return b.timeRemaining - a.timeRemaining;

    return a.timeRemaining - b.timeRemaining;
  });
}

async function getRecommendPageData(
  keywords: string,
): Promise<{ recommendations: FlatEvent[]; error: string | null }> {
  try {
    const flatEvents = await getFlatEvents();

    return {
      recommendations: getRecommendations(flatEvents, keywords),
      error: null,
    };
  } catch (error) {
    return {
      recommendations: [],
      error: `Failed to fetch activities: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export default async function RecommendPage({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const rawSearchParams = await searchParams;
  const keywords = pickFirstSearchParam(rawSearchParams.keywords)?.trim() ?? '';
  const { t } = await loadSSRI18nFromRequest(rawSearchParams);
  const { recommendations, error } = await getRecommendPageData(keywords);

  if (error)
    return (
      <div className="min-h-screen p-8">
        <p className="text-red-600">
          {t('recommend.fetchError')}: {error}
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-transparent space-y-4">
          {recommendations.map(({ item, event }) => (
            <EventCard key={`${event.id}`} item={item} event={event} />
          ))}
        </div>

        {recommendations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {t('events.notFound')}
            </h3>
            <p className="text-slate-600">{t('events.hint')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
