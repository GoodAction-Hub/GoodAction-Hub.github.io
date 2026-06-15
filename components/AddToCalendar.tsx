'use client';

import { fileSave } from 'browser-fs-access';
import { google, outlook, yahoo } from 'calendar-link';
import {
  Apple,
  Calendar,
  CalendarDays,
  CalendarRange,
  Mail,
} from 'lucide-react';
import { DateTime } from 'luxon';
import { observer } from 'mobx-react';
import { type MouseEvent, useContext } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { I18nContext } from '@/i18n/context';
import { createICalendarEvent } from '@/lib/calendar';

interface AddToCalendarProps {
  title: string;
  description?: string;
  location?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  timeZone: string; // e.g. "Asia/Shanghai"
}

export const AddToCalendar = observer(
  ({
    title,
    description,
    location,
    startDate,
    endDate,
    startTime,
    endTime,
    timeZone,
  }: AddToCalendarProps) => {
    // 组合 ISO 格式时间
    const startLuxon = DateTime.fromISO(
      `${startDate}T${startTime ?? '00:00'}`,
      {
        zone: timeZone,
      },
    );
    const endLuxon = DateTime.fromISO(`${endDate}T${endTime ?? '23:59'}`, {
      zone: timeZone,
    });

    // For Google/Outlook/Yahoo (ISO format)
    const calendarEvent = {
      title,
      description,
      location,
      start: startLuxon.toISO(),
      end: endLuxon.toISO(),
    };

    const handleDownloadICS = async (
      mouseEvent: MouseEvent<HTMLDivElement>,
    ) => {
      mouseEvent.preventDefault();
      mouseEvent.stopPropagation();
      const icsContent = createICalendarEvent({
        title,
        description,
        location,
        start: startLuxon,
        end: endLuxon,
      });
      const blob = new Blob([icsContent], {
        type: 'text/calendar;charset=utf-8',
      });

      await fileSave(blob, {
        fileName: `${title}_${startDate}.ics`,
        description: 'iCalendar file',
        extensions: ['.ics'],
      });
    };
    const { t } = useContext(I18nContext);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('calendar.title')}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <a
              href={google(calendarEvent)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <CalendarDays className="h-4 w-4" /> {t('calendar.google')}
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={outlook(calendarEvent)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" /> {t('calendar.outlook')}
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={yahoo(calendarEvent)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <CalendarRange className="h-4 w-4" /> {t('calendar.yahoo')}
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDownloadICS}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Apple className="h-4 w-4" /> {t('calendar.apple')} (
            {t('calendar.download')})
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);
