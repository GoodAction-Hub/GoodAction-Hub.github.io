'use client';

import { reaction } from 'mobx';
import { useEffect, useState } from 'react';

import { i18n, normalizeLanguageCode } from '.';

export const useTranslation = (_namespace?: string) => {
  const [, update] = useState(0);

  useEffect(
    () =>
      reaction(
        () => [i18n.currentLanguage, i18n.currentMap, i18n.loading],
        () => update((value) => value + 1),
      ),
    [],
  );

  return {
    ready: !i18n.loading,
    t: (key: string) => i18n.t(key as never) || key,
    i18n: {
      changeLanguage: (language: string) =>
        i18n.loadLanguages(normalizeLanguageCode(language) || 'zh-CN'),
      language: i18n.currentLanguage || 'zh-CN',
    },
  };
};
