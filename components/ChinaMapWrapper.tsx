'use client';

import dynamic from 'next/dynamic';
import type { OpenReactMapProps } from 'open-react-map';

const ChinaMap = dynamic(() => import('@/components/ChinaMap'), { ssr: false });

type Props = Pick<OpenReactMapProps, 'zoom' | 'title' | 'address'>;

export function ChinaMapWrapper(props: Props) {
  return (
    <div style={{ minHeight: '12rem' }}>
      <ChinaMap {...props} />
    </div>
  );
}
