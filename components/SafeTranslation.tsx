'use client';

import { I18nContext } from '@/i18n/context';
import { observer } from 'mobx-react';
import { useContext } from 'react';

export default observer(function SafeTranslation({
  tKey,
  fallback,
}: Record<'tKey' | 'fallback', string>) {
  const i18n = useContext(I18nContext);

  return <>{!i18n.loading ? (i18n.t(tKey) ?? tKey) : fallback}</>;
});
