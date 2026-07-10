import * as Flags from "country-flag-icons/react/3x2";
import { cn } from "@/lib/utils";

type FlagComponent = React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>;

type CountryFlagProps = {
  code: string;
  title?: string;
  className?: string;
};

// Renders a real SVG flag (works on every platform, unlike emoji flags
// which Windows does not render).
export default function CountryFlag({ code, title, className }: CountryFlagProps) {
  const Flag = (Flags as Record<string, FlagComponent | undefined>)[
    code.toUpperCase()
  ];

  if (!Flag) return null;

  return (
    <Flag
      title={title}
      className={cn("h-4 w-6 shrink-0 rounded-[2px] object-cover", className)}
    />
  );
}
