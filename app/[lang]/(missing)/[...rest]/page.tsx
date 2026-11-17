import { notFound } from "next/navigation";

/**
 * Ловит все адреса, для которых нет страницы. Без него Next показывает свою
 * английскую 404 вне layout — без шапки и футера. notFound() уходит в
 * (missing)/not-found.tsx, который рисуется внутри layout сайта.
 */
export default function CatchAllPage() {
  notFound();
}
