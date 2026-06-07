'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Fragment, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SwitchLanguage } from '@/components/SwitchLanguage';

const links = [
  { href: '/activities', label: '公益慈善活动截止日期' },
  { href: '/restaurants', label: '无障碍友好美食指南' },
  { href: '/tutoring', label: '志愿辅导课程' },
];

const linkClass =
  'font-semibold bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 bg-clip-text text-transparent hover:brightness-110 whitespace-nowrap';

export function MainNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 shrink-0 group"
          aria-label="GoodActionHub"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/pick-heart.png"
            alt="GoodActionHub logo"
            width={24}
            height={24}
            className="rounded-sm"
          />
          <span
            className={`text-sm md:text-base font-bold ${linkClass} group-hover:brightness-110 transition-all`}
          >
            GoodActionHub
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-3">
          {links.map((l, i) => (
            <Fragment key={l.href}>
              {i > 0 && <span className="text-gray-300">|</span>}
              <Link href={l.href} className={`text-base ${linkClass}`}>
                {l.label}
              </Link>
            </Fragment>
          ))}
        </nav>

        {/* Desktop language switch */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <SwitchLanguage />
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-pink-600 hover:bg-pink-50 transition-colors shrink-0"
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <nav className="lg:hidden border-t border-pink-100 bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-1 flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`py-3 text-base border-b border-gray-100 ${linkClass}`}
              >
                {l.label}
              </Link>
            ))}
            <div className="py-3">
              <SwitchLanguage />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
