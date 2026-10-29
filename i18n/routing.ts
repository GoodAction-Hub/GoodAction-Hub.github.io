import type { LanguageCode } from './index';

export const localizedPath = (language: LanguageCode, path: string) =>
  `/${language}${path.startsWith('/') ? path : `/${path}`}`;
