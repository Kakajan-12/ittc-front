"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function Scrollbar({
  targetRef,
  className,
}: {
  targetRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; scroll: number; track: number } | null>(
    null,
  );
  const [thumb, setThumb] = useState({ width: 0, left: 0, visible: false });

  const update = useCallback(() => {
    const el = targetRef.current;
    if (!el) return;
    const { scrollWidth, clientWidth, scrollLeft } = el;
    if (scrollWidth <= clientWidth + 1) {
      setThumb((t) => (t.visible ? { ...t, visible: false } : t));
      return;
    }
    setThumb({
      width: Math.max((clientWidth / scrollWidth) * 100, 12),
      left: (scrollLeft / scrollWidth) * 100,
      visible: true,
    });
  }, [targetRef]);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [targetRef, update]);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = targetRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    dragRef.current = {
      x: e.clientX,
      scroll: el.scrollLeft,
      track: track.clientWidth,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    const el = targetRef.current;
    if (!drag || !el) return;
    const dx = e.clientX - drag.x;
    el.scrollLeft = drag.scroll + (dx * el.scrollWidth) / drag.track;
  };

  const endDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
    dragRef.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  if (!thumb.visible) return null;

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative h-1.5 w-full rounded-full bg-brand-gray/15",
        className,
      )}
    >
      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{ width: `${thumb.width}%`, left: `${thumb.left}%` }}
        className="absolute top-0 h-full cursor-grab rounded-full bg-brand-gray/50 transition-colors hover:bg-brand-gray/70 active:cursor-grabbing"
      />
    </div>
  );
}

export default Scrollbar;
