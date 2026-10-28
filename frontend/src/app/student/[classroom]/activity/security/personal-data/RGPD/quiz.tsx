import React from "react";

import { Quiz } from "@/types";
import { QuizChoiceTrue } from "@/components/quiz/QuizChoiceTrue";
import { QuizChoiceFalse } from "@/components/quiz/QuizChoiceFalse";

export const QUIZ: Quiz = {
  id: "RGPD",
  title: {
    fr: "Règlement Général sur la Protection des Données (RGPD)",
    en: "General Data Protection Regulation (GDPR)",
    de: "Datenschutz-Grundverordnung (DSGVO)",
    it: "Regolamento Generale sulla Protezione dei Dati (GDPR)",
  },
  items: {
    europe: {
      kind: "qcm",
      question: {
        fr: "Le RGPD s'applique uniquement aux entreprises européennes",
        en: "The GDPR only applies to European companies",
        de: "Die DSGVO gilt nur für europäische Unternehmen",
        it: "Il GDPR si applica solo alle aziende europee",
      },
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        F: {
          fr: "Le RGPD s'applique à toute entreprise qui traite des données de résidents européens, quelle que soit sa localisation.",
          en: "The GDPR applies to any company that processes data of European residents, wherever it is located.",
          de: "Die DSGVO gilt für jedes Unternehmen, das Daten von in Europa ansässigen Personen verarbeitet, unabhängig von seinem Standort.",
          it: "Il GDPR si applica a qualsiasi azienda che tratta dati di residenti europei, indipendentemente dalla sua sede.",
        },
      },
    },
    consent: {
      kind: "qcm",
      question: {
        fr: "Le consentement doit être explicite pour collecter des données personnelles",
        en: "Consent must be explicit to collect personal data",
        de: "Für die Erhebung personenbezogener Daten muss die Einwilligung ausdrücklich erfolgen",
        it: "Il consenso deve essere esplicito per raccogliere dati personali",
      },
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: {
          fr: "Le RGPD exige un consentement explicite, spécifique et éclairé avant de collecter des données personnelles.",
          en: "The GDPR requires explicit, specific and informed consent before collecting personal data.",
          de: "Die DSGVO verlangt eine ausdrückliche, spezifische und informierte Einwilligung vor der Erhebung personenbezogener Daten.",
          it: "Il GDPR richiede un consenso esplicito, specifico e informato prima di raccogliere dati personali.",
        },
      },
    },
    ip: {
      kind: "qcm",
      question: {
        fr: "Les données personnelles incluent l'adresse IP",
        en: "Personal data includes the IP address",
        de: "Zu den personenbezogenen Daten gehört die IP-Adresse",
        it: "I dati personali includono l'indirizzo IP",
      },
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: {
          fr: "Les adresses IP sont considérées comme des données personnelles car elles peuvent être utilisées pour identifier un individu.",
          en: "IP addresses are considered personal data because they can be used to identify an individual.",
          de: "IP-Adressen gelten als personenbezogene Daten, da sie zur Identifizierung einer Person verwendet werden können.",
          it: "Gli indirizzi IP sono considerati dati personali perché possono essere utilizzati per identificare un individuo.",
        },
      },
    },
    dpo: {
      kind: "qcm",
      question: {
        fr: "Un DPO (Data Protection Officer) est obligatoire pour toutes les entreprises",
        en: "A DPO (Data Protection Officer) is mandatory for all companies",
        de: "Ein Datenschutzbeauftragter ist für alle Unternehmen verpflichtend",
        it: "Un DPO (Data Protection Officer) è obbligatorio per tutte le aziende",
      },
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        F: {
          fr: "Un Délégué à la Protection des Données (DPO) est obligatoire uniquement pour certaines organisations, notamment celles traitant des données sensibles à grande échelle.",
          en: "A Data Protection Officer (DPO) is only mandatory for certain organisations, especially those processing sensitive data on a large scale.",
          de: "Ein Datenschutzbeauftragter (DSB) ist nur für bestimmte Organisationen verpflichtend, insbesondere für solche, die sensible Daten in großem Umfang verarbeiten.",
          it: "Un Responsabile della Protezione dei Dati (DPO) è obbligatorio solo per alcune organizzazioni, in particolare quelle che trattano dati sensibili su larga scala.",
        },
      },
    },
    oblivion: {
      kind: "qcm",
      question: {
        fr: "Le droit à l'oubli permet de demander l'effacement de ses données",
        en: "The right to be forgotten allows you to request the erasure of your data",
        de: "Das Recht auf Vergessenwerden erlaubt es, die Löschung der eigenen Daten zu verlangen",
        it: "Il diritto all'oblio permette di chiedere la cancellazione dei propri dati",
      },
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: {
          fr: "Le droit à l'oubli (ou droit à l'effacement) permet aux individus de demander la suppression de leurs données personnelles.",
          en: "The right to be forgotten (or right to erasure) allows individuals to request the deletion of their personal data.",
          de: "Das Recht auf Vergessenwerden (oder Recht auf Löschung) erlaubt es Personen, die Löschung ihrer personenbezogenen Daten zu verlangen.",
          it: "Il diritto all'oblio (o diritto alla cancellazione) permette alle persone di chiedere la cancellazione dei propri dati personali.",
        },
      },
    },
    breach: {
      kind: "qcm",
      question: {
        fr: "Une violation de données doit être signalée dans les 72 heures",
        en: "A data breach must be reported within 72 hours",
        de: "Eine Datenschutzverletzung muss innerhalb von 72 Stunden gemeldet werden",
        it: "Una violazione dei dati deve essere segnalata entro 72 ore",
      },
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: {
          fr: "Les entreprises doivent signaler les violations de données à l'autorité de contrôle dans les 72 heures suivant leur découverte.",
          en: "Companies must report data breaches to the supervisory authority within 72 hours of becoming aware of them.",
          de: "Unternehmen müssen Datenschutzverletzungen innerhalb von 72 Stunden nach Bekanntwerden der Aufsichtsbehörde melden.",
          it: "Le aziende devono segnalare le violazioni dei dati all'autorità di controllo entro 72 ore dalla loro scoperta.",
        },
      },
    },
    date: {
      kind: "qcm",
      question: {
        fr: "Le RGPD est entré en vigueur en mai 2018",
        en: "The GDPR came into force in May 2018",
        de: "Die DSGVO ist im Mai 2018 in Kraft getreten",
        it: "Il GDPR è entrato in vigore nel maggio 2018",
      },
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: {
          fr: "Le Règlement Général sur la Protection des Données est entré en application le 25 mai 2018 dans tous les États membres de l'UE.",
          en: "The General Data Protection Regulation became applicable on 25 May 2018 in all EU member states.",
          de: "Die Datenschutz-Grundverordnung ist am 25. Mai 2018 in allen EU-Mitgliedstaaten anwendbar geworden.",
          it: "Il Regolamento Generale sulla Protezione dei Dati è diventato applicabile il 25 maggio 2018 in tutti gli Stati membri dell'UE.",
        },
      },
    },
    health: {
      kind: "qcm",
      question: {
        fr: "Les données de santé sont considérées comme des données sensibles",
        en: "Health data is considered sensitive data",
        de: "Gesundheitsdaten gelten als sensible Daten",
        it: "I dati sanitari sono considerati dati sensibili",
      },
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: {
          fr: "Les données de santé font partie des catégories spéciales de données qui bénéficient d'une protection renforcée sous le RGPD.",
          en: "Health data belongs to the special categories of data that enjoy enhanced protection under the GDPR.",
          de: "Gesundheitsdaten gehören zu den besonderen Kategorien von Daten, die unter der DSGVO einen verstärkten Schutz genießen.",
          it: "I dati sanitari rientrano nelle categorie particolari di dati che godono di una protezione rafforzata ai sensi del GDPR.",
        },
      },
    },
    sale: {
      kind: "qcm",
      question: {
        fr: "Une entreprise peut vendre les données personnelles sans consentement",
        en: "A company can sell personal data without consent",
        de: "Ein Unternehmen darf personenbezogene Daten ohne Einwilligung verkaufen",
        it: "Un'azienda può vendere dati personali senza consenso",
      },
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        F: {
          fr: "La vente de données personnelles nécessite un consentement explicite préalable des personnes concernées.",
          en: "Selling personal data requires the prior explicit consent of the people concerned.",
          de: "Der Verkauf personenbezogener Daten erfordert die vorherige ausdrückliche Einwilligung der betroffenen Personen.",
          it: "La vendita di dati personali richiede il previo consenso esplicito delle persone interessate.",
        },
      },
    },
    minors: {
      kind: "qcm",
      question: {
        fr: "Le consentement des mineurs de moins de 16 ans doit venir des parents",
        en: "Consent for minors under 16 must come from the parents",
        de: "Bei Minderjährigen unter 16 Jahren muss die Einwilligung von den Eltern kommen",
        it: "Il consenso per i minori di 16 anni deve provenire dai genitori",
      },
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: {
          fr: "Pour les mineurs de moins de 16 ans, le consentement doit être donné ou autorisé par le titulaire de la responsabilité parentale.",
          en: "For minors under 16, consent must be given or authorised by the holder of parental responsibility.",
          de: "Bei Minderjährigen unter 16 Jahren muss die Einwilligung vom Träger der elterlichen Verantwortung erteilt oder genehmigt werden.",
          it: "Per i minori di 16 anni, il consenso deve essere dato o autorizzato dal titolare della responsabilità genitoriale.",
        },
      },
    },
    biometrics: {
      kind: "qcm",
      question: {
        fr: "Les données biométriques sont considérées comme sensibles",
        en: "Biometric data is considered sensitive",
        de: "Biometrische Daten gelten als sensibel",
        it: "I dati biometrici sono considerati sensibili",
      },
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: {
          fr: "Les données biométriques utilisées pour identifier une personne sont classées comme sensibles et bénéficient d'une protection renforcée.",
          en: "Biometric data used to identify a person is classified as sensitive and enjoys enhanced protection.",
          de: "Biometrische Daten, die zur Identifizierung einer Person verwendet werden, gelten als sensibel und genießen einen verstärkten Schutz.",
          it: "I dati biometrici utilizzati per identificare una persona sono classificati come sensibili e godono di una protezione rafforzata.",
        },
      },
    },
    retention: {
      kind: "qcm",
      question: {
        fr: "Une entreprise peut conserver les données indéfiniment",
        en: "A company can keep data indefinitely",
        de: "Ein Unternehmen darf Daten unbegrenzt aufbewahren",
        it: "Un'azienda può conservare i dati a tempo indeterminato",
      },
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        F: {
          fr: "Les données personnelles ne peuvent être conservées que pour une durée limitée, nécessaire à la finalité du traitement.",
          en: "Personal data may only be kept for a limited period, as required for the purpose of the processing.",
          de: "Personenbezogene Daten dürfen nur für einen begrenzten Zeitraum aufbewahrt werden, der für den Zweck der Verarbeitung erforderlich ist.",
          it: "I dati personali possono essere conservati solo per un periodo limitato, necessario alla finalità del trattamento.",
        },
      },
    },
    portability: {
      kind: "qcm",
      question: {
        fr: "Le droit à la portabilité permet de récupérer ses données",
        en: "The right to data portability allows you to retrieve your data",
        de: "Das Recht auf Datenübertragbarkeit erlaubt es, die eigenen Daten zu erhalten",
        it: "Il diritto alla portabilità permette di recuperare i propri dati",
      },
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: {
          fr: "Ce droit permet aux individus de récupérer leurs données personnelles dans un format structuré et de les transférer à un autre responsable de traitement.",
          en: "This right allows individuals to retrieve their personal data in a structured format and transfer it to another data controller.",
          de: "Dieses Recht erlaubt es Personen, ihre personenbezogenen Daten in einem strukturierten Format zu erhalten und sie einem anderen Verantwortlichen zu übermitteln.",
          it: "Questo diritto permette alle persone di recuperare i propri dati personali in un formato strutturato e di trasferirli a un altro titolare del trattamento.",
        },
      },
    },
    fines: {
      kind: "qcm",
      question: {
        fr: "Les amendes RGPD peuvent aller jusqu'à 20 millions d'euros",
        en: "GDPR fines can reach up to 20 million euros",
        de: "DSGVO-Bußgelder können bis zu 20 Millionen Euro betragen",
        it: "Le sanzioni GDPR possono arrivare fino a 20 milioni di euro",
      },
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        T: {
          fr: "Les sanctions peuvent atteindre 20 millions d'euros ou 4% du chiffre d'affaires annuel mondial, selon le montant le plus élevé.",
          en: "Fines can reach 20 million euros or 4% of annual worldwide turnover, whichever is higher.",
          de: "Die Sanktionen können 20 Millionen Euro oder 4 % des weltweiten Jahresumsatzes erreichen, je nachdem, welcher Betrag höher ist.",
          it: "Le sanzioni possono raggiungere 20 milioni di euro o il 4% del fatturato mondiale annuo, a seconda di quale importo sia più elevato.",
        },
      },
    },
    register: {
      kind: "qcm",
      question: {
        fr: "Le registre des traitements est obligatoire pour toutes les entreprises",
        en: "The record of processing activities is mandatory for all companies",
        de: "Das Verzeichnis von Verarbeitungstätigkeiten ist für alle Unternehmen verpflichtend",
        it: "Il registro dei trattamenti è obbligatorio per tutte le aziende",
      },
      choices: {
        T: <QuizChoiceTrue />,
        F: <QuizChoiceFalse />,
      },
      answers: {
        F: {
          fr: "Le registre des traitements est obligatoire pour les entreprises de plus de 250 employés, sauf exception pour les traitements à risque ou réguliers.",
          en: "The record of processing activities is mandatory for companies with more than 250 employees, with exceptions for risky or regular processing.",
          de: "Das Verzeichnis von Verarbeitungstätigkeiten ist für Unternehmen mit mehr als 250 Beschäftigten verpflichtend, mit Ausnahmen für risikobehaftete oder regelmäßige Verarbeitungen.",
          it: "Il registro dei trattamenti è obbligatorio per le aziende con più di 250 dipendenti, salvo eccezioni per i trattamenti a rischio o regolari.",
        },
      },
    },
  },
};
