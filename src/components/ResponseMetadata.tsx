import React from "react";
import { RecommendResponse } from "@/types/api";

interface ResponseMetadataProps {
  metadata: RecommendResponse["metadata"];
}

export default function ResponseMetadata({ metadata }: ResponseMetadataProps) {
  return (
    <div className="bg-white dark:bg-[#2D2D2D] border-b border-gray-200 dark:border-[#3A3A3A] transition-colors">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
        
        {/* Model Info */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400 font-medium">Model:</span>
          <span className="font-mono text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-[#1A1A1A] px-2 py-0.5 rounded">
            {metadata.model || "Unknown"}
          </span>
        </div>

        {/* Token Usage */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500 dark:text-gray-400">Tokens:</span>
            <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
              {metadata.tokensUsed.total.toLocaleString()}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-gray-400 dark:text-gray-500">
            <span>(In: {metadata.tokensUsed.prompt.toLocaleString()})</span>
            <span>(Out: {metadata.tokensUsed.completion.toLocaleString()})</span>
          </div>
        </div>

        {/* Technical IDs (Collapsible or Tooltip could be better, but simple link for now) */}
        <details className="relative group">
            <summary className="cursor-pointer list-none text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                Details ▾
            </summary>
            <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-white dark:bg-[#1A1A1A] rounded-lg shadow-xl border border-gray-200 dark:border-[#3A3A3A] z-50 text-xs font-mono break-all">
                <div className="mb-2">
                    <span className="block text-gray-500">Trace ID:</span>
                    <span className="text-gray-900 dark:text-gray-100">{metadata.traceId || "N/A"}</span>
                </div>
                <div>
                    <span className="block text-gray-500">Response ID:</span>
                    <span className="text-gray-900 dark:text-gray-100">{metadata.responseId || "N/A"}</span>
                </div>
            </div>
        </details>
      </div>
    </div>
  );
}
