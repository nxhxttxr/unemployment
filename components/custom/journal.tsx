"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import parse from "html-react-parser";

interface JournalEntry {
  dayNumber: number;
  date: string;
  content: string;
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const [isSectionVisible, setIsSectionVisible] = useState<boolean>(false);
  const journalSectionRef = useRef<HTMLDivElement | null>(null);

  const fetchJournalEntries = useCallback(async (pageNumber: number) => {
    if (loading || !hasMore) return;
    setLoading(true);

    const CACHE_KEY = "portfolio_journal_cache";
    const LAST_FETCH_DATE_KEY = "portfolio_journal_last_date";

    try {
      const todayString = new Date().toISOString().split("T")[0];
      const cachedData = localStorage.getItem(CACHE_KEY);
      const lastFetchDate = localStorage.getItem(LAST_FETCH_DATE_KEY);

      let allEntries: JournalEntry[] = [];

      if (cachedData && lastFetchDate === todayString) {
        allEntries = JSON.parse(cachedData);
      } else {
        const response = await fetch("https://raw.githubusercontent.com/nxhxttxr/data/refs/heads/main/journal.json");
        if (!response.ok) throw new Error("Failed to load journal dataset.");

        allEntries = await response.json();

        localStorage.setItem(CACHE_KEY, JSON.stringify(allEntries));
        localStorage.setItem(LAST_FETCH_DATE_KEY, todayString);

        await new Promise((resolve) => setTimeout(resolve, 400)); // only for fetches/cold requests
      }

      const limit = 15;
      const startIndex = (pageNumber - 1) * limit;
      const endIndex = startIndex + limit;

      const currentBatch = allEntries.slice(startIndex, endIndex);

      if (currentBatch.length === 0 || endIndex >= allEntries.length) {
        setHasMore(false);
      }

      if (currentBatch.length > 0) {
        setEntries((prev) => [...prev, ...currentBatch]);
      }
    } catch (error) {
      console.error("Error reading journal flat file database:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    fetchJournalEntries(1);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSectionVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    if (journalSectionRef.current) observer.observe(journalSectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Inf scroll trigger
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchJournalEntries(nextPage);
        }
      }, {
        rootMargin: "200px", // Pre-fetches entries 200px before the user hits the exact bottom
      });

      if (node) observerRef.current.observe(node);
    }, [loading, hasMore, page, fetchJournalEntries]
  );

  return (
    <div className={`transition-all duration-[1200ms] ease-out ${isSectionVisible ? "opacity-100 scale-100" : "opacity-0 scale-[0.99]"}`} ref={journalSectionRef}>
        <div className="p-6 bg-[#121216]/40 backdrop-blur-md border border-white/[0.04] rounded-2xl shadow-2xl">
          <div className="mb-6">
            <h2 className="tracking-tight font-semibold text-white text-lg">Unemployment Journal</h2>
            <p className="mt-1 text-zinc-500 text-xs">Daily entries, bad humor, lots of reasons to be dissapointed. | All entries are in Greek.</p>
          </div>

          <Accordion className="w-full space-y-2 border-none" type="single" collapsible>
            {entries.map((entry, index) => {
              const isLastItem = index === entries.length - 1;

              return (
                <div ref={isLastItem ? lastElementRef : null} key={entry.dayNumber}>
                  <AccordionItem className="data-[state=open]:bg-white/[0.03] data-[state=open]:border-white/[0.08] px-4 border border-white/[0.03] bg-white/[0.01] transition-all duration-200" value={`day-${entry.dayNumber}`}>
                    <AccordionTrigger className="py-4 text-zinc-300 text-sm cursor-pointer hover:text-white hover:no-underline">
                      <div className="pr-4 w-full flex items-center justify-between">
                        <span className="font-mono font-medium text-white">Day #{entry.dayNumber}</span>
                        <span className="font-normal text-zinc-500 text-xs">{entry.date}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="mt-1 pt-1 pb-4 border-t border-white/[0.03] leading-relaxed text-zinc-400 text-sm whitespace-pre-line [&_a]:text-[#BB99FF] [&_a]:underline">
                      {parse(entry.content)}
                    </AccordionContent>
                  </AccordionItem>
                </div>
              );
            })}
          </Accordion>

          {loading && (
            <div className="pt-6 pb-2 flex items-center justify-center">
              <LuLoaderCircle className="w-5 h-5 text-[#8D51FA] animate-spin" />
            </div>
          )}

          {!hasMore && entries.length > 0 && (
            <p className="mt-8 uppercase tracking-wider font-medium text-center text-[11px] text-zinc-600">End of records.</p>
          )}
        </div>
    </div>
  );
}