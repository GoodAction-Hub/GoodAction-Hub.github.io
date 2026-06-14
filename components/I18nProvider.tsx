'use client';

import { Component, type ReactNode } from 'react';

import { I18nContext } from '@/i18n/context';
import { createI18nStore, type I18nProps, type LanguageCode } from '@/i18n';

type Props = I18nProps & {
  children: ReactNode;
};

export default class I18nProvider extends Component<Props> {
  readonly i18nStore = createI18nStore(
    this.props.language,
    this.props.languageMap,
  );

  componentDidUpdate(previousProps: Props) {
    const { language, languageMap } = this.props;

    if (previousProps.language !== language) this.i18nStore.currentLanguage = language;
    if (previousProps.languageMap !== languageMap)
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
