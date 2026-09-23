import DOMPurify from "isomorphic-dompurify";

/**
 * Чистит HTML, пришедший из редактора CMS, перед вставкой через
 * `dangerouslySetInnerHTML`.
 *
 * Тексты пишут доверенные редакторы, поэтому это не первая линия обороны, а
 * страховка: скомпрометированная учётка редактора не должна превращаться в
 * выполнение чужого скрипта у каждого посетителя сайта.
 *
 * Разрешено то, что реально умеет редактор: форматирование, списки, ссылки,
 * изображения. Скрипты, фреймы, обработчики событий и `javascript:` вырезаются.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "a",
      "ul",
      "ol",
      "li",
      "h2",
      "h3",
      "h4",
      "blockquote",
      "code",
      "pre",
      "img",
      "figure",
      "figcaption",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "span",
      "div",
      "hr",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "title", "class"],
    // Ссылки только по безопасным схемам: `javascript:` и `data:` отсекаются.
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|#|\/)/i,
    // `target="_blank"` без `rel` даёт открытой вкладке доступ к opener.
    ADD_ATTR: ["rel"],
  });
}
