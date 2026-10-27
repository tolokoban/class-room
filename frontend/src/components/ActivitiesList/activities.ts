/**
 * This file is auto-generated.
 */

type Activity = [name: string, children?: Activity[]];

export const ACTIVITIES: Activity[] = [
  ["AI", [["eliza"], ["le-chat-mange-la"], ["mycin"]]],
  ["security", [["personal-data", [["RGPD"]]]]],
];

export const INFOS: Record<
  string,
  {
    title?: string;
    description?: string;
  }
> = {
  AI: {
    title: "Intelligence Artificielle",
  },
  "AI/eliza": {
    title: "Eliza (1966)",
  },
  "AI/le-chat-mange-la": {
    title: "Température",
  },
  "AI/mycin": {
    title: "Systèmes experts",
  },
  "security/personal-data/RGPD": {},
};
