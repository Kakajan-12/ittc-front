"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CarouselBreakpoint = { min: number; slides: number };

// How many cards fit on one row at each min-width. Ordered high → low.
export const DEFAULT_BREAKPOINTS: CarouselBreakpoint[] = [
  { min: 1536, slides: 5 },
  { min: 1280, slides: 4 },
  { min: 1024, slides: 3 },
  { min: 640, slides: 2 },
  { min: 0, slides: 1 },
];

function resolveSlides(width: number, breakpoints: CarouselBreakpoint[]) {
  return (
    breakpoints.find((b) => width >= b.min)?.slides ??
    breakpoints[breakpoints.length - 1]?.slides ??
    1
  );
}

/**
 * Drives a single-row, horizontally-scrolling carousel: the cards never wrap,
 * and page dots are meaningful only when `pageCount > 1` (i.e. the cards don't
 * all fit at the current width).
 */
export function useCarousel(
  itemCount: number,
  breakpoints: CarouselBreakpoint[] = DEFAULT_BREAKPOINTS,
) {
  const trackRef = useRef<HTMLDivElement>(null);
  const breakpointsRef = useRef(breakpoints);
  breakpointsRef.current = breakpoints;

  const [slidesPerView, setSlidesPerView] = useState(1);
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    const update = () =>
      setSlidesPerView(resolveSlides(window.innerWidth, breakpointsRef.current));
    update();
    const handleResize = () => {
      update();
      trackRef.current?.scrollTo({ left: 0 });
      setActivePage(0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pageCount = Math.max(1, Math.ceil(itemCount / slidesPerView));
  const currentPage = Math.min(activePage, pageCount - 1);

  const goToPage = useCallback((page: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: page * track.clientWidth, behavior: "smooth" });
  }, []);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setActivePage(Math.round(track.scrollLeft / track.clientWidth));
  }, []);

  return {
    trackRef,
    slidesPerView,
    pageCount,
    currentPage,
    goToPage,
    handleScroll,
  };
}
