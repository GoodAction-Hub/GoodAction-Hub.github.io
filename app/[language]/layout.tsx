import type { Metadata } from 'next';
import { toJS } from 'mobx';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { type PropsWithChildren } from 'react';

import { I18nProvider } from '@/components/I18nProvider';
import { MainNav } from '@/components/MainNav';
import { LanguageName, type LanguageCode } from '@/i18n';
import { loadSSRI18n } from '@/i18n/server';
import '../globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const fontMono = Inter({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const isLanguageCode = (language: string): language is LanguageCode =>
  Object.hasOwn(LanguageName, language);

interface LanguageLayoutProps extends PropsWithChildren {
  params: Promise<{ language: string }>;
}

export const generateStaticParams = () =>
  Object.keys(LanguageName).map((language) => ({ language }));

export async function generateMetadata({
  params,
}: Pick<LanguageLayoutProps, 'params'>): Promise<Metadata> {
  const { language } = await params;
  if (!isLanguageCode(language)) notFound();

  const { t } = await loadSSRI18n(language);

  return {
    title: 'GoodAction-Hub',
    description: t('metadata.description'),
  };
}

export default async function LanguageLayout({
  children,
  params,
}: LanguageLayoutProps) {
  const { language } = await params;
  if (!isLanguageCode(language)) notFound();

  const { currentLanguage, currentMap } = await loadSSRI18n(language);

  return (
    <html lang={currentLanguage}>
      <head>
        <Script
          src="https://umami.rkd.icu/script.js"
          data-website-id="78225323-cc05-46af-9a51-6c670b9a804a"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.variable} ${fontMono.variable} antialiased`}>
        <I18nProvider language={currentLanguage} languageMap={toJS(currentMap)}>
          <MainNav />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
