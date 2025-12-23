import type { RecommendItem } from "@/types/api";

interface MovieCardProps {
  item: RecommendItem;
  index: number;
}

export default function MovieCard({ item, index }: MovieCardProps) {
  const isMovie = item.type === "movie";

  return (
    <div className="bg-white dark:bg-[#2D2D2D] rounded-xl border border-gray-200 dark:border-[#3A3A3A] overflow-hidden hover:shadow-lg dark:hover:shadow-lg/20 transition-all hover:border-gray-300 dark:hover:border-[#4A4A4A]">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-[#3A3A3A] dark:to-[#2D2D2D] px-6 py-4 border-b border-gray-200 dark:border-[#3A3A3A]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-[#404040] text-sm font-bold text-gray-700 dark:text-gray-300">
                {item.rank || index + 1}
              </span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                {item.name}
              </h3>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1A1A1A] whitespace-nowrap">
              {isMovie ? "🎬 Movie" : "📺 Show"}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Why matched */}
        <div>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
            Why This Match?
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {item.why}
          </p>
        </div>

        {/* Duration Info */}
        <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-lg p-4 border border-gray-200 dark:border-[#3A3A3A]">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium">
              {isMovie
                ? `${item.durationMinutes} minutes`
                : `${item.episodeDurationMinutes} min per episode`}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-[#3A3A3A]">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Recommendation #{index + 1}
          </div>
        </div>
      </div>
    </div>
  );
}
