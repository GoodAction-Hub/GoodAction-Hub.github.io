'use client';

import Giscus from '@giscus/react';
import { useTranslation } from 'react-i18next';

export function CommentBox() {
  const { i18n } = useTranslation('common');
  return (
    <Giscus
      repo="GoodAction-Hub/GoodAction-Hub.github.io"
      repoId="R_kgDORiOZLg"
      category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? 'General'}
      categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? ''}
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="preferred_color_scheme"
      lang={i18n.language ?? 'zh-CN'}
    />
  );
}

