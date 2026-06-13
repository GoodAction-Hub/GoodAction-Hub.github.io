'use client';

import { Button } from '@/components/ui/button';
import { useEventStore } from '@/lib/store';
import { Star } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function FavoriteEventsToggle() {
  const { t } = useTranslation('common');
  const { mounted, showOnlyFavorites, setShowOnlyFavorites } = useEventStore();

  useEffect(() => {
    useEventStore.setState({ mounted: true });
  }, []);

  if (!mounted) return null;

  return (
    <Button
      variant={showOnlyFavorites ? 'default' : 'outline'}
      size="sm"
      onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
      className={
        showOnlyFavorites
          ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-white shadow-lg shadow-yellow-500/25 hover:shadow-xl hover:shadow-yellow-500/30'
          : 'border-yellow-300 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-400 hover:text-yellow-700'
      }
      type="button"
    >
      <Star
        className={`h-4 w-4 ${
          showOnlyFavorites ? 'fill-white text-white' : 'text-yellow-500'
        }`}
      />
      <span className="font-medium">{t('filter.onlyFavorites')}</span>
    </Button>
  );
}

export function FavoriteEventItem({
  eventId,
  children,
}: {
  eventId: string;
  children: ReactNode;
}) {
  const { mounted, favorites, showOnlyFavorites } = useEventStore();

  if (mounted && showOnlyFavorites && !favorites.includes(eventId)) {
    return null;
  }

  return children;
}
