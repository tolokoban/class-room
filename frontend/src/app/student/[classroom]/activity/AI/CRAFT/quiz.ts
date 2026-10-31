import { Quiz } from "@/types";

export const QUIZ: Quiz = {
  id: "craft-methodology-territorial-ai",
  title: "Quiz : Identifier les principes CRAFT dans les prompts du secteur public",
  items: {
    q2: {
      kind: "qcm",
      question: `En tant que directeur des ressources humaines de la communauté de communes, je te demande de rédiger la note interne visant à informer l'ensemble des agents de la généralisation du télétravail dès le mois prochain.`,
      choices: {
        C: "**C**ontexte",
        R: "**R**ôle (identité)",
        A: "**A**ction",
        F: "**F**ormat",
        T: "**T**on",
      },
      answers: {
        R: "Le rôle est donné (« En tant que directeur des ressources humaines de la communauté de communes »).",
        A: "L'action est claire (« rédiger la note interne visant à informer l'ensemble des agents... »).",
      },
    },
    q3: {
      kind: "qcm",
      question: `Notre commune traverse une période de sécheresse estivale sévère et nous devons inciter les résidents à réduire leur consommation d'eau potable.

Mets-toi dans la peau d'un chargé de mission transition écologique et rédige un communiqué de presse destiné au journal local.

Ton texte doit conserver un ton sérieux, factuel et pédagogue.`,
      choices: {
        C: "**C**ontexte",
        R: "**R**ôle (identité)",
        A: "**A**ction",
        F: "**F**ormat",
        T: "**T**on",
      },
      answers: {
        C: "Le contexte est bien posé (« Notre commune traverse une période de sécheresse estivale sévère... »).",
        R: "Le rôle est assigné (« Mets-toi dans la peau d'un chargé de mission transition écologique »).",
        A: "L'action est formulée (« rédige un communiqué de presse »).",
        T: "Le ton est exigé (« Ton texte doit conserver un ton sérieux, factuel et pédagogue »).",
      },
    },
    q1: {
      kind: "qcm",
      question: `Agis en tant que community manager aguerri de la métropole.

Nous lançons une nouvelle application mobile citoyenne permettant aux habitants de signaler les incivilités et les dégradations de voirie.

Rédige un post d'annonce pour notre page LinkedIn respectant les contraintes suivantes :
- 150 mots maximum
- 3 hashtags pertinents
- Un appel à l'action clair

Adopte un ton dynamique, bienveillant et engageant.`,
      choices: {
        C: "**C**ontexte",
        R: "**R**ôle (identité)",
        A: "**A**ction",
        F: "**F**ormat",
        T: "**T**on",
      },
      answers: {
        C: "Le contexte est précisé (« Nous lançons une nouvelle application mobile citoyenne... »).",
        R: "Le rôle est clairement assigné (« Agis en tant que community manager aguerri de la métropole »).",
        A: "L'action à réaliser est explicite (« Rédige un post d'annonce pour notre page LinkedIn »).",
        F: "Le format est contraint (« 150 mots maximum, 3 hashtags pertinents, un appel à l'action »).",
        T: "Le ton est directement indiqué (« Adopte un ton dynamique, bienveillant et engageant »).",
      },
    },
    q4: {
      kind: "qcm",
      question: `Présente sous la forme d'un tableau comparatif à 3 colonnes (*Avantages*, *Inconvénients*, *Coût estimé*) une analyse d'opportunité pour l'installation de panneaux photovoltaïques sur le toit de l'Hôtel de Ville.`,
      choices: {
        C: "**C**ontexte",
        R: "**R**ôle (identité)",
        A: "**A**ction",
        F: "**F**ormat",
        T: "**T**on",
      },
      answers: {
        A: "L'action est claire (« Présente [...] une analyse d'opportunité... »).",
        F: "Le format est précisément structuré (« sous la forme d'un tableau comparatif à 3 colonnes »).",
      },
    },
    q5: {
      kind: "qcm",
      question: `Tu incarnes un médiateur culturel passionné au sein d'un office de tourisme intercommunal.

Conçois une foire aux questions (FAQ) à destination des visiteurs étrangers découvrant notre patrimoine cet été.

Organise le contenu sous forme de liste à puces synthétique, avec un style chaleureux, accueillant et très accessible.`,
      choices: {
        C: "**C**ontexte",
        R: "**R**ôle (identité)",
        A: "**A**ction",
        F: "**F**ormat",
        T: "**T**on",
      },
      answers: {
        R: "Le rôle est clairement établi (« Tu incarnes un médiateur culturel passionné... »).",
        A: "L'action est définie (« Conçois une foire aux questions (FAQ) »).",
        F: "Le format est précisé (« sous forme de liste à puces synthétique »).",
        T: "Le ton est explicité (« avec un style chaleureux, accueillant et très accessible »).",
      },
    },
    q6: {
      kind: "qcm",
      question: `Des travaux de réfection du réseau d'eau vont paralyser la rue de la République du 15 au 30 novembre, entraînant l'interdiction du stationnement et la déviation des navettes de centre-ville.

Rédige une lettre d'information destinée à être distribuée dans les boîtes aux lettres des riverains du quartier.`,
      choices: {
        C: "**C**ontexte",
        R: "**R**ôle (identité)",
        A: "**A**ction",
        F: "**F**ormat",
        T: "**T**on",
      },
      answers: {
        C: "Le contexte est précis et détaillé (« Des travaux de réfection [...] vont paralyser la rue de la République... »).",
        A: "L'action est explicite (« Rédige une lettre d'information »).",
      },
    },
    q7: {
      kind: "qcm",
      question: `Prends la posture d'un expert en finances locales.

Pour aider le conseil municipal à préparer le prochain débat d'orientations budgétaires, rédige une note de synthèse d'exactement 3 paragraphes afin d'analyser l'évolution des dépenses d'investissement de la commune sur les 3 derniers exercices.`,
      choices: {
        C: "**C**ontexte",
        R: "**R**ôle (identité)",
        A: "**A**ction",
        F: "**F**ormat",
        T: "**T**on",
      },
      answers: {
        C: "Le contexte organisationnel est énoncé (« Pour aider le conseil municipal à préparer le prochain débat d'orientations budgétaires... »).",
        R: "Le rôle est précisé (« Prends la posture d'un expert en finances locales »).",
        A: "L'action est claire (« rédige une note de synthèse [...] afin d'analyser l'évolution des dépenses... »).",
        F: "Le format est strict (« d'exactement 3 paragraphes »).",
      },
    },
    q8: {
      kind: "qcm",
      question: `À l'occasion de l'inauguration du nouveau pôle de santé pluriprofessionnel de l'agglomération, prépare la trame d'allocution de 5 minutes que prononcera Monsieur le Maire devant les professionnels de santé et la presse.

Adopte un ton solennel, rassembleur et résolument optimiste.`,
      choices: {
        C: "**C**ontexte",
        R: "**R**ôle (identité)",
        A: "**A**ction",
        F: "**F**ormat",
        T: "**T**on",
      },
      answers: {
        C: "Le contexte est posé (« À l'occasion de l'inauguration du nouveau pôle de santé... »).",
        A: "L'action est claire (« prépare la trame d'allocution [...] que prononcera Monsieur le Maire »).",
        F: "Le format est cadré par une contrainte de durée (« de 5 minutes »).",
        T: "Le ton est qualifié (« Adopte un ton solennel, rassembleur et résolument optimiste »).",
      },
    },
    q9: {
      kind: "qcm",
      question: `Dans le cadre de l'organisation du marché de Noël, nous devons relancer les artisans locaux qui n'ont pas encore retourné leur dossier d'inscription.

En tant que chargé du développement économique, rédige un e-mail de relance prêt à l'envoi.

Le courriel doit respecter la structure suivante :
- Un objet percutant
- Une salutation formelle
- Un récapitulatif des 3 pièces justificatives manquantes sous forme de liste à puces

Conserve une tonalité courtoise mais ferme.`,
      choices: {
        C: "**C**ontexte",
        R: "**R**ôle (identité)",
        A: "**A**ction",
        F: "**F**ormat",
        T: "**T**on",
      },
      answers: {
        C: "Le contexte de travail est précisé (« Dans le cadre de l'organisation du marché de Noël... »).",
        R: "Le rôle est clairement identifié (« En tant que chargé du développement économique »).",
        A: "L'action d'envoi par courriel est demandée (« rédige un e-mail de relance prêt à l'envoi »).",
        F: "Le format du mail est détaillé (objet, salutation, liste à puces avec 3 pièces).",
        T: "Le ton est spécifié (« courtoise mais ferme »).",
      },
    },
    q10: {
      kind: "qcm",
      question: `Suite à une coupure d'eau imprévue dans le quartier de la gare due à une rupture de canalisation ce matin :

Prépare la publication d'urgence à poster directement sur le compte Facebook de la ville pour avertir les résidents.

Le texte doit être direct et rassurer la population sur l'intervention des équipes techniques en cours.`,
      choices: {
        C: "**C**ontexte",
        R: "**R**ôle (identité)",
        A: "**A**ction",
        F: "**F**ormat",
        T: "**T**on",
      },
      answers: {
        C: "Le contexte d'urgence est clair (« Suite à une coupure d'eau imprévue dans le quartier de la gare... »).",
        A: "L'action de publication directe est énoncée (« prépare la publication d'urgence à poster directement sur le compte Facebook »).",
        T: "Le ton de la communication est indiqué (« Le texte doit être direct et rassurer la population... »).",
      },
    },
  },
};
