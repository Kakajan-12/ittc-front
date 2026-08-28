import type { SVGProps } from "react";

export type TabVariant = "0" | "1" | "2" | "3" | "4";

const HEIGHT = 40;

/** Ширина viewBox: активный шаг шире остальных (как на макете). */
export const tabWidth = (active: boolean) => (active ? 144 : 74);

const n = (v: number) => +v.toFixed(3);

const LEFT_ROUND_START = "M2 1";
const LEFT_ROUND_END =
  "H2C1.44772 39 1 38.5523 1 38V2C1 1.44772 1.44772 1 2 1Z";
const LEFT_NOTCH_START = "M1.0022 1";
const LEFT_NOTCH_END =
  "H1.0022L13.0452 21.7148C13.7633 20.6842 13.7633 19.3158 13.0452 18.2852L1.0022 1Z";

// Правый край отсчитывается от правой границы, поэтому переносится на любую ширину.
const rightArrow = (w: number) =>
  `H${n(w - 14.979)}C${n(w - 14.652)} 1.00002 ${n(w - 14.346)} 1.16036 ${n(w - 14.159)} 1.42871L${n(w - 1.617)} 19.4287C${n(w - 1.378)} 19.7721 ${n(w - 1.378)} 20.2279 ${n(w - 1.617)} 20.5713L${n(w - 14.159)} 38.5713C${n(w - 14.346)} 38.8396 ${n(w - 14.652)} 39 ${n(w - 14.979)} 39`;

const rightFlat = (w: number) =>
  `H${n(w - 2.914)}C${n(w - 2.362)} 1 ${n(w - 1.914)} 1.44772 ${n(w - 1.914)} 2V38C${n(w - 1.914)} 38.5523 ${n(w - 2.362)} 39 ${n(w - 2.914)} 39`;

const buildPath = (variant: TabVariant, w: number) => {
  if (variant === "0") return LEFT_ROUND_START + rightArrow(w) + LEFT_ROUND_END;
  if (variant === "4") return LEFT_NOTCH_START + rightFlat(w) + LEFT_NOTCH_END;
  return LEFT_NOTCH_START + rightArrow(w) + LEFT_NOTCH_END;
};

type StepTabProps = {
  variant: TabVariant;
  active?: boolean;
  fill?: string;
  strokeWidth?: number;
} & Omit<SVGProps<SVGSVGElement>, "fill">;

export default function StepTab({
  variant,
  active = false,
  fill = "none",
  strokeWidth = 1.5,
  ...props
}: StepTabProps) {
  const width = tabWidth(active);
  return (
    <svg
      viewBox={`0 0 ${width} ${HEIGHT}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d={buildPath(variant, width)}
        fill={fill}
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
