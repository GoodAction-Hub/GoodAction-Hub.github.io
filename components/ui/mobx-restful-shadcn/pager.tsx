'use client';

import { MoreHorizontal } from 'lucide-react';
import { observer } from 'mobx-react';
import { ListModel } from 'mobx-restful';
import { MouseEvent, useContext } from 'react';
import { buildURLData, parseURLData } from 'web-utility';

import { I18nContext } from '@/i18n/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type PageMeta = Pick<
  ListModel<Record<string, unknown>>,
  'pageSize' | 'pageIndex'
>;

export interface PagerProps extends PageMeta {
  pageCount: number;
  onChange?: (meta: PageMeta) => void;
}

export const Pager = observer(function Pager({
  pageSize,
  pageIndex,
  pageCount,
  onChange,
}: PagerProps) {
  const i18n = useContext(I18nContext);
  const t = (key: string) => i18n.t(key) ?? key;

  function propsOf(pageIndex = 1) {
    const pagination = { pageSize, pageIndex };

    return {
      href: `?${buildURLData({ ...parseURLData(), ...pagination })}`,
      onClick:
        onChange &&
        ((event: MouseEvent<HTMLAnchorElement>) => {
          event.preventDefault();

          onChange(pagination);
        }),
    };
  }

  return (
    <form
      className="m-0 flex items-center gap-2"
      onSubmit={
        onChange &&
        ((event) => {
          event.preventDefault();
          event.stopPropagation();
        })
      }
    >
      <Input
        className="w-20"
        type="number"
        name="pageSize"
        defaultValue={pageSize}
        min={1}
        required
        onChange={({ currentTarget: input }) =>
          input.reportValidity() &&
          onChange?.({ pageSize: +input.value, pageIndex })
        }
      />
      <span className="text-sm text-muted-foreground">×</span>
      <Input
        className="w-20"
        type="number"
        name="pageIndex"
        defaultValue={pageIndex || 1}
        min={1}
        max={pageCount}
        required
        onChange={({ currentTarget: input }) =>
          input.reportValidity() &&
          onChange?.({ pageSize, pageIndex: +input.value })
        }
      />
      <nav className="flex items-center gap-1">
        {pageIndex > 1 && (
          <Button variant="outline" size="sm" asChild>
            <a
              {...propsOf(1)}
              title={t('pagination.first')}
              aria-label={t('pagination.first')}
            >
              1
            </a>
          </Button>
        )}
        {pageIndex > 3 && (
          <Button variant="ghost" size="sm" disabled>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
        {pageIndex > 2 && (
          <Button variant="outline" size="sm" asChild>
            <a
              {...propsOf(pageIndex - 1)}
              title={t('pagination.previous')}
              aria-label={t('pagination.previous')}
            >
              {pageIndex - 1}
            </a>
          </Button>
        )}
        <Button variant="default" size="sm" disabled>
          {pageIndex}
        </Button>
        {pageCount - pageIndex > 1 && (
          <Button variant="outline" size="sm" asChild>
            <a
              {...propsOf(pageIndex + 1)}
              title={t('pagination.next')}
              aria-label={t('pagination.next')}
            >
              {pageIndex + 1}
            </a>
          </Button>
        )}
        {pageCount - pageIndex > 2 && (
          <Button variant="ghost" size="sm" disabled>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
        {pageIndex < pageCount && (
          <Button variant="outline" size="sm" asChild>
            <a
              {...propsOf(pageCount)}
              title={t('pagination.last')}
              aria-label={t('pagination.last')}
            >
              {pageCount}
            </a>
          </Button>
        )}
      </nav>
    </form>
  );
});
