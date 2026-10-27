import React from "react";

import { Quiz } from "@/types";
import { QuizChoiceTrue } from "@/components/quiz/QuizChoiceTrue";
import { QuizChoiceFalse } from "@/components/quiz/QuizChoiceFalse";

export const QUIZ: Quiz = {
  id: "RGPD",
  title: "RGPD quiz",
  items: {
    europe: {
      kind: "qcm",
      question: "Le RGPD s'applique uniquement aux entreprises européennes",
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        F: "Le RGPD s'applique à toute entreprise qui traite des données de résidents européens, quelle que soit sa localisation.",
      },
    },
    consent: {
      kind: "qcm",
      question: "Le consentement doit être explicite pour collecter des données personnelles",
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: "Le RGPD exige un consentement explicite, spécifique et éclairé avant de collecter des données personnelles.",
      },
    },
    ip: {
      kind: "qcm",
      question: "Les données personnelles incluent l'adresse IP",
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: "Les adresses IP sont considérées comme des données personnelles car elles peuvent être utilisées pour identifier un individu.",
      },
    },
    dpo: {
      kind: "qcm",
      question: "Un DPO est obligatoire pour toutes les entreprises",
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        F: "Un Délégué à la Protection des Données (DPO) est obligatoire uniquement pour certaines organisations, notamment celles traitant des données sensibles à grande échelle.",
      },
    },
    oblivion: {
      kind: "qcm",
      question: "Le droit à l'oubli permet de demander l'effacement de ses données",
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: "Le droit à l'oubli (ou droit à l'effacement) permet aux individus de demander la suppression de leurs données personnelles.",
      },
    },
    breach: {
      kind: "qcm",
      question: "Une violation de données doit être signalée dans les 72 heures",
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: "Les entreprises doivent signaler les violations de données à l'autorité de contrôle dans les 72 heures suivant leur découverte.",
      },
    },
    date: {
      kind: "qcm",
      question: "Le RGPD est entré en vigueur en mai 2018",
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: "Le Règlement Général sur la Protection des Données est entré en application le 25 mai 2018 dans tous les États membres de l'UE.",
      },
    },
    health: {
      kind: "qcm",
      question: "Les données de santé sont considérées comme des données sensibles",
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: "Les données de santé font partie des catégories spéciales de données qui bénéficient d'une protection renforcée sous le RGPD.",
      },
    },
    sale: {
      kind: "qcm",
      question: "Une entreprise peut vendre les données personnelles sans consentement",
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        F: "La vente de données personnelles nécessite un consentement explicite préalable des personnes concernées.",
      },
    },
    minors: {
      kind: "qcm",
      question: "Le consentement des mineurs de moins de 16 ans doit venir des parents",
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: "Pour les mineurs de moins de 16 ans, le consentement doit être donné ou autorisé par le titulaire de la responsabilité parentale.",
      },
    },
    biometrics: {
      kind: "qcm",
      question: "Les données biométriques sont considérées comme sensibles",
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: "Les données biométriques utilisées pour identifier une personne sont classées comme sensibles et bénéficient d'une protection renforcée.",
      },
    },
    retention: {
      kind: "qcm",
      question: "Une entreprise peut conserver les données indéfiniment",
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        F: "Les données personnelles ne peuvent être conservées que pour une durée limitée, nécessaire à la finalité du traitement.",
      },
    },
    portability: {
      kind: "qcm",
      question: "Le droit à la portabilité permet de récupérer ses données",
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: "Ce droit permet aux individus de récupérer leurs données personnelles dans un format structuré et de les transférer à un autre responsable de traitement.",
      },
    },
    fines: {
      kind: "qcm",
      question: "Les amendes RGPD peuvent aller jusqu'à 20 millions d'euros",
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: "Les sanctions peuvent atteindre 20 millions d'euros ou 4% du chiffre d'affaires annuel mondial, selon le montant le plus élevé.",
      },
    },
    register: {
      kind: "qcm",
      question: "Le registre des traitements est obligatoire pour toutes les entreprises",
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        F: "Le registre des traitements est obligatoire pour les entreprises de plus de 250 employés, sauf exception pour les traitements à risque ou réguliers.",
      },
    },
  },
};
