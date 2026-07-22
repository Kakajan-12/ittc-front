import type { SVGProps } from "react";

// Три формы вкладок степпера: первая (плоский левый край),
// средняя (стрелка с обеих сторон) и последняя (плоский правый край).
export type TabVariant = "start" | "middle" | "end";

const TAB_SHAPES: Record<TabVariant, { viewBox: string; d: string }> = {
  start: {
    viewBox: "0 0 144 40",
    d: "M2 1H129.021C129.348 1.00002 129.654 1.16036 129.841 1.42871L142.383 19.4287C142.622 19.7721 142.622 20.2279 142.383 20.5713L129.841 38.5713C129.654 38.8396 129.348 39 129.021 39H2C1.44772 39 1 38.5523 1 38V2C1 1.44772 1.44772 1 2 1Z",
  },
  middle: {
    viewBox: "0 0 143 40",
    d: "M1.0022 1H128.107C128.434 1.00002 128.74 1.16036 128.927 1.42871L141.469 19.4287C141.708 19.7721 141.708 20.2279 141.469 20.5713L128.927 38.5713C128.74 38.8396 128.434 39 128.107 39H1.0022L13.0452 21.7148C13.7633 20.6842 13.7633 19.3158 13.0452 18.2852L1.0022 1Z",
  },
  end: {
    viewBox: "0 0 144 40",
    d: "M1.0022 1H141.086C141.638 1 142.086 1.44772 142.086 2V38C142.086 38.5523 141.638 39 141.086 39H1.0022L13.0452 21.7148C13.7633 20.6842 13.7633 19.3158 13.0452 18.2852L1.0022 1Z",
  },
};

type StepTabProps = {
  variant: TabVariant;
  /** Цвет заливки. По умолчанию без заливки. */
  fill?: string;
  strokeWidth?: number;
} & Omit<SVGProps<SVGSVGElement>, "fill">;

// stroke="currentColor" → цвет обводки берётся из text-* класса (currentColor).
export default function StepTab({
  variant,
  fill = "none",
  strokeWidth = 1.5,
  ...props
}: StepTabProps) {
  const { viewBox, d } = TAB_SHAPES[variant];
  return (
    <svg viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d={d} fill={fill} stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}
