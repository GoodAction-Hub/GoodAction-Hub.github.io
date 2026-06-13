'use client';

import { useTranslation } from '@/i18n/useTranslation';

export default function SafeTranslation({
  tKey,
  fallback,
}: Record<'tKey' | 'fallback', string>) {
  const { t, ready } = useTranslation('translation');
  return <>{ready ? t(tKey) : fallback}</>;
}
