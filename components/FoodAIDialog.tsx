'use client';

import { observer } from 'mobx-react';
import { Loader2, WandSparkles } from 'lucide-react';
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

export default observer(function FoodAIDialog() {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Recommendation[]>([]);
  const { t } = useContext(I18nContext);

  const translate = (key: string, fallback: string) => t(key) ?? fallback;

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
          setError('AI服务暂不可用，已为您展示推荐');
        }
        return;
      }

      setError('未找到符合条件的推荐');
    } catch {
      setError('AI服务暂不可用，请稍后重试');
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
            aria-label="AI美食推荐官"
            className="fixed bottom-6 right-6 z-50 shadow-xl"
            onClick={() => setOpen(true)}
          >
            <WandSparkles className="mr-2 h-4 w-4" />
            {translate('bites.labels.ai_recommend', 'AI美食推荐官')}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {translate('bites.ai_dialog.title', 'AI美食推荐')}
            </DialogTitle>
            <DialogDescription>
              {translate(
                'bites.ai_dialog.description',
                '告诉我您的位置和偏好，我将为您推荐合适的无障碍餐厅',
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="bf-location">
                {translate('bites.ai_dialog.labels.location', '位置')}
              </Label>
              <Input
                id="bf-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={translate(
                  'bites.ai_dialog.placeholders.location',
                  '请输入您的位置',
                )}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bf-preferences">
                {translate('bites.ai_dialog.labels.preferences', '偏好')}
              </Label>
              <textarea
                id="bf-preferences"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder={translate(
                  'bites.ai_dialog.placeholders.preferences',
                  '请描述您的饮食偏好和无障碍需求',
                )}
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
                    {translate(
                      'bites.ai_dialog.actions.generating',
                      '生成中...',
                    )}
                  </>
                ) : (
                  translate('bites.ai_dialog.actions.generate', '生成推荐')
                )}
              </Button>
              <DialogClose asChild>
                <Button variant="secondary">
                  {translate('bites.ai_dialog.actions.close', '关闭')}
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
