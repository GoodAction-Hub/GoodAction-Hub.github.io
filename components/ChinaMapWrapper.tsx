'use client';

import dynamic from 'next/dynamic';
import type { FC } from 'react';
import type { OpenReactMapProps } from 'open-react-map';

const ChinaMap = dynamic(() => import('@/components/ChinaMap'), { ssr: false });

type Props = Pick<OpenReactMapProps, 'zoom' | 'title' | 'address'>;

export const ChinaMapWrapper: FC<Props> = (props) => (
  <div style={{ minHeight: '12rem' }}>
    <ChinaMap {...props} />
  </div>
);
