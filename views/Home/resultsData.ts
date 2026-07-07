export const resultsData = [
  { key: "speakers", value: 40 },
  { key: "delegates", value: 500 },
  { key: "countries", value: 50 },
  { key: "sponsors", value: 10 },
  { key: "sessions", value: 5 },
] as const;

export type ResultStat = (typeof resultsData)[number];
