'use client';

import { observer } from 'mobx-react';
import { useContext } from 'react';

import { I18nContext } from '@/i18n/context';

export default observer(function SafeTranslation({
  tKey,
  fallback,
}: Record<'tKey' | 'fallback', string>) {
  const { loading, t } = useContext(I18nContext);

  return <>{!loading ? t(tKey) : fallback}</>;
});
