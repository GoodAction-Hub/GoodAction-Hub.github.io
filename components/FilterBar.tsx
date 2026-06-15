'use client';

import { Search } from 'lucide-react';
import { observer } from 'mobx-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

import { I18nContext } from '@/i18n/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TimezoneSelector } from './TimezoneSelector';

const DEFAULT_TIMEZONE = 'Asia/Shanghai';

const ACTIVITY_CATEGORIES = ['conference', 'competition', 'activity'] as const;

type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

interface FilterBarProps {
  keywords: string;
  selectedCategory: ActivityCategory | null;
  selectedTags: string[];
  allTags: string[];
  timezone: string;
}

export const FilterBar = observer(function FilterBar({
  keywords,
  selectedCategory,
  selectedTags,
  allTags,
  timezone,
}: FilterBarProps) {
  const { t } = useContext(I18nContext);
  const router = useRouter();
  const [selectedTimezone, setSelectedTimezone] = useState(timezone);

  useEffect(() => setSelectedTimezone(timezone), [timezone]);

  const buildHref = ({
    nextKeywords = keywords,
    nextCategory = selectedCategory,
    nextTags = selectedTags,
    nextTimezone = selectedTimezone,
  }: {
    nextKeywords?: string;
    nextCategory?: ActivityCategory | null;
    nextTags?: string[];
    nextTimezone?: string;
  } = {}) => {
    const params = new URLSearchParams();

    if (nextKeywords) params.set('keywords', nextKeywords);
    if (nextCategory) params.set('category', nextCategory);
    for (const tag of nextTags) params.append('tag', tag);
    if (nextTimezone && nextTimezone !== DEFAULT_TIMEZONE)
      params.set('timezone', nextTimezone);

    return params.size > 0 ? `/activities?${params}` : '/activities';
  };

  return (
    <div className="space-y-5">
      <form action="/activities" method="get" className="space-y-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-blue-400 focus-within:border-blue-500 transition-all duration-300 hover:shadow-xl focus-within:shadow-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-6 h-6 group-hover:text-blue-500 group-focus-within:text-blue-600 transition-colors duration-300" />
            <Input
              type="text"
              name="keywords"
              defaultValue={keywords}
              placeholder={t('activities_list_text_search_placeholder')}
              className="pl-14 pr-6 py-3 sm:py-4 text-base sm:text-xl md:text-2xl font-medium bg-transparent border-0 rounded-xl placeholder:text-base sm:placeholder:text-xl md:placeholder:text-2xl placeholder:text-gray-400 focus:ring-0 focus:outline-none h-12 sm:h-14 md:h-16 text-gray-800"
            />
            {selectedCategory && (
              <input type="hidden" name="category" value={selectedCategory} />
            )}
            {selectedTags.map((tag) => (
              <input key={tag} type="hidden" name="tag" value={tag} />
            ))}
            {selectedTimezone !== DEFAULT_TIMEZONE && (
              <input type="hidden" name="timezone" value={selectedTimezone} />
            )}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" className="rounded-xl">
              {t('activities_list_text_search_button')}
            </Button>
            <Button variant="outline" className="rounded-xl" asChild>
              <Link
                href={buildHref({
                  nextKeywords: '',
                  nextCategory: null,
                  nextTags: [],
                })}
              >
                {t('activities_list_text_filter_reset')}
              </Link>
            </Button>
          </div>

          <TimezoneSelector
            timezone={selectedTimezone}
            onChange={(nextTimezone) => {
              setSelectedTimezone(nextTimezone);
              router.push(buildHref({ nextTimezone }));
            }}
          />
        </div>
      </form>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">
          {t('activities_list_text_filter_category')}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href={buildHref({ nextCategory: null })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              !selectedCategory
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('activities_list_text_filter_all')}
          </Link>
          {ACTIVITY_CATEGORIES.map((category) => (
            <Link
              key={category}
              href={buildHref({
                nextCategory: selectedCategory === category ? null : category,
              })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t(`activities_detail_text_category_${category}`)}
            </Link>
          ))}
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">
            {t('activities_list_text_filter_tags')}
          </h2>
          <div className="flex flex-wrap gap-2 max-h-36 overflow-auto pr-1">
            {allTags.map((tag) => {
              const active = selectedTags.includes(tag);
              const nextTags = active
                ? selectedTags.filter((value) => value !== tag)
                : [...selectedTags, tag];

              return (
                <Link
                  key={tag}
                  href={buildHref({ nextTags })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    active
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tag}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});
