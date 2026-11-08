import React from "react";

import { QuizChoiceFalse } from "@/components/quiz/QuizChoiceFalse";
import { QuizChoiceTrue } from "@/components/quiz/QuizChoiceTrue";
import { Quiz, QuizItemQCM } from "@/types";

function yesNo(question: string, correct: boolean, explanation: string): QuizItemQCM {
  return {
    kind: "qcm",
    question: { fr: question },
    choices: {
      T: <QuizChoiceTrue />,
      F: <QuizChoiceFalse />,
    },
    answers: {
      [correct ? "T" : "F"]: { fr: explanation },
    },
  };
}

function choice(
  question: string,
  choices: Record<string, string>,
  correct: string | string[],
  explanation: string,
): QuizItemQCM {
  const correctIds = Array.isArray(correct) ? correct : [correct];
  return {
    kind: "qcm",
    question: { fr: question },
    choices,
    answers: Object.fromEntries(correctIds.map((id) => [id, { fr: explanation }])),
  };
}

export const QUIZ: Quiz = {
  id: "bilan-1",
  title: {
    fr: "Bilan : comprendre l'IA et son cadre d'usage",
  },
  items: {
    // 1.1.2 - Qu'est-ce que l'IA ?
    definition: choice(
      "Quelle phrase décrit le mieux l'intelligence artificielle ?",
      {
        A: "Un robot qui pense comme un humain",
        B: "Des systèmes informatiques capables d'effectuer des tâches habituellement associées à l'intelligence",
        C: "Un programme qui connait la réponse à toutes les questions",
        D: "Une base de données géante",
      },
      "B",
      "L'IA regroupe des systèmes capables d'apprendre, de raisonner, de résoudre des problèmes, de percevoir ou de décider : des tâches que l'on associe habituellement à l'intelligence.",
    ),
    intelligenceDefinition: yesNo(
      "Il existe une définition simple et unanime de l'intelligence.",
      false,
      "L'intelligence est difficile à définir : elle a plusieurs facettes (raisonnement, intuition, perception, ...). C'est pourquoi la définition de l'IA reste, elle aussi, floue.",
    ),
    beforeComputers: yesNo(
      "L'idée de machines qui calculent ou « raisonnent » est bien plus ancienne que l'informatique.",
      true,
      "D'Aristote (logique) à Léonard de Vinci (calculatrice) en passant par les automates, l'idée d'IA précède largement l'ordinateur.",
    ),
    mechanicalTurk: choice(
      "Que nous apprend l'histoire du Turc mécanique, cet « automate » joueur d'échecs du XVIIIᵉ siècle ?",
      {
        A: "Que les machines savaient déjà jouer aux échecs à cette époque",
        B: "Que nous avons facilement tendance à attribuer une intelligence aux machines",
        C: "Que les échecs sont un jeu facile",
        D: "Que Napoléon était un mauvais joueur",
      },
      "B",
      "Un humain était caché dans la machine. Pendant des décennies, le public a pourtant cru à une machine intelligente : nous prêtons facilement de l'intelligence aux machines.",
    ),
    turingTest: choice(
      "Selon le test de Turing, quand une machine est-elle considérée comme intelligente ?",
      {
        A: "Quand elle calcule plus vite qu'un humain",
        B: "Quand elle bat un champion d'échecs",
        C: "Quand un humain qui dialogue avec elle ne peut pas savoir s'il parle à une machine ou à un humain",
        D: "Quand elle a des émotions",
      },
      "C",
      "Le test de Turing est une définition « opérationnelle » : on ne cherche pas à savoir ce qu'est l'intelligence, on regarde si la machine peut se faire passer pour un humain.",
    ),
    winters: choice(
      "Pourquoi l'IA a-t-elle connu des « hivers » (périodes de désintérêt) ?",
      {
        A: "Parce que les ordinateurs avaient trop chaud",
        B: "Parce que les promesses étaient excessives et que les résultats ont déçu",
        C: "Parce que l'IA a été interdite par la loi",
        D: "Parce que tous les problèmes avaient été résolus",
      },
      "B",
      "Les chercheurs avaient promis trop (traduction automatique, raisonnement général, ...). Face à la déception, les financements ont été coupés.",
    ),
    rulesToStatistics: yesNo(
      "Les IA modernes reposent principalement sur des règles écrites à la main par des experts.",
      false,
      "Après le 2ᵉ hiver de l'IA, l'approche symbolique (règles) a laissé la place aux statistiques, puis à l'apprentissage à partir de grandes quantités de données.",
    ),
    games: yesNo(
      "Des machines ont battu les meilleurs joueurs humains aux échecs et au jeu de go.",
      true,
      "Deep Blue a battu Kasparov aux échecs en 1997 et AlphaGo a battu le champion du monde de go en 2016.",
    ),
    alexNet: choice(
      "Qu'a démontré le succès d'AlexNet en 2012 ?",
      {
        A: "Que les ordinateurs n'avaient plus besoin d'électricité",
        B: "Que les réseaux de neurones, entrainés sur de très nombreuses données, sont très efficaces",
        C: "Que les systèmes experts sont la meilleure approche",
        D: "Que l'IA peut se passer de données",
      },
      "B",
      "En remportant la compétition ImageNet, AlexNet a ouvert l'ère du « deep learning » : des réseaux de neurones entrainés sur des millions d'exemples.",
    ),
    waves: choice(
      "Comment l'IA a-t-elle progressé au cours du XXᵉ siècle ?",
      {
        A: "De manière régulière et continue",
        B: "Par vagues : périodes d'enthousiasme suivies de périodes de désintérêt",
        C: "Brutalement, uniquement en 2022",
        D: "Elle n'a pas progressé",
      },
      "B",
      "L'histoire de l'IA alterne espoirs et déceptions (les « hivers de l'IA ») avant l'explosion récente.",
    ),

    // 1.1.3 - Fonctionnement des IA
    neuralNetworkLearning: yesNo(
      "Un réseau de neurones apprend à partir d'exemples plutôt qu'en suivant des règles qu'on lui aurait programmées.",
      true,
      "On montre des exemples au réseau et il ajuste ses paramètres petit à petit. Personne n'écrit les règles : il les « découvre » à partir des données.",
    ),
    llmPrediction: choice(
      "Quel est le principe de base d'un modèle de langage (LLM) comme ChatGPT ?",
      {
        A: "Il cherche la réponse dans une encyclopédie",
        B: "Il prédit, mot après mot, la suite la plus probable d'un texte",
        C: "Il comprend le sens des mots comme un humain",
        D: "Il copie des réponses écrites à l'avance",
      },
      "B",
      "Un LLM prédit la suite d'un texte, un morceau de mot (token) après l'autre, en se basant sur ce qu'il a appris pendant son entrainement.",
    ),
    temperature: yesNo(
      "En posant exactement la même question deux fois à un LLM, on peut obtenir deux réponses différentes.",
      true,
      "À cause de la « température », le LLM ne choisit pas toujours le mot le plus probable. Ses réponses sont donc en partie imprévisibles.",
    ),
    interpolation: choice(
      "Face à une situation qu'il n'a jamais vue pendant son apprentissage, que fait un réseau de neurones ?",
      {
        A: "Il refuse toujours de répondre",
        B: "Il plante",
        C: "Il propose une réponse en s'appuyant sur les exemples qu'il connait (interpolation)",
        D: "Il demande à être réentrainé",
      },
      "C",
      "Comme pour « la huitième carte qui n'existait pas », le réseau interpole à partir de ce qu'il a appris. Cette réponse peut être juste... ou fausse.",
    ),
    gpu: choice(
      "Quel progrès matériel a rendu possible l'essor des IA actuelles ?",
      {
        A: "Les disquettes",
        B: "Les cartes graphiques capables de faire énormément de calculs en parallèle",
        C: "Les imprimantes 3D",
        D: "Les claviers sans fil",
      },
      "B",
      "Développées pour les jeux vidéo puis utilisées pour le bitcoin, les cartes graphiques (NVIDIA) permettent les calculs massivement parallèles nécessaires aux réseaux de neurones.",
    ),
    noMemory: yesNo(
      "Un LLM se souvient de vos conversations précédentes, comme un humain.",
      false,
      "Un LLM n'a pas de mémoire : à chaque message, il relit toute la discussion depuis le début. C'est un « poisson rouge ».",
    ),

    // 1.1.4 - Possibilités et limites
    science: yesNo(
      "L'IA contribue déjà à des avancées scientifiques majeures (médecine, météo, archéologie, ...).",
      true,
      "Prédiction de la structure des protéines (prix Nobel 2024), prévisions météo, aide au diagnostic, lecture de papyrus carbonisés : l'IA est déjà un outil scientifique puissant.",
    ),
    humanPlusMachine: choice(
      "Pour reconstituer des textes anciens, qui obtient les meilleurs résultats ?",
      {
        A: "L'historien seul",
        B: "La machine seule",
        C: "L'historien aidé de la machine",
        D: "Aucune différence",
      },
      "C",
      "L'humain et la machine se complètent : ensemble, ils font mieux que chacun séparément.",
    ),
    generativeTypes: yesNo(
      "L'IA générative ne sait produire que du texte.",
      false,
      "Elle produit aussi des images, des vidéos, du code, de la musique, des voix, des objets 3D, des tableaux, ...",
    ),
    tools: choice(
      "Un LLM est figé après son entrainement. Comment peut-il alors donner l'heure qu'il est maintenant ?",
      {
        A: "Il a une horloge dans son cerveau",
        B: "Il devine",
        C: "Il utilise des outils",
        D: "C'est impossible",
      },
      "C",
      "Un LLM n'apprend qu'une fois. Pour accéder à des informations actuelles, on lui donne des outils (horloge, recherche web, ...) qu'il peut appeler.",
    ),
    energy: yesNo(
      "L'entrainement et l'utilisation des LLM consomment beaucoup d'énergie.",
      true,
      "Un entrainement consomme autant que des milliers de personnes en un an, et chaque discussion a aussi un cout. Utiliser l'IA de manière raisonnée permet de réduire cet impact.",
    ),
    disruptive: choice(
      "À quoi l'arrivée de l'IA générative peut-elle être comparée ?",
      {
        A: "À un simple gadget sans conséquence",
        B: "Aux grandes ruptures technologiques comme l'imprimerie, l'électricité ou Internet",
        C: "À une mode qui va disparaitre l'année prochaine",
        D: "À rien : c'est une technologie sans précédent ni comparaison",
      },
      "B",
      "Comme le feu, l'écriture, l'imprimerie ou Internet, l'IA générative pourrait transformer profondément la société. Ses impacts restent à découvrir.",
    ),
    rebound: choice(
      "La 5G consomme moins d'énergie par Go que la 4G. Pourtant, la consommation totale a augmenté. Pourquoi ?",
      {
        A: "Parce que les mesures sont fausses",
        B: "Parce que la 5G est mal installée",
        C: "Parce que les nouvelles possibilités ont créé de nouveaux usages",
        D: "Parce que la 4G a été arrêtée",
      },
      "C",
      "C'est l'effet rebond : une technologie plus efficace encourage à consommer davantage. Une possibilité n'est pas forcément un besoin, c'est aussi vrai pour l'IA.",
    ),

    // 1.2.1 - Comparaison des LLM
    llmDifferences: yesNo(
      "Tous les LLM (ChatGPT, Gemini, Le Chat, DeepSeek, Grok, ...) donnent des réponses identiques et parfaitement neutres.",
      false,
      "Chaque LLM dépend de ses données d'entrainement et des choix de l'entreprise qui le conçoit. Leurs styles et leurs positions peuvent varier, surtout sur des sujets sensibles.",
    ),

    // 1.2.2 - Cadre légal et sécurité
    personalData: choice(
      "Selon le RGPD, qu'est-ce qu'une donnée personnelle ?",
      {
        A: "Uniquement le nom et le prénom",
        B: "Uniquement les données de santé",
        C: "Toute information se rapportant à une personne identifiée ou identifiable",
        D: "Uniquement les informations qu'une personne a publiées elle-même",
      },
      "C",
      "Une donnée personnelle est toute information qui permet, directement ou indirectement, d'identifier une personne : nom, adresse, photo, adresse IP, numéro de téléphone, ...",
    ),
    publicVsEnterprise: choice(
      "Quelle est la principale différence entre une IA grand public gratuite et une IA d'entreprise ?",
      {
        A: "L'IA d'entreprise est toujours plus intelligente",
        B: "Avec l'IA grand public, vos données peuvent servir à entrainer le modèle",
        C: "Il n'y a aucune différence",
        D: "L'IA d'entreprise peut anonymiser les prompts",
      },
      ["B", "D"],
      "Par défaut, les IA grand public peuvent réutiliser vos échanges. Les IA d'entreprise garantissent par contrat que vos données restent isolées et ne servent pas à l'entrainement. De plus, l'IA d'entreprise utilise souvent un outil d'anonymisation automatique des prompts.",
    ),
    aiAct: choice(
      "Sur quel principe repose l'AI Act européen ?",
      {
        A: "Toutes les IA sont interdites",
        B: "Toutes les IA sont autorisées sans condition",
        C: "Les obligations dépendent du niveau de risque de l'IA",
        D: "Seules les IA européennes sont autorisées",
      },
      "C",
      "L'AI Act classe les IA selon leur niveau de risque : interdites, strictement réglementées, soumises à transparence, ou libres d'utilisation.",
    ),

    // 1.2.3 - Charte et doctrine
    rightTool: yesNo(
      "L'IA générative est toujours le meilleur outil, quelle que soit la tâche.",
      false,
      "Il faut choisir l'outil le plus adapté à chaque usage : un moteur de recherche, un annuaire, une encyclopédie ou l'IA interne sont parfois plus pertinents (et moins couteux) qu'un chatbot.",
    ),
  },
};
