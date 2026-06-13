import {
  TranslationMap,
  TranslationModel,
} from 'mobx-i18n';
import { DataObject } from 'mobx-restful';
import { parseCookie } from 'web-utility';

import commonEN from '@/public/locales/en/common.json';
import translationEN from '@/public/locales/en/translation.json';
import commonZhCN from '@/public/locales/zh-CN/common.json';
import translationZhCN from '@/public/locales/zh-CN/translation.json';
import commonZhTW from '@/public/locales/zh-TW/common.json';
import translationZhTW from '@/public/locales/zh-TW/translation.json';

import enUS from './en-US';
import zhCN from './zh-CN';
import zhTW from './zh-TW';

type TranslationTree = Record<string, unknown>;

const flattenLanguageMap = (
  source: TranslationTree,
  prefix = '',
  result: Record<string, string> = {},
) => {
  for (const [key, value] of Object.entries(source)) {
    const nextKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      result[nextKey] = value;
      continue;
    }
    if (Array.isArray(value) || value == null || typeof value !== 'object')
      continue;

    flattenLanguageMap(value as TranslationTree, nextKey, result);
  }

  return result;
};

const zhCNMap = {
  ...flattenLanguageMap(commonZhCN),
  ...flattenLanguageMap(translationZhCN),
  ...zhCN,
};
const zhTWMap = {
  ...flattenLanguageMap(commonZhTW),
  ...flattenLanguageMap(translationZhTW),
  ...zhTW,
};
const enMap = {
  ...flattenLanguageMap(commonEN),
  ...flattenLanguageMap(translationEN),
  ...enUS,
};

const i18nData = {
  'zh-CN': zhCNMap,
  'zh-TW': zhTWMap,
  en: enMap,
  'en-US': enMap,
} as const;
export type LanguageCode = keyof typeof i18nData;

export const supportedLngDisplayNames: Record<LanguageCode, string> = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  en: 'English',
  'en-US': 'English',
};

export interface I18nProps {
  language: LanguageCode;
  languageMap: Record<string, string>;
}

type I18nTextKey = string;

export const normalizeLanguageCode = (language = ''): LanguageCode | undefined => {
  const normalized = language.trim().toLowerCase();

  if (!normalized) return;
  if (normalized.startsWith('zh-tw') || normalized.startsWith('zh-hk'))
    return 'zh-TW';
  if (normalized.startsWith('zh')) return 'zh-CN';
  if (normalized.startsWith('en')) return 'en';
};

export const createI18nStore = <N extends LanguageCode>(
  language?: N,
  data?: TranslationMap<I18nTextKey>,
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
  en: 'English',
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
  const { language } = parseSSRContext<{ language?: string }>(
    { cookie, query },
    ['language'],
  );
  const acceptedLanguages = acceptLanguage
    ? acceptLanguage.split(',').map((item) => item.split(';')[0]?.trim())
    : [];
  const normalizedLanguage = [
    normalizeLanguageCode(pickFirstQueryValue(query.language)),
    normalizeLanguageCode(language),
    ...acceptedLanguages.map(normalizeLanguageCode),
  ].find(Boolean);
  const currentLanguage = normalizedLanguage ?? 'zh-CN';

  return {
    language: currentLanguage,
    languageMap: i18nData[currentLanguage],
  };
};
