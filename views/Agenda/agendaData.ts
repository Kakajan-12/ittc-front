import { type StaticImageData } from "next/image";
import { IconType } from "react-icons";
import { FaRegStar, FaRegUser } from "react-icons/fa6";
import { PiCoffee } from "react-icons/pi";
import { TiMicrophoneOutline } from "react-icons/ti";
import { LiaGlassCheersSolid } from "react-icons/lia";
import { FiFlag } from "react-icons/fi";

import sponsor7 from "@/public/sponsors/7.jpeg";

export type SessionPerson = {
  name: string;
  description: string;
  image?: StaticImageData;
};

/** expanded under the session row when "View details" is clicked */
export type SessionDetails = {
  description: string;
  keynote?: SessionPerson[];
  moderators?: SessionPerson[];
  speakers?: SessionPerson[];
};

export type AgendaSession = {
  icon: IconType;
  title: string;
  startTime: string;
  endTime?: string;
  room?: string;
  /** logos shown under "Sponsored by:" */
  sponsors?: StaticImageData[];
  details?: SessionDetails;
};

/** number shown in the tab: DAY 01 */
export type AgendaDay = {
  id: string;
  number: number;
  date: string;
  sessions: AgendaSession[];
};

export type AgendaPhaseId = "before" | "conference" | "after";

export type AgendaPhase = {
  id: AgendaPhaseId;
  days: AgendaDay[];
};

/** placeholder people until the real line-up is confirmed */
const placeholderPeople = (count: number): SessionPerson[] =>
  Array.from({ length: count }, () => ({
    name: "Full Name",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  }));

export const agendaData: AgendaPhase[] = [
  {
    id: "before",
    days: [
      {
        id: "before-1",
        number: 1,
        date: "21 November",
        sessions: [
          {
            icon: FaRegUser,
            title: "Arrival Of Delegations And Airport Transfers",
            startTime: "09:00 AM",
            endTime: "08:00 PM",
          },
        ],
      },
      {
        id: "before-2",
        number: 2,
        date: "22 November",
        sessions: [
          {
            icon: FaRegUser,
            title: "Exhibitor Move-In And Stand Construction",
            startTime: "10:00 AM",
            endTime: "06:00 PM",
            room: "Exhibition Hall",
          },
        ],
      },
      {
        id: "before-3",
        number: 3,
        date: "23 November",
        sessions: [
          {
            icon: TiMicrophoneOutline,
            title: "Technical Rehearsal And Speakers Briefing",
            startTime: "11:00 AM",
            endTime: "04:00 PM",
            room: "Conference Room 1",
          },
        ],
      },
    ],
  },
  {
    id: "conference",
    days: [
      {
        id: "day-1",
        number: 1,
        date: "24 November",
        sessions: [
          {
            icon: FaRegStar,
            title:
              "Official Opening Of ITTC & TDF 2025 Exhibition And VIP Tour",
            startTime: "10:00 AM",
            // endTime: "12:00 PM",
          },
          {
            icon: FaRegUser,
            title: "Conference Registration",
            startTime: "12:00 PM",
            sponsors: [sponsor7],
          },
          {
            icon: PiCoffee,
            title: "Welcome Coffee Break",
            startTime: "01:00 PM",
          },
          {
            icon: TiMicrophoneOutline,
            title:
              "Plenary Session | Opening Ceremony | ITTC 2025 & TDF 2025 Conferences",
            startTime: "02:00 PM",
            room: "Conference Room 1",
            sponsors: [sponsor7],
            details: {
              description:
                "The official opening session of the co-located Turkmenistan Digital Forum and International Transport & Transit Corridors Conferences. Honorary Guests share their prospects for the development of these interconnected industries in a digitalised world.",
              keynote: placeholderPeople(1),
              moderators: placeholderPeople(1),
              speakers: placeholderPeople(6),
            },
          },
          {
            icon: PiCoffee,
            title: "Networking Coffee Break",
            startTime: "03:30 PM",
          },
          {
            icon: TiMicrophoneOutline,
            title:
              "Session 1 | International Collaboration & Investment: Driving The Future Of Transport",
            startTime: "04:00 PM",
            room: "Conference Room 2",
            sponsors: [sponsor7, sponsor7],
            details: {
              description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              keynote: placeholderPeople(1),
              moderators: placeholderPeople(1),
              speakers: placeholderPeople(4),
            },
          },
          {
            icon: FiFlag,
            title: "End Of Day 1",
            startTime: "05:45 PM",
          },
          {
            icon: LiaGlassCheersSolid,
            title: "Official Conference Gala Reception (By Invitation Only)",
            startTime: "07:30 PM",
          },
        ],
      },
      {
        id: "day-2",
        number: 2,
        date: "25 November",
        sessions: [
          {
            icon: FaRegUser,
            title: "Conference Registration",
            startTime: "09:00 AM",
          },
          {
            icon: TiMicrophoneOutline,
            title:
              "Session 2 | Transport Infrastructure And Logistics Corridors",
            startTime: "10:00 AM",
            room: "Conference Room 1",
          },
          {
            icon: PiCoffee,
            title: "Networking Coffee Break",
            startTime: "11:30 AM",
          },
          {
            icon: TiMicrophoneOutline,
            title: "Session 3 | Digitalization Of Transport And Trade",
            startTime: "12:00 PM",
            room: "Conference Room 2",
          },
          {
            icon: FiFlag,
            title: "End Of Day 2",
            startTime: "05:30 PM",
          },
        ],
      },
      {
        id: "day-3",
        number: 3,
        date: "26 November",
        sessions: [
          {
            icon: TiMicrophoneOutline,
            title: "Session 4 | Green And Sustainable Transport Solutions",
            startTime: "10:00 AM",
            room: "Conference Room 1",
          },
          {
            icon: PiCoffee,
            title: "Networking Coffee Break",
            startTime: "11:30 AM",
          },
          {
            icon: FaRegStar,
            title: "Closing Ceremony And Awards",
            startTime: "02:00 PM",
            room: "Conference Room 1",
          },
          {
            icon: FiFlag,
            title: "End Of Day 3",
            startTime: "04:00 PM",
          },
        ],
      },
    ],
  },
  {
    id: "after",
    days: [
      {
        id: "after-1",
        number: 1,
        date: "27 November",
        sessions: [
          {
            icon: FaRegStar,
            title: "Technical Tour: Turkmenbashi International Seaport",
            startTime: "09:00 AM",
            endTime: "06:00 PM",
          },
        ],
      },
      {
        id: "after-2",
        number: 2,
        date: "28 November",
        sessions: [
          {
            icon: FaRegStar,
            title: "Cultural Programme And City Tour",
            startTime: "10:00 AM",
            endTime: "04:00 PM",
          },
        ],
      },
      {
        id: "after-3",
        number: 3,
        date: "29 November",
        sessions: [
          {
            icon: FaRegUser,
            title: "Departure Of Delegations",
            startTime: "08:00 AM",
            endTime: "08:00 PM",
          },
        ],
      },
    ],
  },
];
