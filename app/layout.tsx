import I18nProvider from '@/components/I18nProvider';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { SwitchLanguage } from '@/components/SwitchLanguage';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// 使用 Inter 字体替代 Geist 字体以避免 Turbopack 兼容性问题
const fontMono = Inter({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GoodAction-Hub",
  description: "追踪公益慈善会议、竞赛和活动重要截止日期的网站，帮助公益从业者、志愿者和爱心人士及时了解最新的公益慈善活动动态，不再错过参与公益事业、奉献爱心和社会服务的机会。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script defer src="https://umami.rkd.icu/script.js" data-website-id="78225323-cc05-46af-9a51-6c670b9a804a"></script>
      </head>
      <body
        className={`${inter.variable} ${fontMono.variable} antialiased`}
      >
        <I18nProvider>
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <nav className="flex items-center gap-3">
                <Link href="/" className="text-sm md:text-base font-semibold bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 bg-clip-text text-transparent hover:brightness-110">
                      公益慈善活动截止日期
                    </Link>
                <span className="text-gray-300">|</span>
                <Link href="/Barrier-Free-Bites" className="text-sm md:text-base font-semibold bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 bg-clip-text text-transparent hover:brightness-110">
                   无障碍友好美食指南
                 </Link>
              </nav>
              <div className="flex items-center gap-3">
                <SwitchLanguage />
              </div>
            </div>
          </header>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
