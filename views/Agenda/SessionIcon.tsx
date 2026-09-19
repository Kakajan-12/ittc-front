import { FaRegStar, FaRegUser } from "react-icons/fa6";
import { FiFlag } from "react-icons/fi";
import { LiaGlassCheersSolid } from "react-icons/lia";
import { PiCoffee } from "react-icons/pi";
import { TiMicrophoneOutline } from "react-icons/ti";

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
      return <LiaGlassCheersSolid className={className} />;
    case "flag":
      return <FiFlag className={className} />;
    default:
      return <TiMicrophoneOutline className={className} />;
  }
}
