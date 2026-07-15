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
  ...props
}: SkeletonImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // onLoad не срабатывает для уже закэшированных картинок — ловим это через ref.
  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  const image = (
    <Image
      {...props}
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
  );

  if (fill) {
    return (
      <>
        {!isLoaded && <ImageSkeleton className={skeletonClassName} />}
        {image}
      </>
    );
  }

  return (
    <span className="relative inline-block">
      {!isLoaded && (
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
