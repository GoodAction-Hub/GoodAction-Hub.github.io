import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { type PropsWithChildren } from 'react';
import Script from 'next/script';

import { loadSSRI18nFromRequest } from '@/i18n/server';
import { I18nProvider } from '@/components/I18nProvider';
import { MainNav } from '@/components/MainNav';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

// 使用 Inter 字体替代 Geist 字体以避免 Turbopack 兼容性问题
const fontMono = Inter({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await loadSSRI18nFromRequest();

  return {
    title: 'GoodAction-Hub',
    description: t('metadata.description'),
  };
}

export default async function RootLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const { currentLanguage, currentMap } = await loadSSRI18nFromRequest();

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
        <I18nProvider language={currentLanguage} languageMap={currentMap}>
          <MainNav />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
