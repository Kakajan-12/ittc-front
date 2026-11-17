import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Пока страница ждёт CMS, шапка и футер уже видны, а на месте содержимого —
 * заглушка той же формы, что PageHeading и текст под ним.
 */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <Skeleton className="min-h-[300px] w-full rounded-none lg:min-h-[460px] xl:min-h-[560px]" />

      <div className="flex flex-col gap-4 px-4 py-12 lg:px-10 lg:py-20">
        <Skeleton className="h-8 w-2/3 max-w-md" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="hidden aspect-video w-full lg:block" />
        </div>
      </div>
    </div>
  );
}
