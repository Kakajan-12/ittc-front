import { Handshake } from "lucide-react";
import Coffee from "./icons/Coffe";
import ContactBook from "./icons/ContactBook";
import Cup from "./icons/Cup";
import ForkAndKnife from "./icons/ForkAndKnife";
import GlassOfWine from "./icons/GlassOfWine";
import { T_AGENDA } from "./type";
import Location from "./icons/Location";
import Microphone from "./icons/Microphone";
import Notes from "./icons/Notes";
import People from "./icons/People";
import Star from "./icons/Star";

// Единый размер для всех иконок: svg-атрибуты width/height перекрываются классом
const ICON_SIZE = "size-5 shrink-0 md:size-6";

// prettier-ignore
export default function SessionIcon({sessionType}: { readonly sessionType: T_AGENDA.ENTRY.TYPE}) {
  const props = { className: ICON_SIZE };

  switch (sessionType) {
    case "REGISTRATION": return <ContactBook {...props} />;
    case "TRANSFER": return <People {...props} />;
    case "SESSION": return <Microphone {...props} />;
    case "BREAK": return <Coffee {...props} />;
    case "LUNCH": return <ForkAndKnife {...props} />;
    case "OPENING": return <Star {...props} />;
    case "COFFEE_BREAK": return <Coffee {...props} />;
    case "MEETING": return <Handshake {...props} />;
    case "DINNER": return <GlassOfWine {...props} />;
    case "CLOSING": return <Cup {...props} />;
    case "CONTRACT_SIGNING_CEREMONY": return <Notes {...props} />;
    default: return <Location {...props} />;
  }
}
