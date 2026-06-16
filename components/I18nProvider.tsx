'use client';

import { type TranslationMap } from 'mobx-i18n';
import { FC, type PropsWithChildren } from 'react';

import { I18nContext } from '@/i18n/context';
import { createI18nStore, type LanguageCode } from '@/i18n';

export interface I18nProps {
  language: LanguageCode;
  languageMap: TranslationMap<string>;
}

export const I18nProvider: FC<PropsWithChildren<I18nProps>> = ({
  children,
  language,
  languageMap,
}) => (
  <I18nContext.Provider value={createI18nStore(language, languageMap)}>
    {children}
  </I18nContext.Provider>
);
