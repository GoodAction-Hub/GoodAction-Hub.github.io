import { createI18nStore, loadSSRLanguage, type LanguageCode } from './index';

export const loadSSRI18n = async (
  requestedLanguage: LanguageCode,
  query?: Record<string, string | string[] | undefined>,
) => {
  const { language, languageMap } = await loadSSRLanguage({
    query: { ...query, language: requestedLanguage },
  });
  return createI18nStore(language, languageMap);
};
