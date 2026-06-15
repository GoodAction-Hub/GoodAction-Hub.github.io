'use client';

import { I18nContext } from '@/i18n/context';
import { observer } from 'mobx-react';
import { useContext } from 'react';

export default observer(function SafeTranslation({
  tKey,
  fallback,
}: Record<'tKey' | 'fallback', string>) {
  const { loading, t } = useContext(I18nContext);

  return <>{!loading ? (t(tKey) ?? tKey) : fallback}</>;
});
