import { Aggregation } from '@/components/Aggregation';
import { loadSSRI18nFromRequest } from '@/i18n/server';

export default async function OriginPage() {
  const { t } = await loadSSRI18nFromRequest();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900/40 to-slate-200/10
             bg-[url('/bg.jpg')] bg-cover bg-center"
    >
      <div className="w-full max-w-4xl px-6 py-24 flex flex-col items-center">
        <header className="text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight tracking-tighter">
            GOODACTION HUB
          </h1>
          <div className="mt-3 text-2xl md:text-3xl text-white/90">益 行</div>
        </header>

        <Aggregation
          searchLabel={t('home.search.label')}
          searchPlaceholder={t('ui_text.search_placeholder')}
          searchAriaLabel={t('home.search.aria')}
        />
        <footer className="mt-14 text-center max-w-2xl">
          <p className="text-white/80 text-base md:text-lg italic">
            GoodAction Hub helps you discover the world&apos;s best free
            opportunities — powered by AI, open to all.
          </p>
        </footer>
      </div>
    </div>
  );
}
