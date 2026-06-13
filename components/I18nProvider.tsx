'use client'

import { i18n } from '@/i18n';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  void i18n;
  return children;
}