'use client';

import { Loader2, WandSparkles } from 'lucide-react';
import { observer } from 'mobx-react';
import { useContext, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { I18nContext } from '@/i18n/context';
import { cn } from '@/lib/utils';

interface Recommendation {
  name: string;
  address?: string;
  city?: string;
  tags?: string[];
  description?: string;
}

export const FoodAIDialog = observer(() => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Recommendation[]>([]);
  const { t } = useContext(I18nContext);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          preferences,
        }),
      });

      if (!res.ok) {
        throw new Error(`请求失败: ${res.status}`);
      }

      const data = await res.json();
      const recs: Recommendation[] = data?.recommendations || [];
      if (recs.length > 0) {
        setResults(recs);
        if (data?.source && data.source !== 'spark') {
          setError(t('bites.ai_dialog.errors.unavailable_with_results'));
        }
        return;
      }

      setError(t('bites.ai_dialog.errors.empty'));
    } catch {
      setError(t('bites.ai_dialog.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Floating trigger */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            aria-label={t('bites.labels.ai_recommend')}
            className="fixed bottom-6 right-6 z-50 shadow-xl"
            onClick={() => setOpen(true)}
          >
            <WandSparkles className="mr-2 h-4 w-4" />
            {t('bites.labels.ai_recommend')}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{t('bites.ai_dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('bites.ai_dialog.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="bf-location">
                {t('bites.ai_dialog.labels.location')}
              </Label>
              <Input
                id="bf-location"
                value={location}
                onChange={({ target }) => setLocation(target.value)}
                placeholder={t('bites.ai_dialog.placeholders.location')}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bf-preferences">
                {t('bites.ai_dialog.labels.preferences')}
              </Label>
              <textarea
                id="bf-preferences"
                value={preferences}
                onChange={({ target }) => setPreferences(target.value)}
                placeholder={t('bites.ai_dialog.placeholders.preferences')}
                className={cn(
                  'min-h-[90px] rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                  'dark:bg-gray-800/80',
                )}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={onSubmit} disabled={loading || !location.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />{' '}
                    {t('bites.ai_dialog.actions.generating')}
                  </>
                ) : (
                  t('bites.ai_dialog.actions.generate')
                )}
              </Button>
              <DialogClose asChild>
                <Button variant="secondary">
                  {t('bites.ai_dialog.actions.close')}
                </Button>
              </DialogClose>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            {results.length > 0 && (
              <Card>
                <CardContent className="space-y-4">
                  {results.map((r, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="font-semibold text-base">{r.name}</div>
                      {r.address && (
                        <div className="text-sm text-gray-600">{r.address}</div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {(r.tags || []).map((t, i) => (
                          <Badge key={i} variant="secondary">
                            {t}
                          </Badge>
                        ))}
                      </div>
                      {r.description && (
                        <div className="text-sm text-gray-700">
                          {r.description}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});
