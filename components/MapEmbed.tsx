'use client';

import { ExternalLink, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface GeoResult {
  lat: string;
  lon: string;
}

interface MapEmbedProps {
  address: string;
}

/** Bounding box half-width in degrees (~5 km at the equator). */
const BBOX_OFFSET = 0.05;

export function MapEmbed({ address }: MapEmbedProps) {
  const { t, i18n } = useTranslation('common');
  const [coords, setCoords] = useState<GeoResult | null>(null);
  const [loading, setLoading] = useState(!!address);

  useEffect(() => {
    if (!address) {
      return;
    }
    fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
      {
        headers: {
          'Accept-Language': i18n.language ?? 'zh-CN',
          'User-Agent': 'GoodActionHub/1.0 (https://goodactionhub.org)',
        },
      },
    )
      .then((r) => r.json())
      .then((results: GeoResult[]) => {
        if (results[0]) setCoords(results[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [address, i18n.language]);

  const mapUrl = coords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(coords.lon) - BBOX_OFFSET},${parseFloat(coords.lat) - BBOX_OFFSET},${parseFloat(coords.lon) + BBOX_OFFSET},${parseFloat(coords.lat) + BBOX_OFFSET}&layer=mapnik&marker=${coords.lat},${coords.lon}`
    : null;

  const amapUrl = `https://uri.amap.com/search?keyword=${encodeURIComponent(address)}`;
  const osmUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(address)}`;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span>{address}</span>
        </div>
        <a
          href={amapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs hover:from-cyan-600 hover:to-blue-600 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          {t('detail.openInAmap')}
        </a>
        <a
          href={osmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1 rounded-md border border-gray-300 text-gray-600 text-xs hover:bg-gray-50 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          OpenStreetMap
        </a>
      </div>

      {loading && (
        <div className="h-[300px] rounded-lg border bg-gray-50 flex items-center justify-center">
          <div className="text-center text-muted-foreground text-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2" />
            {t('detail.loadingMap')}
          </div>
        </div>
      )}

      {!loading && mapUrl && (
        <iframe
          title={`Map – ${address}`}
          src={mapUrl}
          width="100%"
          height="300"
          className="rounded-lg border"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      )}

      {!loading && !mapUrl && (
        <div className="h-[120px] rounded-lg border bg-gray-50 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            {t('detail.mapUnavailable')}
          </p>
        </div>
      )}
    </div>
  );
}
