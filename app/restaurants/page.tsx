import { ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import { headers } from 'next/headers';

import { createI18nStore, loadSSRLanguage } from '@/i18n';
import FoodAIDialog from '@/components/FoodAIDialog';
import { Pager } from '@/components/ui/mobx-restful-shadcn/pager';
import { fetchBitesCatalog, BitesRestaurant } from '@/lib/bitesCatalog';
import { parsePage } from '@/lib/pagination';
import styles from './page.module.css';

type FilterType = 'all' | 'hearing' | 'visual' | 'wheelchair' | 'cognitive';
const FILTER_OPTIONS = [
  'all',
  'hearing',
  'visual',
  'wheelchair',
  'cognitive',
] as const satisfies readonly FilterType[];

const PAGE_SIZE = 10;

type PageSearchParams = Promise<{
  page?: string;
  query?: string;
  filter?: string;
}>;

function getAccessibilityTypes(r: BitesRestaurant): FilterType[] {
  const types: FilterType[] = [];
  if (r.accessibility.deafFriendly) types.push('hearing');
  if (r.accessibility.blindFriendly) types.push('visual');
  const text = r.tags.join(' ');
  if (/轮椅|坡道|无障碍通/.test(text)) types.push('wheelchair');
  if (/认知|自闭|学习障碍/.test(text)) types.push('cognitive');
  return types;
}

function buildFilterHref(nextFilter: FilterType, query: string): string {
  const params = new URLSearchParams();
  if (query) params.set('query', query);
  if (nextFilter !== 'all') params.set('filter', nextFilter);
  const queryString = params.toString();
  return queryString ? `/restaurants?${queryString}` : '/restaurants';
}

const isFilterType = (value: string): value is FilterType =>
  FILTER_OPTIONS.includes(value as FilterType);

function parseFilter(rawFilter?: string): FilterType {
  const normalized = rawFilter?.trim().toLowerCase();
  return normalized && isFilterType(normalized) ? normalized : 'all';
}

export default async function BarrierFreeBitesPage({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const rawSearchParams = await searchParams;
  const { page: rawPage, query: rawQuery, filter: rawFilter } = rawSearchParams;
  const query = rawQuery?.trim() ?? '';
  const filter = parseFilter(rawFilter);
  const headerStore = await headers();
  const { language, languageMap } = await loadSSRLanguage({
    cookie: headerStore.get('cookie') ?? '',
    acceptLanguage: headerStore.get('accept-language') ?? '',
    query: rawSearchParams,
  });
  const { t } = createI18nStore(language, languageMap);

  const restaurants = await fetchBitesCatalog();

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesFilter =
      filter === 'all' || getAccessibilityTypes(restaurant).includes(filter);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <header className={styles.header}>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent mb-3">
              🌟 {t('restaurants_list_text_title')}
            </h1>
            <p className={styles.subtitle}>
              {t('restaurants_list_text_subtitle')}
            </p>
            <div className="mt-4 flex justify-center">
              <a
                href="https://github.com/GoodAction-Hub/GoodAction-data/issues/new?template=restaurant.yml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm font-medium"
              >
                {t('restaurants_list_text_publish_restaurant')}
              </a>
            </div>
          </header>

          <form action="/restaurants" method="get" className="mb-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                name="query"
                defaultValue={query}
                placeholder={t('restaurants_list_text_search_placeholder')}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
              />
              {filter !== 'all' && (
                <input type="hidden" name="filter" value={filter} />
              )}
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium"
              >
                {t('restaurants_list_text_search_button')}
              </button>
            </div>
          </form>

          <div className={styles.filterSection}>
            {FILTER_OPTIONS.map((item) => (
              <Link
                key={item}
                href={buildFilterHref(item, query)}
                className={`${styles.filterBtn} ${filter === item ? styles.filterBtnActive : ''}`}
              >
                {t(`restaurants_list_text_filters_${item}`)}
              </Link>
            ))}
          </div>

          <div className={styles.restaurantsGrid}>
            {pagedRestaurants.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {t('restaurants_list_text_no_results')}
              </div>
            ) : (
              pagedRestaurants.map((restaurant) => {
                const types = getAccessibilityTypes(restaurant);
                const { address, name } = restaurant;
                const markerUrl = `https://uri.amap.com/marker?${new URLSearchParams({ address, name })}`;

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
                            {t('restaurants_list_text_tags_hearing')}
                          </span>
                        )}
                        {restaurant.accessibility.blindFriendly && (
                          <span className={styles.tag}>
                            <span className={styles.icon}>👁️</span>
                            {t('restaurants_list_text_tags_visual')}
                          </span>
                        )}
                        {types.includes('wheelchair') && (
                          <span className={styles.tag}>
                            <span className={styles.icon}>♿</span>
                            {t('restaurants_list_text_tags_wheelchair')}
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
                            {t('restaurants_list_text_labels_features')}
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
                            {t('restaurants_list_text_labels_food')}
                          </span>
                          <span>
                            {restaurant.food.map((f) => f.name).join('、')}
                          </span>
                        </div>
                      )}
                      <div className={styles.infoSection}>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>
                            {t('restaurants_list_text_labels_address')}
                          </span>
                          <span>{restaurant.address}</span>
                          <a
                            aria-label={t(
                              'restaurants_list_text_labels_navigate',
                            )}
                            className="ml-2 px-3 py-1 rounded-md text-white bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 hover:brightness-110 text-xs align-middle transition-all duration-200 flex items-center gap-1 shadow-sm hover:shadow-md"
                            href={markerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MapPin className="h-3 w-3" />
                            {t('restaurants_list_text_labels_navigate')}
                          </a>
                        </div>
                      </div>
                      <div className={styles.detailButtonWrap}>
                        <Link
                          href={`/restaurants/${restaurant.id}`}
                          className={styles.detailButton}
                          title={t('restaurants_list_text_view_details_title')}
                        >
                          <span>{t('restaurants_list_text_view_details')}</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <Pager
            pageSize={PAGE_SIZE}
            pageIndex={currentPage}
            pageCount={totalPages}
          />

          <div className={styles.aboutSection}>
            <div className={styles.aboutHeader}>
              <span className={styles.aboutIcon} aria-hidden="true">
                🍽️
              </span>
              <h2 className={styles.aboutTitle}>
                {t('restaurants_list_text_about_title')}
              </h2>
            </div>
            <div className={styles.aboutContent}>
              <p>{t('restaurants_list_text_about_p1')}</p>
              <p>{t('restaurants_list_text_about_p2')}</p>
            </div>
          </div>
        </div>
      </div>
      <FoodAIDialog />
    </div>
  );
}
