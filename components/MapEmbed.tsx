'use client';

import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';

const ChinaMap = dynamic(() => import('@/components/ChinaMap'), { ssr: false });

interface MapEmbedProps {
  title: string;
  address: string;
}

export function MapEmbed({ title, address }: MapEmbedProps) {
  const { t } = useTranslation('common');

  return (
    <div style={{ minHeight: '12rem' }}>
      <ChinaMap zoom={10} title={title} address={address}>
        {t('detail.mapUnavailable')}
      </ChinaMap>
    </div>
  );
}
