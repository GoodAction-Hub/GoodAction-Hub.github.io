'use client';

import { Globe } from 'lucide-react';
import { observer } from 'mobx-react';
import { type FC, useContext, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { I18nContext } from '@/i18n/context';
import { useEventStore } from '@/lib/store';
import { detectCurrentTimezone, loadSupportedTimezones } from '@/lib/timezone';

interface TimezoneSelectorProps {
  timezone?: string;
  onChange?: (timezone: string) => void;
}

const filterTimezones = (timezones: string[], keyword: string) =>
  keyword
    ? timezones.filter((timezone) =>
        timezone.toLowerCase().includes(keyword.toLowerCase()),
      )
    : timezones;

export const TimezoneSelector: FC<TimezoneSelectorProps> = observer(
  ({ timezone, onChange }) => {
    const displayTimezone = useEventStore((state) => state.displayTimezone);
    const setDisplayTimezone = useEventStore(
      (state) => state.setDisplayTimezone,
    );
    const detectUserTimezone = useEventStore(
      (state) => state.detectUserTimezone,
    );
    const { t } = useContext(I18nContext);
    const currentTimezone = timezone ?? displayTimezone;

    // 时区选择器相关状态
    const [timezones, setTimezones] = useState<string[]>([]);
    const [searchTimeZone, setSearchTimeZone] = useState('');
    const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);

    useEffect(() => {
      const controller = new AbortController();

      loadSupportedTimezones(controller.signal).then((loadedTimezones) => {
        if (!controller.signal.aborted) setTimezones(loadedTimezones);
      });

      return () => controller.abort();
    }, []);

    // 点击外部关闭下拉菜单
    useEffect(() => {
      if (showTimezoneDropdown) {
        const handleClickOutside = (event: MouseEvent) => {
          const target = event.target as HTMLElement;
          if (!target.closest('.timezone-selector-container')) {
            setShowTimezoneDropdown(false);
          }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
          document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [showTimezoneDropdown]);

    // 根据搜索过滤时区
    const filteredTimezones = filterTimezones(timezones, searchTimeZone);

    return (
      <div className="relative timezone-selector-container">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-sm"
              onClick={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
            >
              <Globe className="w-4 h-4" />
              <span>{currentTimezone}</span>
            </Button>

            {showTimezoneDropdown && (
              <div className="absolute z-50 mt-1 bg-white border rounded-md shadow-lg w-80 max-h-80 overflow-y-auto">
                <div className="p-2">
                  <Input
                    type="text"
                    placeholder={t('filter.searchTimezone')}
                    value={searchTimeZone}
                    onChange={({ target }) => setSearchTimeZone(target.value)}
                    className="mb-2"
                  />
                  <div className="grid gap-1">
                    {filteredTimezones.map((tz) => (
                      <div
                        key={tz}
                        className={`px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 ${
                          currentTimezone === tz
                            ? 'bg-primary/10 font-medium'
                            : ''
                        }`}
                        onClick={() => {
                          if (onChange) onChange(tz);
                          else setDisplayTimezone(tz);
                          setShowTimezoneDropdown(false);
                        }}
                      >
                        {tz}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (onChange) onChange(detectCurrentTimezone());
              else detectUserTimezone();

              setShowTimezoneDropdown(false);
            }}
            className="whitespace-nowrap"
          >
            {t('filter.autoDetect')}
          </Button>
        </div>
      </div>
    );
  },
);
