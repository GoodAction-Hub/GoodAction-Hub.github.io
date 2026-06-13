import FoodAIDialog from '@/components/FoodAIDialog';
import { Pagination } from '@/components/Pagination';
import { RestaurantNavigationButton } from '@/components/RestaurantNavigationButton';
import SafeTranslation from '@/components/SafeTranslation';
import { fetchBitesCatalog, BitesRestaurant } from '@/lib/bitesCatalog';
import { ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

const PAGE_SIZE = 10;

type FilterType = 'all' | 'hearing' | 'visual' | 'wheelchair' | 'cognitive';

interface RestaurantsPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'hearing', label: '听障友好' },
  { value: 'visual', label: '视障友好' },
  { value: 'wheelchair', label: '轮椅友好' },
  { value: 'cognitive', label: '认知友好' },
];

const single = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const pageNumber = (value: string | undefined) => {
  const page = Number.parseInt(value || '1', 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
};

function getAccessibilityTypes(r: BitesRestaurant): FilterType[] {
  const types: FilterType[] = [];
  if (r.accessibility.deafFriendly) types.push('hearing');
  if (r.accessibility.blindFriendly) types.push('visual');
  const text = r.tags.join(' ');
  if (/轮椅|坡道|无障碍通/.test(text)) types.push('wheelchair');
  if (/认知|自闭|学习障碍/.test(text)) types.push('cognitive');
  return types;
}

function matchesQuery(restaurant: BitesRestaurant, query: string) {
  if (!query) return true;
  const text = [
    restaurant.name,
    restaurant.description,
    restaurant.city,
    restaurant.address,
    restaurant.tags.join(' '),
    restaurant.food?.map((f) => f.name).join(' ') ?? '',
  ]
    .join(' ')
    .toLowerCase();
  return text.includes(query.toLowerCase());
}

export default async function BarrierFreeBitesPage({
  searchParams,
}: RestaurantsPageProps) {
  const params = (await searchParams) ?? {};
  const query = single(params.query)?.trim() ?? '';
  const filter = (single(params.filter)?.trim() || 'all') as FilterType;
  const currentPage = pageNumber(single(params.page));

  const restaurants = (await fetchBitesCatalog()).filter((restaurant) => {
    if (
      filter !== 'all' &&
      !getAccessibilityTypes(restaurant).includes(filter)
    ) {
      return false;
    }
    return matchesQuery(restaurant, query);
  });

  const totalPages = Math.max(1, Math.ceil(restaurants.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageRestaurants = restaurants.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

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

          <form method="GET" className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="search"
                name="query"
                defaultValue={query}
                placeholder="搜索餐厅、城市、地址、特色服务"
                className="w-full rounded-xl border border-gray-200 bg-white px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className={styles.filterSection}>
              {filters.map(({ value, label }) => (
                <label
                  key={value}
                  className={`${styles.filterBtn} ${filter === value ? styles.filterBtnActive : ''}`}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="filter"
                    value={value}
                    defaultChecked={filter === value}
                  />
                  {label}
                </label>
              ))}
              <button type="submit" className={styles.filterBtn}>
                搜索
              </button>
            </div>
          </form>

          <div className={styles.restaurantsGrid}>
            {pageRestaurants.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <SafeTranslation
                  tKey="bites.no_results"
                  fallback="暂无符合条件的餐厅"
                />
              </div>
            ) : (
              pageRestaurants.map((restaurant) => {
                const types = getAccessibilityTypes(restaurant);
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
                          <span className={styles.tag}>听障友好</span>
                        )}
                        {restaurant.accessibility.blindFriendly && (
                          <span className={styles.tag}>视障友好</span>
                        )}
                        {types.includes('wheelchair') && (
                          <span className={styles.tag}>轮椅友好</span>
                        )}
                      </div>
                    </div>
                    <div className={styles.cardBody}>
                      <p className={styles.description}>
                        {restaurant.description}
                      </p>
                      {restaurant.tags.length > 0 && (
                        <div className={styles.features}>
                          <h3 className={styles.featuresTitle}>特色服务</h3>
                          <ul className={styles.featuresList}>
                            {restaurant.tags.map((tag) => (
                              <li key={tag}>{tag}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {restaurant.food && restaurant.food.length > 0 && (
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>美食类型</span>
                          <span>
                            {restaurant.food.map((f) => f.name).join('、')}
                          </span>
                        </div>
                      )}
                      <div className={styles.infoSection}>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>地址</span>
                          <span>{restaurant.address}</span>
                          <RestaurantNavigationButton
                            name={restaurant.name}
                            address={restaurant.address}
                            lat={restaurant.lat}
                            lng={restaurant.lng}
                          />
                        </div>
                      </div>
                      <div className={styles.detailButtonWrap}>
                        <Link
                          href={`/restaurants/${restaurant.id}`}
                          className={styles.detailButton}
                          title="查看详情"
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

          <Pagination
            page={page}
            totalPages={totalPages}
            searchParams={{ query, filter }}
          />

          <div className={styles.aboutSection}>
            <div className={styles.aboutHeader}>
              <span className={styles.aboutIcon} aria-hidden="true">
                🍽️
              </span>
              <h2 className={styles.aboutTitle}>关于无障碍美食</h2>
            </div>
            <div className={styles.aboutContent}>
              <p>
                无障碍美食致力于为残障人士提供平等的用餐体验。我们精选了各地的无障碍友好餐厅，涵盖听障、视障、轮椅使用者和认知障碍人士的需求。
              </p>
              <p>
                每家餐厅都经过实地考察，确保提供真正的无障碍服务。我们希望通过这个平台，让更多人了解和支持无障碍餐饮，共同创造一个更包容的社会。
              </p>
            </div>
          </div>
        </div>
      </div>
      <FoodAIDialog />
    </div>
  );
}
