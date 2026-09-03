"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "skeleton-shimmer rounded-md bg-linear-to-br from-gray-100 via-gray-200 to-gray-100",
        className,
      )}
      {...props}
    />
  );
}

function ImageSkeleton({
  className,
  ...props
}: React.ComponentProps<typeof Skeleton>) {
  return (
    <Skeleton
      data-slot="image-skeleton"
      aria-hidden
      className={cn("absolute inset-0 h-full w-full", className)}
      {...props}
    />
  );
}

type SkeletonImageProps = ImageProps & {
  skeletonClassName?: string;
};

function SkeletonImage({
  className,
  skeletonClassName,
  onLoad,
  fill,
  src,
  ...props
}: SkeletonImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // onLoad не срабатывает для уже закэшированных картинок — ловим это через ref.
  // При смене src сбрасываем состояние, чтобы снова показать скелетон.
  useEffect(() => {
    setIsLoaded(imgRef.current?.complete ?? false);
  }, [src]);

  // src ещё не пришёл (например, данные грузятся) — next/image требует непустой src.
  const hasSrc = Boolean(src);

  const image = hasSrc ? (
    <Image
      {...props}
      src={src}
      ref={imgRef}
      fill={fill}
      className={cn(
        "transition-opacity duration-300",
        isLoaded ? "opacity-100" : "opacity-0",
        fill && "z-10",
        className,
      )}
      onLoad={(event) => {
        setIsLoaded(true);
        onLoad?.(event);
      }}
    />
  ) : null;

  const showSkeleton = !hasSrc || !isLoaded;

  if (fill) {
    return (
      <>
        {showSkeleton && <ImageSkeleton className={skeletonClassName} />}
        {image}
      </>
    );
  }

  return (
    <span className="relative inline-block">
      {showSkeleton && (
        <ImageSkeleton
          className={cn("rounded-md", skeletonClassName)}
          style={{ width: props.width, height: props.height }}
        />
      )}
      {image}
    </span>
  );
}

export { Skeleton, ImageSkeleton, SkeletonImage };
