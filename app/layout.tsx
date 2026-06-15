import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import { type PropsWithChildren } from 'react';

import { I18nProvider } from '@/components/I18nProvider';
import { MainNav } from '@/components/MainNav';
import { loadSSRLanguage } from '@/i18n';
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

export const metadata: Metadata = {
  title: 'GoodAction-Hub',
  description:
    '追踪公益慈善会议、竞赛和活动重要截止日期的网站，帮助公益从业者、志愿者和爱心人士及时了解最新的公益慈善活动动态，不再错过参与公益事业、奉献爱心和社会服务的机会。',
};

export default async function RootLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const headerStore = await headers();
  const { language, languageMap } = await loadSSRLanguage({
    cookie: headerStore.get('cookie') ?? '',
    acceptLanguage: headerStore.get('accept-language') ?? '',
  });

  return (
    <html lang={language}>
      <head>
        <script
          defer
          src="https://umami.rkd.icu/script.js"
          data-website-id="78225323-cc05-46af-9a51-6c670b9a804a"
        ></script>
      </head>
      <body className={`${inter.variable} ${fontMono.variable} antialiased`}>
        <I18nProvider language={language} languageMap={languageMap}>
          <MainNav />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
