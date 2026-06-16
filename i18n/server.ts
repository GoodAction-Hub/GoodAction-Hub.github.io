import { headers } from 'next/headers';

import { createI18nStore, loadSSRLanguage } from './index';

export const loadSSRI18nFromRequest = async (
  query?: Record<string, string | string[] | undefined>,
) => {
  const headerStore = await headers();

  const { language, languageMap } = await loadSSRLanguage({
    cookie: headerStore.get('cookie') ?? '',
    acceptLanguage: headerStore.get('accept-language') ?? '',
    query,
  });
  return createI18nStore(language, languageMap);
};
