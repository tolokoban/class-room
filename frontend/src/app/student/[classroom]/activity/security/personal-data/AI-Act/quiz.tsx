import { Risk } from "./_/Risk";
import { Quiz } from "@/types";

export const QUIZ: Quiz = {
  id: "ia-act-risques",
  title: "Les 4 niveaux de risque de l'IA Act",
  items: {
    q1: {
      kind: "qcm",
      question:
        "Un système d'IA analyse les micro-expressions faciales, le ton de la voix et la posture d'un employé dans un bureau pour évaluer son niveau de stress et de concentration quotidien au travail.",
      choices: {
        r1: <Risk value={1} />,
        r2: <Risk value={2} />,
        r3: <Risk value={3} />,
        r4: <Risk value={4} />,
      },
      answers: {
        r1: "L'IA Act interdit explicitement l'utilisation de systèmes d'IA pour déduire les émotions des personnes physiques sur le lieu de travail et dans les établissements d'enseignement (sauf motifs médicaux ou de sécurité strictement encadrés).",
      },
    },
    q2: {
      kind: "qcm",
      question:
        "Un chatbot conversationnel (assistant virtuel) est intégré sur un site e-commerce pour répondre aux questions courantes des clients, en indiquant clairement à l'utilisateur qu'il discute avec une machine.",
      choices: {
        r1: <Risk value={1} />,
        r2: <Risk value={2} />,
        r3: <Risk value={3} />,
        r4: <Risk value={4} />,
      },
      answers: {
        r3: "Les chatbots et systèmes interagissant directement avec des humains relèvent du risque limité et nécessitent principalement une obligation de transparence (informer l'utilisateur qu'il s'agit d'une IA).",
      },
    },
    q3: {
      kind: "qcm",
      question:
        "Une entreprise développe un système de notation citoyenne (social scoring) par les autorités publiques, attribuant des scores aux citoyens en fonction de leur comportement social général, menant à des discriminations injustifiées.",
      choices: {
        r1: <Risk value={1} />,
        r2: <Risk value={2} />,
        r3: <Risk value={3} />,
        r4: <Risk value={4} />,
      },
      answers: {
        r1: "L'IA Act interdit strictement les systèmes de notation citoyenne par les autorités publiques car ils constituent une menace inacceptable pour les droits fondamentaux.",
      },
    },
    q4: {
      kind: "qcm",
      question:
        "Un système d'IA est utilisé par la police pour catégoriser des individus dans une base de données en fonction de leur orientation sexuelle, de leurs convictions religieuses ou de leurs opinions politiques, en croisant leurs photos de réseaux sociaux.",
      choices: {
        r1: <Risk value={1} />,
        r2: <Risk value={2} />,
        r3: <Risk value={3} />,
        r4: <Risk value={4} />,
      },
      answers: {
        r1: "Les systèmes de catégorisation biométrique qui déduisent des données sensibles (opinions politiques, religion, orientation sexuelle, race) sont classés parmi les pratiques interdites (risque inacceptable).",
      },
    },
    q5: {
      kind: "qcm",
      question:
        "Une entreprise utilise un logiciel d'IA pour le recrutement et le filtrage automatisé des CV des candidats afin de sélectionner les profils à inviter en entretien d'embauche.",
      choices: {
        r1: <Risk value={1} />,
        r2: <Risk value={2} />,
        r3: <Risk value={3} />,
        r4: <Risk value={4} />,
      },
      answers: {
        r2: "Les systèmes d'IA utilisés dans l'emploi, la sélection et la gestion des travailleurs sont classés comme à risque élevé en raison de leur impact direct sur les opportunités professionnelles.",
      },
    },
    q6: {
      kind: "qcm",
      question:
        "Un système d'IA est déployé par la douane aux frontières pour évaluer la sincérité d'un voyageur ou prédire s'il constitue un risque migratoire lors d'un contrôle douanier.",
      choices: {
        r1: <Risk value={1} />,
        r2: <Risk value={2} />,
        r3: <Risk value={3} />,
        r4: <Risk value={4} />,
      },
      answers: {
        r2: "La gestion des frontières, du contrôle des migrations et de l'asile est répertoriée dans l'Annexe III de l'IA Act comme un domaine à risque élevé nécessitant des garanties strictes.",
      },
    },
    q7: {
      kind: "qcm",
      question:
        "Une banque commerciale déploie un système d'IA pour évaluer la solvabilité (credit scoring) des demandeurs de prêts immobiliers et déterminer leur éligibilité au crédit.",
      choices: {
        r1: <Risk value={1} />,
        r2: <Risk value={2} />,
        r3: <Risk value={3} />,
        r4: <Risk value={4} />,
      },
      answers: {
        r2: "L'évaluation de la solvabilité des personnes physiques et l'accès aux prêts financiers essentiels constituent des cas d'usage à risque élevé en raison de leur impact socio-économique.",
      },
    },
    q8: {
      kind: "qcm",
      question:
        "Une police utilise un logiciel de reconnaissance faciale en temps réel dans les espaces publics pour identifier des suspects, en dehors de situations d'urgence ciblées strictement encadrées par la loi.",
      choices: {
        r1: <Risk value={1} />,
        r2: <Risk value={2} />,
        r3: <Risk value={3} />,
        r4: <Risk value={4} />,
      },
      answers: {
        r1: "L'identification biométrique à distance en temps réel dans les espaces publics par les forces de l'ordre est par principe interdite (risque inacceptable), sauf dérogations très strictes.",
      },
    },
    q9: {
      kind: "qcm",
      question:
        "Une plateforme diffuse des contenus sous forme de 'deepfakes' (vidéos manipulées et réalistes représentant des personnes existantes) sans mentionner qu'il s'agit de contenus générés par IA.",
      choices: {
        r1: <Risk value={1} />,
        r2: <Risk value={2} />,
        r3: <Risk value={3} />,
        r4: <Risk value={4} />,
      },
      answers: {
        r3: "Les deepfakes relèvent du risque limité et sont soumis à une obligation légale de transparence : le public doit être explicite et clairement informé que le contenu est artificiel.",
      },
    },
    q10: {
      kind: "qcm",
      question:
        "Un système d'IA manipule le comportement humain via des techniques subliminales ou exploitant la vulnérabilité d'un groupe d'âge, provoquant des préjudices psychologiques graves.",
      choices: {
        r1: <Risk value={1} />,
        r2: <Risk value={2} />,
        r3: <Risk value={3} />,
        r4: <Risk value={4} />,
      },
      answers: {
        r1: "L'utilisation de techniques subliminales ou le ciblage trompeur exploitant des vulnérabilités pour altérer le comportement d'une personne est banni (risque inacceptable).",
      },
    },
    q11: {
      kind: "qcm",
      question:
        "Un système d'IA est utilisé par un hôpital public pour trier les patients aux urgences et prioriser les soins en fonction de leur gravité médicale.",
      choices: {
        r1: <Risk value={1} />,
        r2: <Risk value={2} />,
        r3: <Risk value={3} />,
        r4: <Risk value={4} />,
      },
      answers: {
        r2: "L'utilisation de l'IA dans la gestion des services d'urgence médicale et les infrastructures essentielles entre dans la catégorie des IA à risque élevé.",
      },
    },
    q12: {
      kind: "qcm",
      question:
        "Une commune met en place un algorithme d'IA qui analyse en continu les vidéos de caméra de surveillance pour constituer une base de données de reconnaissance faciale en extrayant systématiquement les visages enregistrés (facial scraping).",
      choices: {
        r1: <Risk value={1} />,
        r2: <Risk value={2} />,
        r3: <Risk value={3} />,
        r4: <Risk value={4} />,
      },
      answers: {
        r1: "La constitution non ciblée de bases de données de reconnaissance faciale par l'extraction d'images faciales depuis internet ou des caméras de surveillance (scraping) est formellement interdite par l'IA Act.",
      },
    },
    q13: {
      kind: "qcm",
      question:
        "Un établissement d'enseignement supérieur utilise un logiciel d'IA pour évaluer les examens d'admission des étudiants et décider automatiquement de leur acceptation ou exclusion.",
      choices: {
        r1: <Risk value={1} />,
        r2: <Risk value={2} />,
        r3: <Risk value={3} />,
        r4: <Risk value={4} />,
      },
      answers: {
        r2: "L'évaluation et la sélection des candidats à l'entrée dans des établissements d'enseignement sont classées parmi les applications d'IA à risque élevé.",
      },
    },
    q14: {
      kind: "qcm",
      question:
        "Un service de police utilise un système d'IA de profilage criminel pour évaluer le risque qu'un individu commette une infraction à l'avenir, uniquement basé sur son profil comportemental ou démographique.",
      choices: {
        r1: <Risk value={1} />,
        r2: <Risk value={2} />,
        r3: <Risk value={3} />,
        r4: <Risk value={4} />,
      },
      answers: {
        r1: "L'évaluation prédictive du risque de criminalité individuelle fondée uniquement sur le profilage ou des caractéristiques personnelles est interdite par l'IA Act.",
      },
    },
    q15: {
      kind: "qcm",
      question:
        "Suite à une autorisation judiciaire préalable et stricte dans le cadre de la recherche ciblée d'un suspect recherché pour un crime très grave, la police déploie temporairement un système de reconnaissance faciale en temps réel dans une zone publique circonscrite.",
      choices: {
        r1: <Risk value={1} />,
        r2: <Risk value={2} />,
        r3: <Risk value={3} />,
        r4: <Risk value={4} />,
      },
      answers: {
        r2: "Bien que l'utilisation de la reconnaissance faciale en temps réel dans l'espace public soit par principe interdite (risque inacceptable), l'IA Act prévoit des exceptions très strictes (recherche de crimes graves, prévention d'une menace terroriste imminente) soumises à autorisation judiciaire préalable. Dans ce cadre précis, le système n'est pas interdit mais classé comme à risque élevé.",
      },
    },
  },
};
