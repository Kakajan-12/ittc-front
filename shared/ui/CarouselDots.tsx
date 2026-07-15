import { cn } from "@/lib/utils";

function CarouselDots({
  count,
  current,
  onSelect,
  className,
}: {
  count: number;
  current: number;
  onSelect: (page: number) => void;
  className?: string;
}) {
  // Only meaningful when the cards don't all fit on one row.
  if (count <= 1) return null;

  return (
    <div className={cn("mt-6 flex justify-center gap-2", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === current}
          onClick={() => onSelect(i)}
          className={cn(
            "h-1.5 rounded-full transition-all",
            i === current ? "w-6 bg-brand-blue-dark" : "w-4 bg-brand-gray/40",
          )}
        />
      ))}
    </div>
  );
}

export default CarouselDots;
