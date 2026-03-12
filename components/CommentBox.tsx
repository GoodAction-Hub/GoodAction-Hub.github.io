'use client';

import Giscus from '@giscus/react';

export function CommentBox() {
  return (
    <Giscus
      repo="GoodAction-Hub/GoodAction-data"
      repoId="R_kgDORijn4w"
      category="Polls"
      categoryId="DIC_kwDORijn484C4B4X"
      mapping="title"
      strict="1"
      reactionsEnabled="1"
      emitMetadata="1"
      inputPosition="bottom"
      theme="preferred_color_scheme"
      lang="zh-CN"
    />
  );
}

