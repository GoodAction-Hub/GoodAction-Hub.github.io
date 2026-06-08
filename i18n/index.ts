import {
  loadLanguageMapFrom,
  TranslationMap,
  TranslationModel,
} from 'mobx-i18n';
import { DataObject } from 'mobx-restful';
import { parseCookie } from 'web-utility';

import zhCN from './zh-CN';

const i18nData = {
  'zh-CN': zhCN,
  'zh-TW': () => import('./zh-TW'),
  'en-US': () => import('./en-US'),
};
export type LanguageCode = keyof typeof i18nData;

export interface I18nProps {
  language: LanguageCode;
  languageMap: typeof zhCN;
}

type I18nTextKey = keyof typeof zhCN;

export const createI18nStore = <N extends LanguageCode>(
  language?: N,
  data?: TranslationMap<I18nTextKey>,
) => {
  const store = new TranslationModel({
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

type SSRI18nInput = {
  cookie?: string;
  acceptLanguage?: string;
  query?: Record<string, string | string[] | undefined>;
};

const pickFirstQueryValue = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

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
  const { language } = parseSSRContext<{ language?: LanguageCode }>(
    { cookie, query },
    ['language'],
  );
  const header = {
    'accept-language': acceptLanguage,
    cookie: language ? `language=${language}` : cookie,
  };
  const loaded = await loadLanguageMapFrom(i18nData, header);

  return loaded || { language: 'zh-CN' as const, languageMap: zhCN };
};
