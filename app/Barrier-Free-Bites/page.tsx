'use client';

import { useState, useEffect } from 'react';
import FoodAIDialog from '@/components/FoodAIDialog';
import SafeTranslation from '@/components/SafeTranslation';
import { fetchBitesCatalog, BitesRestaurant } from '@/lib/bitesCatalog';

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
          <style>{`
          :root {
            --color-white: rgba(255, 255, 255, 1);
            --color-cream-50: rgba(252, 252, 249, 1);
            --color-cream-100: rgba(255, 255, 253, 1);
            --color-gray-300: rgba(167, 169, 169, 1);
            --color-slate-500: rgba(98, 108, 113, 1);
            --color-brown-600: rgba(94, 82, 64, 1);
            --color-charcoal-700: rgba(31, 33, 33, 1);
            --color-charcoal-800: rgba(38, 40, 40, 1);
            --color-slate-900: rgba(19, 52, 59, 1);
            --color-teal-300: rgba(50, 184, 198, 1);
            --color-teal-500: rgba(33, 128, 141, 1);
            --color-teal-600: rgba(29, 116, 128, 1);
            --color-teal-700: rgba(8, 145, 178, 1);
            --color-gray-200: rgba(245, 245, 245, 1);
            --color-orange-500: rgba(168, 75, 47, 1);
            --color-background: var(--color-cream-50);
            --color-surface: var(--color-cream-100);
            --color-text: var(--color-slate-900);
            --color-text-secondary: var(--color-slate-500);
            --color-primary: rgba(147, 51, 234, 1);
            --color-primary-hover: rgba(126, 34, 206, 1);
            --color-accent: rgba(219, 39, 119, 1);
            --color-secondary: rgba(8, 145, 178, 1);
            --color-card-border: rgba(255, 255, 255, 0.2);
            --color-border: rgba(255, 255, 255, 0.2);
            --font-size-sm: 12px;
            --font-size-base: 14px;
            --font-size-lg: 16px;
            --font-size-xl: 18px;
            --font-size-2xl: 20px;
            --font-size-3xl: 24px;
            --font-weight-medium: 500;
            --font-weight-semibold: 550;
            --font-weight-bold: 600;
            --space-8: 8px;
            --space-12: 12px;
            --space-16: 16px;
            --space-20: 20px;
            --space-24: 24px;
            --space-32: 32px;
            --radius-base: 8px;
            --radius-lg: 12px;
            --shadow-sm: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02);
            --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.04), 0 2px 4px -1px rgba(0,0,0,0.02);
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --color-background: var(--color-charcoal-700);
              --color-surface: var(--color-charcoal-800);
              --color-text: var(--color-gray-200);
              --color-primary: rgba(192, 132, 252, 1);
              --color-card-border: rgba(255, 255, 255, 0.15);
              --color-border: rgba(255, 255, 255, 0.3);
            }
          }
          .header { text-align: center; margin-bottom: var(--space-32); padding: var(--space-24) 0; }
          .subtitle { font-size: var(--font-size-lg); color: var(--color-text-secondary); font-weight: var(--font-weight-medium); }
          .filter-section { display: flex; gap: var(--space-12); margin-bottom: var(--space-32); flex-wrap: wrap; justify-content: center; }
          .filter-btn { padding: var(--space-8) var(--space-20); border: 2px solid var(--color-border); background: var(--color-surface); color: var(--color-text); border-radius: var(--radius-base); cursor: pointer; font-size: var(--font-size-base); font-weight: var(--font-weight-medium); transition: all 0.3s ease; }
          .filter-btn:hover, .filter-btn.active { border-color: var(--color-primary); background: linear-gradient(90deg, var(--color-primary), var(--color-accent)); color: var(--color-white); }
          .restaurants-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-24); margin-bottom: var(--space-32); }
          .restaurant-card { background: var(--color-surface); border: 1px solid var(--color-card-border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); transition: all 0.3s ease; display: flex; flex-direction: column; }
          .restaurant-card:hover { box-shadow: var(--shadow-md); transform: translateY(-4px); }
          .card-header { background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 50%, var(--color-secondary) 100%); padding: var(--space-20); color: var(--color-white); }
          .restaurant-name { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-8); }
          .accessibility-tags { display: flex; gap: var(--space-8); flex-wrap: wrap; }
          .tag { display: inline-flex; align-items: center; gap: 4px; padding: 4px var(--space-12); background: rgba(255,255,255,0.2); border-radius: 20px; font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); }
          .card-body { padding: var(--space-20); flex-grow: 1; display: flex; flex-direction: column; }
          .description { font-size: var(--font-size-base); color: var(--color-text-secondary); margin-bottom: var(--space-16); line-height: 1.7; }
          .features { margin-bottom: var(--space-16); }
          .features-title { font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-8); color: var(--color-text); }
          .features-list { list-style: none; padding: 0; }
          .features-list li { font-size: var(--font-size-sm); color: var(--color-text-secondary); padding: 4px 0 4px var(--space-16); position: relative; }
          .features-list li::before { content: "✓"; position: absolute; left: 0; color: var(--color-primary); font-weight: var(--font-weight-bold); }
          .info-section { margin-top: auto; padding-top: var(--space-16); border-top: 1px solid var(--color-card-border); }
          .info-item { display: flex; align-items: flex-start; gap: var(--space-8); margin-bottom: var(--space-8); font-size: var(--font-size-sm); color: var(--color-text-secondary); }
          .info-label { font-weight: var(--font-weight-semibold); color: var(--color-text); min-width: 60px; }
          .about-section { position: relative; overflow: hidden; background: linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.96)); border: 1px solid var(--color-card-border); border-radius: var(--radius-lg); padding: var(--space-24); margin-top: var(--space-32); box-shadow: 0 12px 28px rgba(0,0,0,0.08); }
          .about-header { display: flex; align-items: center; gap: var(--space-12); margin-bottom: var(--space-12); }
          .about-icon { flex: 0 0 auto; width: 36px; height: 36px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; color: var(--color-white); background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 50%, var(--color-secondary) 100%); font-size: var(--font-size-lg); }
          .about-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--color-text); }
          .about-content { font-size: var(--font-size-base); color: var(--color-text-secondary); line-height: 1.85; }
          .about-content p { margin-bottom: var(--space-12); }
          .icon { font-size: var(--font-size-lg); }
          @media (max-width: 768px) {
            .restaurants-grid { grid-template-columns: 1fr; }
            .filter-section { flex-direction: column; }
            .filter-btn { width: 100%; }
          }
          `}</style>

          <header className="header">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent mb-3">
              🌟{' '}
              <SafeTranslation
                tKey="bites.title"
                fallback="无障碍友好美食指南"
              />
            </h1>
            <p className="subtitle">
              <SafeTranslation
                tKey="bites.subtitle"
                fallback="发现包容性餐饮体验"
              />
            </p>
          </header>

          <div className="filter-section">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              <SafeTranslation tKey="bites.filters.all" fallback="全部" />
            </button>
            <button
              className={`filter-btn ${filter === 'hearing' ? 'active' : ''}`}
              onClick={() => setFilter('hearing')}
            >
              <SafeTranslation
                tKey="bites.filters.hearing"
                fallback="听障友好"
              />
            </button>
            <button
              className={`filter-btn ${filter === 'visual' ? 'active' : ''}`}
              onClick={() => setFilter('visual')}
            >
              <SafeTranslation
                tKey="bites.filters.visual"
                fallback="视障友好"
              />
            </button>
            <button
              className={`filter-btn ${filter === 'wheelchair' ? 'active' : ''}`}
              onClick={() => setFilter('wheelchair')}
            >
              <SafeTranslation
                tKey="bites.filters.wheelchair"
                fallback="轮椅友好"
              />
            </button>
            <button
              className={`filter-btn ${filter === 'cognitive' ? 'active' : ''}`}
              onClick={() => setFilter('cognitive')}
            >
              <SafeTranslation
                tKey="bites.filters.cognitive"
                fallback="认知友好"
              />
            </button>
          </div>

          <div className="restaurants-grid">
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
                    className="restaurant-card"
                    key={restaurant.id}
                    data-accessibility={types.join(',')}
                  >
                    <div className="card-header">
                      <h2 className="restaurant-name">{restaurant.name}</h2>
                      <div className="accessibility-tags">
                        {restaurant.accessibility.deafFriendly && (
                          <span className="tag">
                            <span className="icon">👂</span>
                            <SafeTranslation
                              tKey="bites.tags.hearing"
                              fallback="听障友好"
                            />
                          </span>
                        )}
                        {restaurant.accessibility.blindFriendly && (
                          <span className="tag">
                            <span className="icon">👁️</span>
                            <SafeTranslation
                              tKey="bites.tags.visual"
                              fallback="视障友好"
                            />
                          </span>
                        )}
                        {types.includes('wheelchair') && (
                          <span className="tag">
                            <span className="icon">♿</span>
                            <SafeTranslation
                              tKey="bites.tags.wheelchair"
                              fallback="轮椅友好"
                            />
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="card-body">
                      <p className="description">{restaurant.description}</p>
                      {restaurant.tags.length > 0 && (
                        <div className="features">
                          <h3 className="features-title">
                            <SafeTranslation
                              tKey="bites.labels.features"
                              fallback="特色服务"
                            />
                          </h3>
                          <ul className="features-list">
                            {restaurant.tags.map((tag, i) => (
                              <li key={i}>{tag}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {restaurant.food && restaurant.food.length > 0 && (
                        <div className="info-item">
                          <span className="info-label">
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
                      <div className="info-section">
                        <div className="info-item">
                          <span className="info-label">
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
                                <svg
                                  className="animate-spin h-3 w-3"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                <SafeTranslation
                                  tKey="bites.labels.navigating"
                                  fallback="导航中..."
                                />
                              </>
                            ) : (
                              <>
                                <svg
                                  className="h-3 w-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
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
          <div className="about-section">
            <div className="about-header">
              <span className="about-icon" aria-hidden="true">
                🍽️
              </span>
              <h2 className="about-title">
                <SafeTranslation
                  tKey="bites.about.title"
                  fallback="关于无障碍美食"
                />
              </h2>
            </div>
            <div className="about-content">
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
