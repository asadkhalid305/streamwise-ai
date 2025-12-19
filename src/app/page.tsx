"use client";

import { useState } from "react";
import type { RecommendResponse, RecommendItem } from "@/types/api";
import MovieCard from "@/components/MovieCard";
import { CornerDownLeft, Loader } from "lucide-react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<RecommendResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setResponse(data);
      setMessage("");
    } catch (err) {
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !loading) {
        handleSubmit(e as any);
      }
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#202020] py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Movie & Show Picker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tell us what you&apos;re looking for, and we&apos;ll recommend
            something great.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-white dark:bg-[#2D2D2D] rounded-xl border border-gray-200 dark:border-[#3A3A3A] p-6 transition-colors">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
            >
              What are you in the mood for?
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 dark:focus:ring-white focus:border-gray-800 dark:focus:border-white text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              placeholder="E.g., I have a 1 hour flight, want something light and funny... (Press Enter to submit)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="mt-4 w-full bg-gray-800 dark:bg-white text-white dark:text-black py-3 px-4 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 disabled:bg-gray-400 dark:disabled:bg-gray-600 dark:disabled:text-white disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  Recommending
                  <Loader size={16} className="opacity-70" />
                </>
              ) : (
                <>
                  Recommend
                  <CornerDownLeft size={16} className="opacity-70" />
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl p-4 mb-8">
            <p className="text-red-800 dark:text-red-400">{error}</p>
          </div>
        )}

        {response && (
          <div className="space-y-6">
            {/* User Query Card */}
            <div className="bg-white dark:bg-[#2D2D2D] rounded-xl border border-gray-200 dark:border-[#3A3A3A] p-6 transition-colors">
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  You asked:
                </span>
              </p>
              <p className="text-lg text-gray-900 dark:text-gray-100 mt-2 italic">
                &quot;{response.userQuery}&quot;
              </p>
            </div>

            {/* Show recommendations as cards if items exist */}
            {response.items && response.items.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-gray-600 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Recommendations
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {response.items.map((item: RecommendItem, index: number) => (
                    <MovieCard key={index} item={item} index={index} />
                  ))}
                </div>
              </div>
            ) : (
              /* Show plain text response if no items */
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Response
                </h2>
                <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-lg p-6 border border-gray-200 dark:border-[#3A3A3A]">
                  <p className="text-lg text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                    {response.message}
                  </p>
                </div>
              </div>
            )}

            {/* Metadata Card */}
            <div className="bg-white dark:bg-[#2D2D2D] rounded-xl border border-gray-200 dark:border-[#3A3A3A] p-6 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Response Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-lg p-4 border border-gray-200 dark:border-[#3A3A3A]">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    AI Model
                  </div>
                  <div className="text-sm font-mono text-gray-900 dark:text-gray-100">
                    {response.metadata.model ||
                      process.env.NEXT_PUBLIC_DEFAULT_MODEL ||
                      "N/A"}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-lg p-4 border border-gray-200 dark:border-[#3A3A3A]">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Tokens Used
                  </div>
                  <div className="text-sm text-gray-900 dark:text-gray-100">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Input:
                      </span>
                      <span className="font-mono">
                        {response.metadata.tokensUsed.prompt.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Output:
                      </span>
                      <span className="font-mono">
                        {response.metadata.tokensUsed.completion.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 mt-1 border-t border-gray-200 dark:border-gray-600">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        Total:
                      </span>
                      <span className="font-mono font-semibold">
                        {response.metadata.tokensUsed.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 select-none">
                  Technical Details
                </summary>
                <div className="mt-3 space-y-2 text-xs font-mono bg-gray-50 dark:bg-[#1A1A1A] rounded-lg p-3 border border-gray-200 dark:border-[#3A3A3A]">
                  <div className="flex flex-wrap gap-x-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      Response ID:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100 break-all">
                      {response.metadata.responseId || "N/A"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <span className="text-gray-500 dark:text-gray-400">
                      Trace ID:
                    </span>
                    <span className="text-gray-900 dark:text-gray-100 break-all">
                      {response.metadata.traceId || "N/A"}
                    </span>
                  </div>
                </div>
              </details>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
