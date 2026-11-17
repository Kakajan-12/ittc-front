import { GoArrowUpRight } from "react-icons/go";
import { Link } from "@/i18n/navigation";

/**
 * Общий экран для 404 и ошибок. Без хуков, поэтому подходит и серверному
 * not-found, и клиентскому error: тексты приходят уже переведёнными.
 */
export default function StatusScreen({
  code,
  title,
  text,
  homeLabel,
  action,
  className = "",
}: {
  code?: string;
  title: string;
  text: string;
  homeLabel: string;
  /** Дополнительная кнопка перед ссылкой на главную, например «Попробовать снова». */
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`flex min-h-[70dvh] w-full flex-col items-center justify-center px-4 py-16 text-center font-roboto lg:px-10 ${className}`}
    >
      {code && (
        <p className="text-7xl font-bold leading-none text-brand-blue lg:text-9xl">
          {code}
        </p>
      )}
      <h1 className="mt-6 text-2xl font-medium text-brand-dark-gray sm:text-3xl lg:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-base text-brand-gray lg:text-lg">
        {text}
      </p>

      <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
        {action}
        <Link
          href="/"
          className="group flex w-full items-center justify-center gap-2 rounded bg-brand-blue px-8 py-2.5 text-base text-white transition hover:bg-brand-blue/90 sm:w-fit xl:text-lg"
        >
          {homeLabel}
          <GoArrowUpRight className="size-5 shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </section>
  );
}

/** Стиль второстепенной кнопки рядом со ссылкой на главную. */
export const secondaryButtonClass =
  "flex w-full items-center justify-center rounded border border-brand-blue px-8 py-2.5 text-base text-brand-blue transition hover:bg-brand-blue/5 sm:w-fit xl:text-lg cursor-pointer";
