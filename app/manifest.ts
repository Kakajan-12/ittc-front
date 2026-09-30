import type { MetadataRoute } from "next";

/**
 * Веб-манифест: без него Android при «Добавить на главный экран» рисует
 * вместо иконки первую букву названия. Иконки — PNG из public/, собранные из
 * логотипа favicon.svg; маскируемая — с полями под круглую обрезку лаунчера.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ITTC 2026",
    short_name: "ITTC 2026",
    description:
      "International Transport and Transit Corridors Forum and Exhibition — ITTC 2026, Ashgabat",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#009fe3",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
