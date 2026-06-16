import { Search } from 'lucide-react';
import type { FC } from 'react';

type AggregationProps = Record<
  'searchLabel' | 'searchPlaceholder' | 'searchAriaLabel',
  string
>;

export const Aggregation: FC<AggregationProps> = ({
  searchLabel,
  searchPlaceholder,
  searchAriaLabel,
}) => (
  <form className="w-full" action="/recommend">
    {/* Search bar — large, rounded, translucent */}
    <div className="mt-50 w-full bg-black/40 backdrop-blur-md rounded-full px-4 py-3 shadow-2xl flex items-center">
      {/* Left label */}
      <div className="flex items-center gap-3 pl-3">
        <span className="text-white/90 text-lg md:text-xl">{searchLabel}</span>
      </div>

      {/* Input field */}
      <input
        type="text"
        name="keywords"
        placeholder={searchPlaceholder}
        className="flex-1 bg-transparent placeholder-white/60 text-white text-lg md:text-xl outline-none px-6"
      />
      {/* Submit button */}
      <button
        type="submit"
        aria-label={searchAriaLabel}
        className="ml-4 rounded-full bg-white/20 hover:bg-white/30 p-3 flex items-center justify-center transition-colors"
      >
        <Search className="w-5 h-5 text-white" />
      </button>
    </div>
  </form>
);
