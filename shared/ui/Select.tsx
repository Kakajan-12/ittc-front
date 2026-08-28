"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { FaChevronDown } from "react-icons/fa";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  id: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
  error?: string;
  /** Длинный список — над опциями появляется строка поиска */
  searchable?: boolean;
  /**
   * Поиск на бэкенде: Select только сообщает строку, а фильтрует родитель —
   * `options` уже приходят отфильтрованными, локальный фильтр выключается.
   */
  onSearchChange?: (query: string) => void;
  /** Летит запрос по строке поиска — вместо списка показываем «Загрузка…» */
  searchPending?: boolean;
  /**
   * Подпись выбранного значения, когда его нет в `options`: при серверном
   * поиске список — это результат запроса, выбранной страны в нём может не быть.
   */
  selectedLabel?: string;
  onLoadMore?: () => void;

  /** Есть ли следующая страница */

  hasNextPage?: boolean;

  /** Загружается ли следующая страница */

  isLoadingMore?: boolean;
};

/**
 * Для поиска: регистр и диакритика не должны мешать — «türkmen» находится
 * и по «turkmen», «Ёлка» по «елка». NFD раскладывает букву на базовую и знак,
 * знаки (U+0300–U+036F) выкидываем.
 */
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default function Select({
  id,

  label,

  placeholder,

  options,

  value,

  onChange,

  required = false,

  className,

  error,

  searchable = false,

  onSearchChange,

  searchPending = false,

  selectedLabel,

  onLoadMore,

  hasNextPage = false,

  isLoadingMore = false,
}: SelectProps) {
  const t = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedOption = options.find((option) => option.value === value);
  const labelSuffix = required ? " *" : ` ${t("optional")}`;
  const triggerLabel =
    selectedOption?.label ?? (value ? selectedLabel : undefined);

  const visibleOptions = useMemo(() => {
    const needle = normalize(query.trim());
    // Фильтрует бэкенд — `options` уже результат поиска
    if (onSearchChange || !searchable || !needle) return options;
    return options.filter((option) => normalize(option.label).includes(needle));
  }, [onSearchChange, options, query, searchable]);

  const setSearch = useCallback(
    (next: string) => {
      setQuery(next);
      onSearchChange?.(next);
    },
    [onSearchChange],
  );

  const handleOptionsScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const element = e.currentTarget;

    const isBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 20;

    if (isBottom && hasNextPage && !isLoadingMore) {
      onLoadMore?.();
    }
  };
  /** Закрытие всегда сбрасывает поиск — следующее открытие начинается с нуля */
  const close = useCallback(() => {
    setOpen(false);
    setSearch("");
  }, [setSearch]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [close]);

  /** Открылся список — фокус сразу в строке поиска, можно печатать */
  useEffect(() => {
    if (open && searchable) searchRef.current?.focus();
  }, [open, searchable]);

  const selectOption = (optionValue: string) => {
    onChange(optionValue);
    close();
  };

  /** Enter выбирает первое совпадение, Escape закрывает и возвращает фокус */
  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const first = visibleOptions[0];
      if (first) selectOption(first.value);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      document.getElementById(id)?.focus();
    }
  };

  return (
    <div className={className} ref={containerRef}>
      {/* Рамка позиционируется по этой обёртке, поэтому в потоке в ней не должно
          быть ничего, кроме триггера — список абсолютный и на высоту не влияет.
          Триггер всегда показывает плейсхолдер, значит подпись не может лечь по
          центру: она сразу наверху и проявляется по data-raised, как у телефона. */}
      <div
        className="relative"
        data-raised={open || focused || value ? "" : undefined}
      >
        <button
          id={id}
          type="button"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-describedby={error ? `${id}-error` : undefined}
          onClick={() => (open ? close() : setOpen(true))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="input-style field-input text-left"
        >
          {/* Флекс живёт на вложенном span: .field-input задаёт display: block
              вне слоёв, поэтому утилита `flex` на самой кнопке не победила бы */}
          <span className="flex w-full items-center justify-between gap-2">
            <span className={cn("truncate", !triggerLabel && "text-white/50")}>
              {triggerLabel ?? placeholder ?? t("selectPlaceholder")}
            </span>
            <FaChevronDown
              className={cn(
                "size-3 shrink-0 text-white/70 transition-transform",
                open && "rotate-180",
              )}
              aria-hidden
            />
          </span>
        </button>

        {/* Рамку рисует fieldset: legend вырезает в ней настоящий разрыв под
            подпись. Сам текст легенды скрыт — она только распорка. */}
        <fieldset
          aria-hidden
          className={`field-outline ${value ? "field-outline--filled" : ""} ${
            error ? "field-outline--error" : ""
          }`}
        >
          <legend className="field-legend">
            {label}
            {labelSuffix}
          </legend>
        </fieldset>

        <label htmlFor={id} className="field-label field-label--raised">
          {label}
          {labelSuffix}
        </label>

        {open ? (
          <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-md border border-white/20 bg-[#1c5b87] shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
            {searchable ? (
              <div className="border-b border-white/10 p-2">
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={onSearchKeyDown}
                  placeholder={t("search")}
                  aria-label={t("search")}
                  autoComplete="off"
                  className="h-9 w-full rounded border border-white/20 bg-white/10 px-3 text-base text-white outline-none placeholder:text-white/50 focus:border-brand-blue"
                />
              </div>
            ) : null}

            <ul
              role="listbox"
              aria-labelledby={id}
              onScroll={handleOptionsScroll}
              className="max-h-60 overflow-y-auto py-1"
            >
              {searchPending && !visibleOptions.length ? (
                <li className="px-4 py-2.5 text-base text-white/60">
                  {t("loading")}
                </li>
              ) : visibleOptions.length ? (
                <>
                  {visibleOptions.map((option) => (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={value === option.value}
                    >
                      <button
                        type="button"
                        onClick={() => selectOption(option.value)}
                        className={cn(
                          "flex w-full px-4 py-2.5 text-left text-base text-white transition-colors hover:bg-white/10",
                          value === option.value && "bg-brand-blue",
                        )}
                      >
                        {option.label}
                      </button>
                    </li>
                  ))}

                  {isLoadingMore ? (
                    <li className="flex items-center justify-center px-4 py-3">
                      <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    </li>
                  ) : null}
                </>
              ) : (
                <li className="px-4 py-2.5 text-base text-white/60">
                  {t("notFound")}
                </li>
              )}
            </ul>
          </div>
        ) : null}
      </div>

      {error ? (
        <p id={`${id}-error`} className="mt-1 font-nexa text-xs text-[#DE7A7A]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
