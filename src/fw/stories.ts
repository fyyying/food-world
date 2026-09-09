// Food-history stories: guided journeys across the atlas and into the worlds. The first one follows the chilli
// from the Americas to Sichuan; the pattern (chapters with an era, a text and a stop on the atlas or at an object
// in a world) is meant to carry many more.

import { type WorldId } from "./graph";

export type StoryStop = { region: WorldId; dist?: number } | { world: WorldId; object: string };

export type Chapter = {
  era: string;
  title: string;
  zh?: string;
  text: string;
  stop: StoryStop;
};

export type Story = {
  id: string;
  emoji: string;
  title: string;
  zh: string;
  tagline: string;
  chapters: Chapter[];
};

export const STORIES: Story[] = [
  {
    id: "chilli",
    emoji: "🌶️",
    title: "The Journey of Chilli",
    zh: "辣椒之路",
    tagline: "A wild berry from Mexico that became the taste of Sichuan, in six stops.",
    chapters: [
      {
        era: "6000 BC · Mexico", title: "A wild berry in the Tehuacán valley", zh: "辣椒的故乡", stop: { region: "mexico" },
        text: "Chillies are American. Wild Capsicum grew from Bolivia to the Amazon, and people in Mexico were gathering and then planting it by 6000 BC, one of the oldest crops in the Americas beside squash and maize. The Aztecs called it chīlli, the word every language borrowed. They ate it with everything, paid tribute in it, and punished children with its smoke.",
      },
      {
        era: "1493 · Spain", title: "Columbus mistakes it for pepper", zh: "哥伦布的误会", stop: { region: "mediterranean" },
        text: "Columbus was looking for the pepper of the Indies. He found this in the Caribbean instead and brought it to Spain in 1493, calling it pimiento, pepper, a mistake the world never corrected. Within fifty years it grew in Spanish and Portuguese gardens and monasteries, cheap enough for the poor, who had never been able to afford real pepper.",
      },
      {
        era: "1510s · India", title: "The Portuguese carry it east", zh: "葡萄牙人的航线", stop: { region: "india" },
        text: "Portuguese ships took it down the African coast and to Goa after 1510. India had eaten black pepper and long pepper for two thousand years; the new plant grew anywhere and dried for the road, and within a century it was in curries from Kerala to Bengal. From Goa and Malacca it moved along every trade route in Asia.",
      },
      {
        era: "1591 · The Chinese coast", title: "Foreign pepper, grown for its looks", zh: "番椒入华", stop: { region: "china" },
        text: "The first Chinese record is from 1591: Gao Lian's guide to elegant living lists 番椒, foreign pepper, as an ornamental pot plant with pretty red fruit. It came in through the ports of Zhejiang and Guangdong on the same ships that brought maize, sweet potato and peanuts, and for a hundred years nobody in the cities thought of eating it.",
      },
      {
        era: "1720s · Guizhou, then up the Yangtze", title: "Salt for the poor", zh: "以椒代盐", stop: { world: "china", object: "chilli" },
        text: "The first Chinese to eat it were the poor of the mountainous southwest. A Guizhou gazetteer of 1721 records people using 海椒, sea pepper, in place of salt, which was taxed and scarce in the hills. From Guizhou it followed the salt roads and the boats into Hunan and up the Yangtze, and by the 1790s it was growing in Sichuan gardens.",
      },
      {
        era: "1800s to today · Sichuan", title: "Where it met Sichuan pepper", zh: "麻辣的诞生", stop: { world: "china", object: "chilli" },
        text: "Sichuan had loved pungent food for two thousand years, seasoning with Sichuan pepper, ginger and mustard. The new heat slotted in beside the old tingle, and by the 1850s 麻辣 was the region's signature. People here still call it 海椒, sea pepper, remembering how it arrived. China now grows more chillies than any country on earth, and the wild berry from Mexico stands in this field.",
      },
    ],
  },
];
