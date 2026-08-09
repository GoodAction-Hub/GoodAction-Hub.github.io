import { configure } from 'mobx';
import {
  loadLanguageMapFrom,
  TranslationMap,
  TranslationModel,
} from 'mobx-i18n';
import { DataObject } from 'mobx-restful';
import { parseCookie } from 'web-utility';

import zhCN from './zh-CN';

configure({ enforceActions: 'never' });

export type LanguageCode = 'zh-CN' | 'zh-TW' | 'en-US';

export type TranslationKey = keyof typeof zhCN;

type TranslationData<K extends string = string> =
  TranslationMap<K> | (() => Promise<{ default: TranslationMap<K> }>);

const i18nData: Record<LanguageCode, TranslationData> = {
  'zh-CN': zhCN,
  'zh-TW': () => import('./zh-TW'),
  'en-US': () => import('./en-US'),
};

export const createI18nStore = <N extends LanguageCode, K extends string>(
  language?: N,
  data?: TranslationMap<K>,
) => {
  const store = new TranslationModel<N, K>({
    ...i18nData,
    ...(language && { [language]: data }),
  });

  if (language) store.currentLanguage = language;
  if (data) store.currentMap = data;

  return store;
};

export const i18n = createI18nStore<LanguageCode, TranslationKey>();

export const LanguageName: Record<LanguageCode, string> = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'en-US': 'English',
};

type SSRI18nInput = {
  cookie?: string;
  acceptLanguage?: string;
  query?: Record<string, string | string[] | undefined>;
};

const pickFirstQueryValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const mergeCookieLanguage = (cookie: string, language?: string) => {
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

  const { language: currentLanguage = 'zh-CN', languageMap = zhCN } =
    (await loadLanguageMapFrom(i18nData, {
      cookie: mergeCookieLanguage(
        cookie,
        pickFirstQueryValue(query.language) ?? language,
      ),
      'accept-language': acceptLanguage,
    })) ?? {};

  return {
    language: currentLanguage,
    languageMap,
  };
};
