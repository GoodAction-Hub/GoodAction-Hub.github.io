'use client';

import { useState, useEffect } from 'react';
import { Info, Loader2, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import FoodAIDialog from '@/components/FoodAIDialog';
import SafeTranslation from '@/components/SafeTranslation';
import { fetchBitesCatalog, BitesRestaurant } from '@/lib/bitesCatalog';
import styles from './page.module.css';

type FilterType = 'all' | 'hearing' | 'visual' | 'wheelchair' | 'cognitive';

function getAccessibilityTypes(r: BitesRestaurant): FilterType[] {
  const types: FilterType[] = [];
  if (r.accessibility.deafFriendly) types.push('hearing');
  if (r.accessibility.blindFriendly) types.push('visual');
  const text = r.tags.join(' ');
  if (/轮椅|坡道|无障碍通/.test(text)) types.push('wheelchair');
  if (/认知|自闭|学习障碍/.test(text)) types.push('cognitive');
  return types;
}

export default function BarrierFreeBitesPage() {
  const { t } = useTranslation('common');
  const [filter, setFilter] = useState<FilterType>('all');
  const [restaurants, setRestaurants] = useState<BitesRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [navigationLoading, setNavigationLoading] = useState<string | null>(
    null,
  );

  useEffect(() => {
    fetchBitesCatalog().then((data) => {
      setRestaurants(data);
      setLoading(false);
    });
  }, []);

  const filteredRestaurants = restaurants.filter((r) => {
    if (filter === 'all') return true;
    return getAccessibilityTypes(r).includes(filter);
  });

  const openAmapNavigation = (restaurant: BitesRestaurant) => {
    const { name, address, lat, lng } = restaurant;
    setNavigationLoading(name);

    if (lat && lng) {
      const appUrl = `amapuri://route/plan/?dlat=${lat}&dlon=${lng}&dname=${encodeURIComponent(name)}&dev=0&t=0`;
      const webUrl = `https://uri.amap.com/navigation?to=${lng},${lat},${encodeURIComponent(name)}&mode=car&policy=1&src=mypage`;

      const tryOpenApp = () => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = appUrl;
        document.body.appendChild(iframe);

        const timeout = setTimeout(() => {
          document.body.removeChild(iframe);
          window.open(webUrl, '_blank', 'noopener,noreferrer');
          setNavigationLoading(null);
        }, 2000);

        const handleVisibilityChange = () => {
          if (document.hidden) {
            clearTimeout(timeout);
            document.body.removeChild(iframe);
            document.removeEventListener(
              'visibilitychange',
              handleVisibilityChange,
            );
            setNavigationLoading(null);
          }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        setTimeout(() => {
          try {
            if (iframe.parentNode) document.body.removeChild(iframe);
            document.removeEventListener(
              'visibilitychange',
              handleVisibilityChange,
            );
          } catch {
            // ignore cleanup errors
          }
        }, 3000);
      };

      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );

      if (isMobile) {
        tryOpenApp();
      } else {
        window.open(webUrl, '_blank', 'noopener,noreferrer');
        setNavigationLoading(null);
      }
    } else {
      const markerUrl = `https://uri.amap.com/marker?address=${encodeURIComponent(address)}&name=${encodeURIComponent(name)}`;
      window.open(markerUrl, '_blank', 'noopener,noreferrer');
      setNavigationLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <header className={styles.header}>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent mb-3">
              🌟{' '}
              <SafeTranslation
                tKey="bites.title"
                fallback="无障碍友好美食指南"
              />
            </h1>
            <p className={styles.subtitle}>
              <SafeTranslation
                tKey="bites.subtitle"
                fallback="发现包容性餐饮体验"
              />
            </p>
            <div className="mt-4 flex justify-center">
              <a
                href="https://github.com/GoodAction-Hub/GoodAction-data/issues/new?template=restaurant.yml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm font-medium"
              >
                + 发布餐厅
              </a>
            </div>
          </header>

          <div className={styles.filterSection}>
            <button
              className={`${styles.filterBtn} ${filter === 'all' ? styles.filterBtnActive : ''}`}
              onClick={() => setFilter('all')}
            >
              <SafeTranslation tKey="bites.filters.all" fallback="全部" />
            </button>
            <button
              className={`${styles.filterBtn} ${filter === 'hearing' ? styles.filterBtnActive : ''}`}
              onClick={() => setFilter('hearing')}
            >
              <SafeTranslation
                tKey="bites.filters.hearing"
                fallback="听障友好"
              />
            </button>
            <button
              className={`${styles.filterBtn} ${filter === 'visual' ? styles.filterBtnActive : ''}`}
              onClick={() => setFilter('visual')}
            >
              <SafeTranslation
                tKey="bites.filters.visual"
                fallback="视障友好"
              />
            </button>
            <button
              className={`${styles.filterBtn} ${filter === 'wheelchair' ? styles.filterBtnActive : ''}`}
              onClick={() => setFilter('wheelchair')}
            >
              <SafeTranslation
                tKey="bites.filters.wheelchair"
                fallback="轮椅友好"
              />
            </button>
            <button
              className={`${styles.filterBtn} ${filter === 'cognitive' ? styles.filterBtnActive : ''}`}
              onClick={() => setFilter('cognitive')}
            >
              <SafeTranslation
                tKey="bites.filters.cognitive"
                fallback="认知友好"
              />
            </button>
          </div>

          <div className={styles.restaurantsGrid}>
            {loading ? (
              <div className="text-center py-12 text-gray-500">
                <SafeTranslation tKey="bites.loading" fallback="加载中..." />
              </div>
            ) : filteredRestaurants.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <SafeTranslation
                  tKey="bites.no_results"
                  fallback="暂无符合条件的餐厅"
                />
              </div>
            ) : (
              filteredRestaurants.map((restaurant) => {
                const types = getAccessibilityTypes(restaurant);
                const isNavigating = navigationLoading === restaurant.name;
                return (
                  <div
                    className={styles.restaurantCard}
                    key={restaurant.id}
                    data-accessibility={types.join(',')}
                  >
                    <div className={styles.cardHeader}>
                      <h2 className={styles.restaurantName}>
                        {restaurant.name}
                      </h2>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/restaurants/${restaurant.id}`}
                          className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
                          title={t('detail.viewDetails')}
                        >
                          <Info className="w-4 h-4" />
                        </Link>
                      </div>
                      <div className={styles.accessibilityTags}>
                        {restaurant.accessibility.deafFriendly && (
                          <span className={styles.tag}>
                            <span className={styles.icon}>👂</span>
                            <SafeTranslation
                              tKey="bites.tags.hearing"
                              fallback="听障友好"
                            />
                          </span>
                        )}
                        {restaurant.accessibility.blindFriendly && (
                          <span className={styles.tag}>
                            <span className={styles.icon}>👁️</span>
                            <SafeTranslation
                              tKey="bites.tags.visual"
                              fallback="视障友好"
                            />
                          </span>
                        )}
                        {types.includes('wheelchair') && (
                          <span className={styles.tag}>
                            <span className={styles.icon}>♿</span>
                            <SafeTranslation
                              tKey="bites.tags.wheelchair"
                              fallback="轮椅友好"
                            />
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={styles.cardBody}>
                      <p className={styles.description}>
                        {restaurant.description}
                      </p>
                      {restaurant.tags.length > 0 && (
                        <div className={styles.features}>
                          <h3 className={styles.featuresTitle}>
                            <SafeTranslation
                              tKey="bites.labels.features"
                              fallback="特色服务"
                            />
                          </h3>
                          <ul className={styles.featuresList}>
                            {restaurant.tags.map((tag, i) => (
                              <li key={i}>{tag}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {restaurant.food && restaurant.food.length > 0 && (
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>
                            <SafeTranslation
                              tKey="bites.labels.food"
                              fallback="美食类型"
                            />
                          </span>
                          <span>
                            {restaurant.food.map((f) => f.name).join('、')}
                          </span>
                        </div>
                      )}
                      <div className={styles.infoSection}>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>
                            <SafeTranslation
                              tKey="bites.labels.address"
                              fallback="地址"
                            />
                          </span>
                          <span>{restaurant.address}</span>
                          <button
                            aria-label="导航"
                            className="ml-2 px-3 py-1 rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => openAmapNavigation(restaurant)}
                            disabled={isNavigating}
                          >
                            {isNavigating ? (
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
                                <SafeTranslation
                                  tKey="bites.labels.navigate"
                                  fallback="导航"
                                />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 关于部分 */}
          <div className={styles.aboutSection}>
            <div className={styles.aboutHeader}>
              <span className={styles.aboutIcon} aria-hidden="true">
                🍽️
              </span>
              <h2 className={styles.aboutTitle}>
                <SafeTranslation
                  tKey="bites.about.title"
                  fallback="关于无障碍美食"
                />
              </h2>
            </div>
            <div className={styles.aboutContent}>
              <p>
                <SafeTranslation
                  tKey="bites.about.p1"
                  fallback="无障碍美食致力于为残障人士提供平等的用餐体验。我们精选了各地的无障碍友好餐厅，涵盖听障、视障、轮椅使用者和认知障碍人士的需求。"
                />
              </p>
              <p>
                <SafeTranslation
                  tKey="bites.about.p2"
                  fallback="每家餐厅都经过实地考察，确保提供真正的无障碍服务。我们希望通过这个平台，让更多人了解和支持无障碍餐饮，共同创造一个更包容的社会。"
                />
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* AI 美食推荐对话框触发器 */}
      <FoodAIDialog />
    </div>
  );
}
