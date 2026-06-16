'use client';

import { DateTime } from 'luxon';
import { observer } from 'mobx-react';
import { type FC, useContext, useEffect, useState } from 'react';

import { I18nContext } from '@/i18n/context';
import { useEventStore } from '@/lib/store';

interface CountdownTimerProps {
  deadline: DateTime;
  displayTimezone?: string;
}

export const CountdownTimer: FC<CountdownTimerProps> = observer(
  ({ deadline, displayTimezone }) => {
    const [timeLeft, setTimeLeft] = useState<Record<
      'days' | 'hours' | 'minutes' | 'seconds',
      number
    > | null>(null);
    const { t } = useContext(I18nContext);

    // 从全局状态获取显示时区
    const displayTimezoneFromStore = useEventStore(
      (state) => state.displayTimezone,
    );
    const currentTimezone = displayTimezone ?? displayTimezoneFromStore;

    useEffect(() => {
      const calculateTimeLeft = () => {
        const now = DateTime.now().setZone(currentTimezone);
        const targetDeadline = deadline.setZone(currentTimezone);
        const difference = targetDeadline.toMillis() - now.toMillis();

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60),
          );
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          setTimeLeft({ days, hours, minutes, seconds });
        } else {
          setTimeLeft(null);
        }
      };

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);

      return () => clearInterval(timer);
    }, [currentTimezone, deadline]);

    if (!timeLeft)
      return (
        <div className="text-sm font-bold text-red-600 bg-red-100 px-3 py-2 rounded-lg">
          {t('events.outdated')}
        </div>
      );

    return (
      <div className="flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap">
        {timeLeft.days > 0 && (
          <div className="text-center">
            <div className="bg-gradient-to-b from-orange-500 to-orange-600 text-white px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-lg font-bold text-sm sm:text-base min-w-[35px] sm:min-w-[40px] shadow-md">
              {timeLeft.days.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-orange-700 mt-1 font-medium">
              {t('date.days')}
            </div>
          </div>
        )}
        <div className="text-center">
          <div className="bg-gradient-to-b from-orange-500 to-orange-600 text-white px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-lg font-bold text-sm sm:text-base min-w-[35px] sm:min-w-[40px] shadow-md">
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-orange-700 mt-1 font-medium">
            {t('date.hours')}
          </div>
        </div>
        <div className="text-center">
          <div className="bg-gradient-to-b from-orange-500 to-orange-600 text-white px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-lg font-bold text-sm sm:text-base min-w-[35px] sm:min-w-[40px] shadow-md">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-orange-700 mt-1 font-medium">
            {t('date.minutes')}
          </div>
        </div>
        <div className="text-center">
          <div className="bg-gradient-to-b from-orange-500 to-orange-600 text-white px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-lg font-bold text-sm sm:text-base min-w-[35px] sm:min-w-[40px] shadow-md countdown-pulse">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-orange-700 mt-1 font-medium">
            {t('date.seconds')}
          </div>
        </div>
      </div>
    );
  },
);
