import { StaticImageData } from "next/image";
import speaker1 from "@/public/speakers/1.png";
import speaker2 from "@/public/speakers/2.png";
import speaker3 from "@/public/speakers/3.png";
import speaker4 from "@/public/speakers/4.png";
import speaker5 from "@/public/speakers/5.png";
import speaker6 from "@/public/speakers/6.png";
import speaker7 from "@/public/speakers/7.webp";
import speaker8 from "@/public/speakers/8.png";

export type SpeakerItem = {
  id: number;
  image: StaticImageData;
};

export const speakersData: SpeakerItem[] = [
  { id: 1, image: speaker1 },
  { id: 2, image: speaker2 },
  { id: 3, image: speaker3 },
  { id: 4, image: speaker4 },
  { id: 5, image: speaker5 },
  { id: 6, image: speaker6 },
  { id: 7, image: speaker7 },
  { id: 8, image: speaker8 },
];
