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

// prettier-ignore
export default function SessionIcon({sessionType}: { readonly sessionType: T_AGENDA.ENTRY.TYPE}) {

  switch (sessionType) {
    case "REGISTRATION":return <ContactBook />;
    case "TRANSFER": return <People/>
    case "EXHIBITION": return <Location/>
    case "CEREMONY": return <Location/>
    case "SESSION": return <Microphone/>
    case "BREAK": return <Coffee />;
    case "LUNCH": return <ForkAndKnife/>
    case "NETWORKING": return <Location/>
    case "VIP_TOUR": return <Location/>
    case "WORKSHOP": return <Location/>
    case "OTHER": return <Location/>
    case "CITY_TOUR": return <Location/>
    case "OPENING": return <Star/>
    case "COFFEE_BREAK": return <Coffee />;
    case "MEETING": return <Handshake/>
    case "DINNER": return <GlassOfWine/>
    case "CLOSING": return <Cup/>
    case "CONTRACT_SIGNING_CEREMONY": return <Notes/>
    case "BOAT_EXCURSION": return <Location/>
    default : return <Location/>

  }







}
