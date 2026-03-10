'use client';

import { useTranslation } from 'react-i18next';

export default function SafeTranslation({
  tKey,
  fallback,
}: Record<'tKey' | 'fallback', string>) {
  const { t, ready } = useTranslation('translation');
  return <>{ready ? t(tKey) : fallback}</>;
}
