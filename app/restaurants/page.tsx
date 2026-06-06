import { ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import FoodAIDialog from '@/components/FoodAIDialog';
import SafeTranslation from '@/components/SafeTranslation';
import { fetchBitesCatalog, BitesRestaurant } from '@/lib/bitesCatalog';
import styles from './page.module.css';

type FilterType = 'all' | 'hearing' | 'visual' | 'wheelchair' | 'cognitive';

const PAGE_SIZE = 10;

type PageSearchParams = Promise<{
  page?: string;
  query?: string;
  filter?: FilterType;
}>;

function parsePage(rawPage?: string): number {
  const parsed = Number.parseInt(rawPage ?? '1', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function getAccessibilityTypes(r: BitesRestaurant): FilterType[] {
  const types: FilterType[] = [];
  if (r.accessibility.deafFriendly) types.push('hearing');
  if (r.accessibility.blindFriendly) types.push('visual');
  const text = r.tags.join(' ');
  if (/轮椅|坡道|无障碍通/.test(text)) types.push('wheelchair');
  if (/认知|自闭|学习障碍/.test(text)) types.push('cognitive');
  return types;
}

function buildPageHref(
  page: number,
  query: string,
  filter: FilterType,
): string {
  const params = new URLSearchParams();
  if (query) params.set('query', query);
  if (filter !== 'all') params.set('filter', filter);
  if (page > 1) params.set('page', String(page));
  const queryString = params.toString();
  return queryString ? `/restaurants?${queryString}` : '/restaurants';
}

function buildFilterHref(nextFilter: FilterType, query: string): string {
  const params = new URLSearchParams();
  if (query) params.set('query', query);
  if (nextFilter !== 'all') params.set('filter', nextFilter);
  const queryString = params.toString();
  return queryString ? `/restaurants?${queryString}` : '/restaurants';
}

function getVisiblePages(totalPages: number, currentPage: number): number[] {
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
}

export default async function BarrierFreeBitesPage({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const {
    page: rawPage,
    query: rawQuery,
    filter: rawFilter,
  } = await searchParams;
  const query = rawQuery?.trim() ?? '';
  const filter: FilterType =
    rawFilter &&
    ['all', 'hearing', 'visual', 'wheelchair', 'cognitive'].includes(rawFilter)
      ? rawFilter
      : 'all';

  const restaurants = await fetchBitesCatalog();

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : getAccessibilityTypes(restaurant).includes(filter);

    if (!matchesFilter) return false;
    if (!query) return true;

    const q = query.toLowerCase();
    return (
      restaurant.name.toLowerCase().includes(q) ||
      restaurant.address.toLowerCase().includes(q) ||
      restaurant.city.toLowerCase().includes(q) ||
      restaurant.description.toLowerCase().includes(q) ||
      restaurant.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRestaurants.length / PAGE_SIZE),
  );
  const currentPage = Math.min(parsePage(rawPage), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pagedRestaurants = filteredRestaurants.slice(start, start + PAGE_SIZE);
  const visiblePages = getVisiblePages(totalPages, currentPage);

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

          <form action="/restaurants" method="get" className="mb-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="query"
                defaultValue={query}
                placeholder="搜索餐厅名称、地址、标签..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
              />
              {filter !== 'all' && (
                <input type="hidden" name="filter" value={filter} />
              )}
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium"
              >
                搜索
              </button>
            </div>
          </form>

          <div className={styles.filterSection}>
            {(
              ['all', 'hearing', 'visual', 'wheelchair', 'cognitive'] as const
            ).map((item) => (
              <Link
                key={item}
                href={buildFilterHref(item, query)}
                className={`${styles.filterBtn} ${filter === item ? styles.filterBtnActive : ''}`}
              >
                {item === 'all' && (
                  <SafeTranslation tKey="bites.filters.all" fallback="全部" />
                )}
                {item === 'hearing' && (
                  <SafeTranslation
                    tKey="bites.filters.hearing"
                    fallback="听障友好"
                  />
                )}
                {item === 'visual' && (
                  <SafeTranslation
                    tKey="bites.filters.visual"
                    fallback="视障友好"
                  />
                )}
                {item === 'wheelchair' && (
                  <SafeTranslation
                    tKey="bites.filters.wheelchair"
                    fallback="轮椅友好"
                  />
                )}
                {item === 'cognitive' && (
                  <SafeTranslation
                    tKey="bites.filters.cognitive"
                    fallback="认知友好"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className={styles.restaurantsGrid}>
            {pagedRestaurants.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <SafeTranslation
                  tKey="bites.no_results"
                  fallback="暂无符合条件的餐厅"
                />
              </div>
            ) : (
              pagedRestaurants.map((restaurant) => {
                const types = getAccessibilityTypes(restaurant);
                const markerUrl = `https://uri.amap.com/marker?address=${encodeURIComponent(restaurant.address)}&name=${encodeURIComponent(restaurant.name)}`;

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
                          <a
                            aria-label="导航"
                            className="ml-2 px-3 py-1 rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md"
                            href={markerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MapPin className="h-3 w-3" />
                            <SafeTranslation
                              tKey="bites.labels.navigate"
                              fallback="导航"
                            />
                          </a>
                        </div>
                      </div>
                      <div className={styles.detailButtonWrap}>
                        <Link
                          href={`/restaurants/${restaurant.id}`}
                          className={styles.detailButton}
                        >
                          <span>查看详情</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={buildPageHref(currentPage - 1, query, filter)}
                  className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm"
                >
                  上一页
                </Link>
              )}
              {visiblePages.map((page) => (
                <Link
                  key={page}
                  href={buildPageHref(page, query, filter)}
                  aria-current={page === currentPage ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-md border text-sm ${
                    page === currentPage
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}
                >
                  {page}
                </Link>
              ))}
              {currentPage < totalPages && (
                <Link
                  href={buildPageHref(currentPage + 1, query, filter)}
                  className="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm"
                >
                  下一页
                </Link>
              )}
            </div>
          )}

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
      <FoodAIDialog />
    </div>
  );
}
