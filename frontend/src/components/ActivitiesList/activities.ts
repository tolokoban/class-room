/**
 * This file is auto-generated.
 */

type Activity = [name: string, children?: Activity[]];

export const ACTIVITIES: Activity[] = [
  ["AI", [["CRAFT"], ["eliza"], ["le-chat-mange-la"], ["mycin"], ["RAG", [["embedding"]]], ["types-ia-generatives"], ["usage"]]],
  ["security", [["personal-data", [["AI-Act"], ["anonymous"], ["RGPD"]]]]],
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
  "AI/CRAFT": {},
  "AI/eliza": {
    title: "Eliza (1966)",
  },
  "AI/le-chat-mange-la": {
    title: "Température",
  },
  "AI/mycin": {
    title: "Systèmes experts",
  },
  "AI/RAG": {
    title: "RAG",
  },
  "AI/RAG/embedding": {
    title: "Devine l'animal",
    description: "Un jeu pour découvrir les _embeddings_ : chaque question est transformée en vecteur, puis comparée aux questions connues.",
  },
  "AI/types-ia-generatives": {},
  "AI/usage": {},
  "security/personal-data/AI-Act": {},
  "security/personal-data/anonymous": {
    title: "Anonymisation de documents",
  },
  "security/personal-data/RGPD": {},
};
