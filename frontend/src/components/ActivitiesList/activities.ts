/**
 * This file is auto-generated.
 */

type Activity = [name: string, children?: Activity[]];

export const ACTIVITIES: Activity[] = [
  ["AI", [["chess"], ["CRAFT"], ["eliza"], ["GPS"], ["le-chat-mange-la"], ["mycin"], ["neural-network"], ["perceptron"], ["RAG", [["embedding"]]], ["types-ia-generatives"], ["usage"]]],
  ["office", [["selection"]]],
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
  "AI/chess": {
    title: "Comment un ordinateur joue aux échecs ?",
    description: "L'ordinateur imagine tous les coups possibles et donne une note à chaque position obtenue.",
  },
  "AI/CRAFT": {},
  "AI/eliza": {
    title: "Eliza (1966)",
  },
  "AI/GPS": {
    title: "Comment le GPS trouve la route la plus courte ?",
    description: "Un labyrinthe aléatoire pour découvrir comment un GPS calcule le plus court chemin.",
  },
  "AI/le-chat-mange-la": {
    title: "Température",
  },
  "AI/mycin": {
    title: "Systèmes experts",
  },
  "AI/neural-network": {
    title: "Réseau de neurones",
    description: "Un tout petit réseau de neurones apprend, clic après clic, le contenu d'un tableau de 8 cases.",
  },
  "AI/perceptron": {
    title: "Perceptron (1958)",
    description: "Le premier réseau de neurones capable d'apprendre : il regarde le monde à travers une grille de 20×20 cases.",
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
  office: {
    title: "Bureautique",
  },
  "office/selection": {
    title: "Sélectionner au clavier",
    description: "Reproduire un texte en sélectionnant, copiant, coupant, collant et mettant en gras avec le clavier, en un minimum de frappes.",
  },
  "security/personal-data/AI-Act": {},
  "security/personal-data/anonymous": {
    title: "Anonymisation de documents",
  },
  "security/personal-data/RGPD": {},
};
