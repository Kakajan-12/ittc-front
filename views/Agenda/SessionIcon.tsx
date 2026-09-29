import { FaRegStar, FaRegUser } from "react-icons/fa6";
import { FiFlag } from "react-icons/fi";
import { PiCoffee } from "react-icons/pi";
import { TiMicrophoneOutline } from "react-icons/ti";

/**
 * Приёмы — своя иконка, не из react-icons. Пропорции 18×29, поэтому в
 * квадратном боксе (`size-6`) она остаётся узкой и высокой; цвет берётся из
 * текста, как у остальных.
 */
function CheersIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 29"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M18 13.1818V1.31818C18 0.968578 17.842 0.633294 17.5607 0.386086C17.2794 0.138879 16.8978 0 16.5 0H1.5C1.10218 0 0.720645 0.138879 0.43934 0.386086C0.158036 0.633294 0 0.968578 0 1.31818V13.1818C0.0039448 15.0491 0.758801 16.855 2.1312 18.2806C3.50359 19.7061 5.40519 20.6595 7.5 20.9723V26.3636H3C2.60218 26.3636 2.22064 26.5025 1.93934 26.7497C1.65804 26.9969 1.5 27.3322 1.5 27.6818C1.5 28.0314 1.65804 28.3667 1.93934 28.6139C2.22064 28.8611 2.60218 29 3 29H15C15.3978 29 15.7794 28.8611 16.0607 28.6139C16.342 28.3667 16.5 28.0314 16.5 27.6818C16.5 27.3322 16.342 26.9969 16.0607 26.7497C15.7794 26.5025 15.3978 26.3636 15 26.3636H10.5V20.9723C12.5948 20.6595 14.4964 19.7061 15.8688 18.2806C17.2412 16.855 17.9961 15.0491 18 13.1818ZM15 2.63636V7.9605C13.608 7.71927 11.598 7.12082 9.3645 6.63046C7.26535 6.17637 5.06509 6.23334 3 6.79523V2.63636H15ZM3 13.1818V9.61482C4.77687 8.94188 6.75376 8.79206 8.6355 9.18773C11.3985 9.79541 13.197 10.4044 15 10.6377V13.1818C15 14.5802 14.3679 15.9214 13.2426 16.9102C12.1174 17.899 10.5913 18.4545 9 18.4545C7.4087 18.4545 5.88258 17.899 4.75736 16.9102C3.63214 15.9214 3 14.5802 3 13.1818Z" />
    </svg>
  );
}

/** Icon keys the CMS stores on a session (`AgendaSession.icon`). */
export const SESSION_ICON_KEYS = [
  "star",
  "user",
  "coffee",
  "microphone",
  "cheers",
  "flag",
] as const;

/**
 * Resolved with a switch rather than a lookup table on purpose: picking a
 * component out of a map inside render trips the React compiler lint.
 */
export default function SessionIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  switch (icon) {
    case "star":
      return <FaRegStar className={className} />;
    case "user":
      return <FaRegUser className={className} />;
    case "coffee":
      return <PiCoffee className={className} />;
    case "cheers":
      return <CheersIcon className={className} />;
    case "flag":
      return <FiFlag className={className} />;
    default:
      return <TiMicrophoneOutline className={className} />;
  }
}
