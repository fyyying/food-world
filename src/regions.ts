/** The seven little worlds. Cuisines from Notion map onto one island each. */
export type LandmarkKind = "barn" | "tower" | "dome" | "pagoda" | "stupa" | "castle" | "windmill";
export type TreeKind = "cactus" | "cypress" | "olive" | "blossom" | "palm" | "pine" | "orchard";

export type Region = {
  id: string;
  name: string;
  tagline: string;
  cuisines: string[];
  grass: string;
  grassAlt: string;
  cliff: string;
  sand: string;
  accent: string;
  landmark: LandmarkKind;
  tree: TreeKind;
};

export const REGIONS: Region[] = [
  {
    id: "americas", name: "The Americas", tagline: "Smoke, grills, tacos and cookies",
    cuisines: ["American", "Mexican"],
    grass: "#d9c26a", grassAlt: "#c9a94f", cliff: "#b8794f", sand: "#f3dfb6", accent: "#d95d39",
    landmark: "barn", tree: "cactus",
  },
  {
    id: "italia", name: "Italia", tagline: "Pasta, sauces and the Sunday oven",
    cuisines: ["Italian"],
    grass: "#8fb45c", grassAlt: "#7aa14a", cliff: "#a5744c", sand: "#f2dcb5", accent: "#c1533f",
    landmark: "tower", tree: "cypress",
  },
  {
    id: "mediterranean", name: "Mediterranean & Levant", tagline: "Olive oil, lemon, yoghurt and herbs",
    cuisines: ["Mediterranean", "Greek", "Lebanese", "Middle Eastern", "North African", "Turkish", "Spanish"],
    grass: "#a7c88a", grassAlt: "#8fb774", cliff: "#c9b08d", sand: "#f6e7c9", accent: "#3f7fbf",
    landmark: "dome", tree: "olive",
  },
  {
    id: "east-asia", name: "East Asia", tagline: "Woks, broths, rice and pickles",
    cuisines: ["Chinese", "Japanese", "Korean"],
    grass: "#9ccb8f", grassAlt: "#7fb87b", cliff: "#8c6a55", sand: "#f1e0c8", accent: "#d64550",
    landmark: "pagoda", tree: "blossom",
  },
  {
    id: "south-asia", name: "South & Southeast Asia", tagline: "Curries, coconut and chilli",
    cuisines: ["Indian", "Thai", "Vietnamese"],
    grass: "#6fb06b", grassAlt: "#5b9c5a", cliff: "#8a6247", sand: "#f0dcb0", accent: "#e0a52c",
    landmark: "stupa", tree: "palm",
  },
  {
    id: "north-europe", name: "Northern Europe", tagline: "Stews, roasts and pastry",
    cuisines: ["British", "Hungarian", "Georgian", "German", "Swiss", "French", "Swedish"],
    grass: "#7da86c", grassAlt: "#66905a", cliff: "#7c7a80", sand: "#e9dcc2", accent: "#5c6f9c",
    landmark: "castle", tree: "pine",
  },
  {
    id: "pantry", name: "The Pantry", tagline: "Sides, snacks and sweet things",
    cuisines: [],
    grass: "#b8d8b0", grassAlt: "#a3caa0", cliff: "#b59a86", sand: "#f7ead2", accent: "#e8836a",
    landmark: "windmill", tree: "orchard",
  },
];

const FALLBACK_REGION = "north-europe";
const NO_CUISINE_REGION = "pantry";

export function regionForCuisine(cuisine: string | null | undefined): Region {
  if (!cuisine) return REGIONS.find((r) => r.id === NO_CUISINE_REGION)!;
  return REGIONS.find((r) => r.cuisines.includes(cuisine)) ?? REGIONS.find((r) => r.id === FALLBACK_REGION)!;
}

export const CUISINE_FLAGS: Record<string, string> = {
  American: "🇺🇸", Mexican: "🇲🇽", Italian: "🇮🇹", British: "🇬🇧", Korean: "🇰🇷", French: "🇫🇷", Greek: "🇬🇷",
  Chinese: "🇨🇳", German: "🇩🇪", Mediterranean: "🫒", "Middle Eastern": "🧆", Japanese: "🇯🇵", Swiss: "🇨🇭",
  Thai: "🇹🇭", Turkish: "🇹🇷", Indian: "🇮🇳", Swedish: "🇸🇪", "North African": "🇲🇦", Lebanese: "🇱🇧",
  Vietnamese: "🇻🇳", Hungarian: "🇭🇺", Spanish: "🇪🇸", Georgian: "🇬🇪",
};
