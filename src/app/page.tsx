"use client";

import { useState, useEffect, useRef } from "react";
import type { RecommendResponse, RecommendItem } from "@/types/api";
import MovieCard from "@/components/MovieCard";
import ApiKeyModal from "@/components/ApiKeyModal";
import ResponseMetadata from "@/components/ResponseMetadata";
import { useApiKey } from "@/contexts/ApiKeyContext";
import { CornerDownLeft, Loader, Key as KeyIcon, ChevronDown, X } from "lucide-react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [response, setResponse] = useState<RecommendResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { apiKey, setApiKey, hasApiKey, clearApiKey } = useApiKey();

  // Check if API key is needed (not in session storage)
  useEffect(() => {
    if (!hasApiKey) {
      setShowModal(true);
    }
  }, [hasApiKey]);

  // Scroll to results when response arrives
  useEffect(() => {
    if (response && resultsRef.current) {
      // Small timeout to allow render
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [response]);

  const handleModalSubmit = (key: string) => {
    setApiKey(key);
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasApiKey) {
      setShowModal(true);
      setError("Please provide your OpenAI API key to use this application.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);
    setVisibleCount(6); // Reset pagination

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Add API key to headers if available from client
      if (apiKey) {
        headers["x-openai-api-key"] = apiKey;
      }

      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
      const res = await fetch(`${basePath}/api/recommend`, {
        method: "POST",
        headers,
        body: JSON.stringify({ message }),
      });

      // Check content type to safely handle non-JSON errors (e.g. 404 HTML pages)
      const contentType = res.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Server returned ${res.status} ${res.statusText}: ${text.substring(0, 100)}...`);
      }

      if (!res.ok) {
        if (res.status === 401) {
          setShowModal(true);
          setError(
            "Please provide your OpenAI API key to use this application."
          );
        } else {
          setError(data.error || "Something went wrong");
        }
        return;
      }

      setResponse(data);
    } catch (err: any) {
      console.error("API Request Failed:", err);
      setError(err.message || "Failed to get recommendations");
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

  const handleClear = () => {
    setMessage("");
    // We don't clear response immediately so user can see what they had
  };

  const handleChangeApiKey = () => {
    setShowModal(true);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#202020] transition-colors flex flex-col">
      {/* Sticky Metadata Header */}
      {response && (
        <div className="sticky top-0 z-10 shadow-sm">
          <ResponseMetadata metadata={response.metadata} />
        </div>
      )}

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <ApiKeyModal
          isOpen={showModal}
          canClose={hasApiKey}
          existingKey={apiKey || ""}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src="/logo.svg" alt="Logo" className="w-16 h-16" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              StreamWise
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tell us what you&apos;re looking for, and we&apos;ll recommend
              something great.
            </p>
            {hasApiKey && (
              <button
                onClick={handleChangeApiKey}
                className="mt-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors inline-flex items-center gap-1"
              >
                <KeyIcon size={14} />
                Change API Key
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="bg-white dark:bg-[#2D2D2D] rounded-xl border border-gray-200 dark:border-[#3A3A3A] p-6 transition-colors shadow-sm">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
              >
                What are you in the mood for?
              </label>
              <div className="relative">
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 dark:focus:ring-white focus:border-gray-800 dark:focus:border-white text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors pr-10"
                  placeholder="E.g., I have a 1 hour flight, want something light and funny... (Press Enter to submit)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                />
                {message && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
                    title="Clear input"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="mt-4 w-full bg-gray-800 dark:bg-white text-white dark:text-black py-3 px-4 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 disabled:bg-gray-400 dark:disabled:bg-gray-600 dark:disabled:text-white disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    Recommending
                    <Loader size={16} className="opacity-70 animate-spin" />
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
            <div ref={resultsRef} className="space-y-6 scroll-mt-24">
              {/* User Query Card */}
              <div className="bg-white dark:bg-[#2D2D2D] rounded-xl border border-gray-200 dark:border-[#3A3A3A] p-6 transition-colors shadow-sm">
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
                    {response.items.slice(0, visibleCount).map((item: RecommendItem, index: number) => (
                      <MovieCard key={index} item={item} index={index} />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {visibleCount < response.items.length && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={handleLoadMore}
                        className="bg-white dark:bg-[#2D2D2D] text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-[#3A3A3A] py-2 px-6 rounded-full hover:bg-gray-50 dark:hover:bg-[#363636] transition-colors font-medium inline-flex items-center gap-2 shadow-sm"
                      >
                        Load More Recommendations
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  )}
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
}