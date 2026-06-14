import {
  loadLanguageMapFrom,
  TranslationMap,
  TranslationModel,
} from 'mobx-i18n';
import { DataObject } from 'mobx-restful';
import { parseCookie } from 'web-utility';

import zhCN from './zh-CN';

export type LanguageCode = 'zh-CN' | 'zh-TW' | 'en-US';

type TranslationData =
  | TranslationMap<string>
  | (() => Promise<{ default: TranslationMap<string> }>);

const i18nData: Record<LanguageCode, TranslationData> = {
  'zh-CN': zhCN,
  'zh-TW': () => import('./zh-TW'),
  'en-US': () => import('./en-US'),
};

export interface I18nProps {
  language: LanguageCode;
  languageMap: TranslationMap<string>;
}

type I18nTextKey = string;

export const normalizeLanguageCode = (
  language = '',
): LanguageCode | undefined => {
  const normalized = language.trim().toLowerCase();

  if (!normalized) return;
  if (normalized.startsWith('zh-tw') || normalized.startsWith('zh-hk'))
    return 'zh-TW';
  if (normalized.startsWith('zh')) return 'zh-CN';
  if (normalized.startsWith('en')) return 'en-US';
};

export const createI18nStore = <N extends LanguageCode, K extends string>(
  language?: N,
  data?: TranslationMap<K>,
) => {
  const store = new TranslationModel<LanguageCode, I18nTextKey>({
    ...i18nData,
    ...(language && { [language]: data }),
  });

  if (language) store.currentLanguage = language;
  if (data) store.currentMap = data;

  return store;
};

export const i18n = createI18nStore();

export const LanguageName: Record<LanguageCode, string> = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'en-US': 'English',
};

export const supportedLngDisplayNames = LanguageName;

type SSRI18nInput = {
  cookie?: string;
  acceptLanguage?: string;
  query?: Record<string, string | string[] | undefined>;
};

const pickFirstQueryValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const mergeCookieLanguage = (cookie: string, language?: LanguageCode) => {
  const items = cookie
    .split(';')
    .map((item) => item.trim())
    .filter((item) => item && !item.startsWith('language='));

  if (language) items.push(`language=${language}`);

  return items.join('; ');
};

export const parseSSRContext = <T extends DataObject = DataObject>(
  { cookie = '', query = {} }: Pick<SSRI18nInput, 'cookie' | 'query'>,
  queryKeys: (keyof T)[] = [],
) => {
  const data = parseCookie(cookie) as T;

  for (const key of queryKeys)
    data[key] =
      (pickFirstQueryValue(query[key as string]) as T[keyof T]) || data[key];

  return data;
};

export const loadSSRLanguage = async ({
  cookie = '',
  acceptLanguage = '',
  query = {},
}: SSRI18nInput = {}) => {
  const { language } = parseSSRContext<{ language?: string }>(
    { cookie, query },
    ['language'],
  );

  const { language: currentLanguage, languageMap } = await loadLanguageMapFrom(
    i18nData,
    {
      cookie: mergeCookieLanguage(
        cookie,
        normalizeLanguageCode(pickFirstQueryValue(query.language) ?? language),
      ),
      'accept-language': acceptLanguage,
    },
  );

  return {
    language: currentLanguage,
    languageMap,
  };
};
