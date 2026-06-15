'use client';

import { type TranslationMap } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { ObservedComponent, reaction } from 'mobx-react-helper';
import { type PropsWithChildren } from 'react';

import { I18nContext } from '@/i18n/context';
import { createI18nStore, type LanguageCode } from '@/i18n';

export interface I18nProps {
  language: LanguageCode;
  languageMap: TranslationMap<string>;
}

@observer
export class I18nProvider extends ObservedComponent<
  PropsWithChildren<I18nProps>
> {
  readonly i18nStore = createI18nStore(
    this.props.language,
    this.props.languageMap,
  );

  @reaction(({ observedProps }) => observedProps.language)
  updateLanguage(language: LanguageCode) {
    this.i18nStore.currentLanguage = language;
  }

  @reaction(({ observedProps }) => observedProps.languageMap)
  updateLanguageMap(languageMap: TranslationMap<string>) {
    this.i18nStore.currentMap = languageMap;
  }

  render() {
    return (
      <I18nContext.Provider value={this.i18nStore}>
        {this.props.children}
      </I18nContext.Provider>
    );
  }
}
