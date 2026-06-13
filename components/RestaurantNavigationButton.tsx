'use client';

import SafeTranslation from '@/components/SafeTranslation';
import { Loader2, MapPin } from 'lucide-react';
import { useState } from 'react';

interface RestaurantNavigationButtonProps {
  name: string;
  address: string;
  lat?: number;
  lng?: number;
}

export function RestaurantNavigationButton({
  name,
  address,
  lat,
  lng,
}: RestaurantNavigationButtonProps) {
  const [loading, setLoading] = useState(false);

  const openAmapNavigation = () => {
    setLoading(true);

    if (lat && lng) {
      const appUrl = `amapuri://route/plan/?dlat=${lat}&dlon=${lng}&dname=${encodeURIComponent(name)}&dev=0&t=0`;
      const webUrl = `https://uri.amap.com/navigation?to=${lng},${lat},${encodeURIComponent(name)}&mode=car&policy=1&src=mypage`;

      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );

      if (isMobile) {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = appUrl;
        document.body.appendChild(iframe);

        const timeout = window.setTimeout(() => {
          iframe.remove();
          window.open(webUrl, '_blank', 'noopener,noreferrer');
          setLoading(false);
        }, 2000);

        const handleVisibilityChange = () => {
          if (document.hidden) {
            window.clearTimeout(timeout);
            iframe.remove();
            document.removeEventListener(
              'visibilitychange',
              handleVisibilityChange,
            );
            setLoading(false);
          }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.setTimeout(() => {
          iframe.remove();
          document.removeEventListener(
            'visibilitychange',
            handleVisibilityChange,
          );
        }, 3000);
        return;
      }

      window.open(webUrl, '_blank', 'noopener,noreferrer');
      setLoading(false);
      return;
    }

    const markerUrl = `https://uri.amap.com/marker?address=${encodeURIComponent(address)}&name=${encodeURIComponent(name)}`;
    window.open(markerUrl, '_blank', 'noopener,noreferrer');
    setLoading(false);
  };

  return (
    <button
      aria-label="导航"
      className="ml-2 px-3 py-1 rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={openAmapNavigation}
      disabled={loading}
      type="button"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin h-3 w-3" />
          <SafeTranslation
            tKey="bites.labels.navigating"
            fallback="导航中..."
          />
        </>
      ) : (
        <>
          <MapPin className="h-3 w-3" />
          <SafeTranslation tKey="bites.labels.navigate" fallback="导航" />
        </>
      )}
    </button>
  );
}
