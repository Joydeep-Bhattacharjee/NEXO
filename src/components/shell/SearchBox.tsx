"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Clock, Search, X } from "lucide-react";
import { useAppHydration, useAppStore } from "@/lib/app-store";

const QUERY_MAX = 80;

function searchUrl(q: string): string {
  return q ? `/search?q=${encodeURIComponent(q)}` : "/search";
}

/** The one search box. Typing searches live on /search; Enter saves the query to recent searches. */
export function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const isReady = useAppHydration();
  const recents = useAppStore((s) => s.recentSearches);
  const addRecent = useAppStore((s) => s.addRecentSearch);
  const removeRecent = useAppStore((s) => s.removeRecentSearch);
  const clearRecents = useAppStore((s) => s.clearRecentSearches);
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState(() => params.get("q") ?? "");
  const [isOpen, setIsOpen] = useState(false);

  const isOnSearch = pathname.startsWith("/search");
  const value = isOnSearch ? text : "";
  // On /search the page itself lists recent searches, so the dropdown only shows elsewhere.
  const showRecents = isOpen && isReady && !isOnSearch && !value.trim() && recents.length > 0;

  function go(q: string) {
    const url = searchUrl(q.trim());
    if (isOnSearch) router.replace(url);
    else router.push(url);
  }

  function handleChange(next: string) {
    setText(next);
    go(next);
  }

  function pick(q: string) {
    setText(q);
    addRecent(q);
    go(q);
    setIsOpen(false);
    inputRef.current?.blur();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (value.trim()) addRecent(value);
    go(value);
    setIsOpen(false);
    inputRef.current?.blur();
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="relative min-w-0 flex-1">
      <Search size={18} strokeWidth={1.5} aria-hidden className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        maxLength={QUERY_MAX}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => window.setTimeout(() => setIsOpen(false), 120)}
        onKeyDown={handleKey}
        placeholder="Search games, servers, people"
        aria-label="Search"
        className="h-10 w-full rounded-btn border border-line bg-raised pl-10 pr-3 text-[14px] text-fg outline-none transition-colors placeholder:text-fg-muted hover:border-line-hover focus:border-accent [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => handleChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-[6px] text-fg-muted hover:bg-overlay hover:text-fg cursor-pointer"
        >
          <X size={14} strokeWidth={1.5} aria-hidden />
        </button>
      )}

      {showRecents && (
        <div
          id="recent-searches"
          className="absolute inset-x-0 top-12 z-50 rounded-card border border-line bg-raised p-2 shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between px-2 pb-1 pt-1 text-[12px] text-fg-muted">
            Recent searches
            <button type="button" onClick={clearRecents} className="rounded-[6px] px-1.5 py-0.5 hover:bg-overlay hover:text-fg cursor-pointer">
              Clear all
            </button>
          </div>
          <ul>
            {recents.map((r) => (
              <li key={r} className="group flex items-center rounded-btn hover:bg-overlay">
                <button type="button" onClick={() => pick(r)} className="flex h-10 min-w-0 flex-1 items-center gap-3 px-2 text-left text-[14px] cursor-pointer">
                  <Clock size={16} strokeWidth={1.5} aria-hidden className="shrink-0 text-fg-muted" />
                  <span className="truncate">{r}</span>
                </button>
                <button
                  type="button"
                  onClick={() => removeRecent(r)}
                  aria-label={`Remove ${r} from recent searches`}
                  className="mr-1 flex h-7 w-7 items-center justify-center rounded-[6px] text-fg-muted opacity-60 hover:bg-raised hover:text-fg hover:opacity-100 cursor-pointer"
                >
                  <X size={14} strokeWidth={1.5} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
