import { Quiz } from "@/types";

export const QUIZ: Quiz = {
  id: "choix-outils-numeriques-agents",
  title: {
    fr: "Sélection du bon outil en milieu professionnel",
  },
  items: {
    q1: {
      kind: "qcm",
      question: {
        fr: "Vous souhaitez chercher en toute confidentialité, sans que vos requêtes professionnelles ne soient pistées, profilées ou utilisées pour du ciblage publicitaire, une information générale sur le web. Quel outil privilégiez-vous ?",
      },
      choices: {
        ddg: "DuckDuckGo",
        google: "Google",
        wiki: "Wikipedia",
        pj: "Pages Jaunes",
        ai: "Claude, Gemini, ...",
        internal: "IA interne de l'entreprise",
      },
      answers: {
        ddg: {
          fr: `DuckDuckGo est le meilleur choix ici car il garantit une confidentialité stricte en ne suivant pas l'historique de navigation et en ne revendant pas vos données personnelles à des régies publicitaires.

- À l'inverse, Google collecte et profile vos données de recherche.
- Wikipedia est une encyclopédie et non un moteur de recherche généraliste.
- Les Pages Jaunes se limitent à l'annuaire professionnel local.
- Les IA (publiques ou internes) ne sont pas des moteurs de recherche web généralistes axés sur la navigation neutre et anonyme de sites internet.
`,
        },
      },
    },
    q2: {
      kind: "qcm",
      question: {
        fr: "Vous devez rapidement trouver l'adresse exacte et les horaires d'ouverture d'un prestataire externe indépendant dont l'établissement est situé dans une commune voisine. Quel outil utilisez-vous en premier ?",
      },
      choices: {
        ddg: "DuckDuckGo",
        google: "Google",
        wiki: "Wikipedia",
        pj: "Pages Jaunes",
        ai: "Claude, Gemini, ...",
        internal: "IA interne de l'entreprise",
      },
      answers: {
        pj: {
          fr: `Les Pages Jaunes constituent l'outil de référence et le plus direct pour trouver rapidement les coordonnées géographiques, les numéros de téléphone et les horaires physiques d'entreprises locales.

- Google propose aussi des informations de ce type mais avec un tracking publicitaire invasif.
- DuckDuckGo n'est pas spécialisé dans l'annuaire d'entreprises locales.
- Wikipedia ne répertorie pas les commerces ou artisans de proximité.
- Les IA publiques ou l'IA interne n'ont pas vocation à servir d'annuaire commercial de contacts.
`,
        },
      },
    },
    q3: {
      kind: "qcm",
      question: {
        fr: "Vous souhaitez comparer les chiffres précis de la dernière étude sur le taux de valorisation des déchets issus de votre rapport interne 2025 avec les actions de prévention réalisées (105 actions). Quel est l'outil idéal ?",
      },
      choices: {
        ddg: "DuckDuckGo",
        google: "Google",
        wiki: "Wikipedia",
        pj: "Pages Jaunes",
        ai: "Claude, Gemini, ...",
        internal: "IA interne de l'entreprise",
      },
      answers: {
        internal: {
          fr: `L'IA interne de l'entreprise est la seule à disposer de RAG connectés aux documents internes et rapports stratégiques de la structure. Elle préserve l'anonymat et respecte le RGPD en évitant de fuiter des données sensibles ou internes sur le web public.

- DuckDuckGo, Google et Wikipedia ne possèdent aucune connaissance de vos documents internes confidentiels.
- Les Pages Jaunes et les IA publiques (Claude, Gemini) ne sont pas connectées à votre base documentaire interne et risqueraient de violer la confidentialité des données.
`,
        },
      },
    },
    q4: {
      kind: "qcm",
      question: {
        fr: "Pour alimenter une note de synthèse transversale, vous avez besoin de comprendre rapidement l'origine historique, les principes scientifiques et les grands concepts d'une technologie publique de transport (par exemple, le fonctionnement général des lignes de tramway). Quel outil consultez-vous ?",
      },
      choices: {
        ddg: "DuckDuckGo",
        google: "Google",
        wiki: "Wikipedia",
        pj: "Pages Jaunes",
        ai: "Claude, Gemini, ...",
        internal: "IA interne de l'entreprise",
      },
      answers: {
        wiki: {
          fr: `Wikipedia est l'encyclopédie collaborative idéale pour acquérir des définitions encyclopédiques, neutres et documentées sur des notions techniques ou historiques générales.

- Les moteurs de recherche comme Google ou DuckDuckGo vous renverraient vers des milliers de liens épars sans synthèse structurée.
- Les Pages Jaunes sont hors sujet.
- Claude ou Gemini peuvent produire une synthèse rapide, mais ils peuvent inventer des faits ou des dates (hallucinations) sans citer de sources vérifiables. Pour une note de synthèse, il faut des informations fiables et sourcées, ce que Wikipedia fournit grâce à ses références.
- L'IA interne est réservée aux données internes de la structure et non aux connaissances encyclopédiques universelles.
`,
        },
      },
    },
    q5: {
      kind: "qcm",
      question: {
        fr: "Vous souhaitez rédiger un e-mail professionnel argumenté et structuré à partir d'un ensemble de notes brutes de réunion, en reformulant le tout sur un ton diplomatique et constructif. Quel outil utilisez-vous ?",
      },
      choices: {
        ddg: "DuckDuckGo",
        google: "Google",
        wiki: "Wikipedia",
        pj: "Pages Jaunes",
        ai: "Claude, Gemini, ...",
        internal: "IA interne de l'entreprise",
      },
      answers: {
        ai: {
          fr: `Claude ou Gemini sont d'excellents assistants conversationnels pour la rédaction, la reformulation, la synthèse et la mise en forme de textes généraux non confidentiels.

- L'IA interne aurait pu convenir si le document contenait des secrets d'entreprise, mais pour de la mise en forme pure sans données stratégiques, une IA générale externe convient.
- Google, DuckDuckGo, Wikipedia et les Pages Jaunes ne sont pas des assistants génératifs capables de rédiger ou de restructurer un texte à votre place.
`,
        },
      },
    },
    q6: {
      kind: "qcm",
      question: {
        fr: "Vous cherchez à effectuer une veille exhaustive sur un sujet d'actualité nationale en comparant de multiples sources journalistiques grand public, tout en acceptant d'utiliser un outil grand public ultra-performant pour indexer l'ensemble du web ouvert. Quel outil choisissez-vous ?",
      },
      choices: {
        ddg: "DuckDuckGo",
        google: "Google",
        wiki: "Wikipedia",
        pj: "Pages Jaunes",
        ai: "Claude, Gemini, ...",
        internal: "IA interne de l'entreprise",
      },
      answers: {
        google: {
          fr: `Google possède l'index de recherche web ouvert le plus vaste et performant pour effectuer une veille globale sur Internet.

- DuckDuckGo offre une meilleure confidentialité mais un index parfois moins exhaustif pour des recherches très pointues sur le web.
- Wikipedia est une encyclopédie et non un moteur de recherche d'actualités.
- Les Pages Jaunes se limitent aux professionnels locaux.
- Les IA ne remplacent pas un moteur de recherche web pour explorer de multiples articles de presse récents en parallèle.
`,
        },
      },
    },
    q7: {
      kind: "qcm",
      question: {
        fr: "Vous devez vérifier les conditions d'éligibilité exactes, les numéros de contact et les procédures indiquées sur la page web publique concernant l'aide 'Rénover son logement avec France Renov'' afin de renseigner un usager. Quel outil de recherche web utilisez-vous ?",
      },
      choices: {
        ddg: "DuckDuckGo",
        google: "Google",
        wiki: "Wikipedia",
        pj: "Pages Jaunes",
        ai: "Claude, Gemini, ...",
        internal: "IA interne de l'entreprise",
      },
      answers: {
        ddg: {
          fr: `DuckDuckGo permet de mener cette recherche sur le web public en toute neutralité et sans traçage publicitaire intrusif.

- Google permettrait aussi de trouver la page, mais au prix d'un profilage de vos recherches professionnelles.
- Wikipedia n'héberge pas les fiches pratiques administratives locales.
- Les Pages Jaunes ne recensent pas les dispositifs publics de rénovation de l'habitat.
- Les IA ne sont pas des moteurs de recherche web transactionnels ou de navigation directe.
`,
        },
      },
    },
    q8: {
      kind: "qcm",
      question: {
        fr: "Un administré vous contacte en urgence pour connaître les horaires de l'Escale et l'accompagnement pour l'accueil des personnes sans résidence stable. Vous souhaitez vérifier rapidement l'information sur le site web public de la collectivité. Quel moteur choisissez-vous ?",
      },
      choices: {
        ddg: "DuckDuckGo",
        google: "Google",
        wiki: "Wikipedia",
        pj: "Pages Jaunes",
        ai: "Claude, Gemini, ...",
        internal: "IA interne de l'entreprise",
      },
      answers: {
        google: {
          fr: `Google permet de localiser et d'accéder instantanément à la page web officielle recherchée grâce à ses algorithmes de pertinence géographique très rapides.

- DuckDuckGo est une alternative valable mais parfois moins directe sur le ciblage local précis.
- Wikipedia, les Pages Jaunes et les IA ne sont pas des moteurs de recherche web adaptés pour retrouver une page institutionnelle spécifique par mots-clés.
`,
        },
      },
    },
    q9: {
      kind: "qcm",
      question: {
        fr: "Vous préparez un dossier technique et vous avez besoin d'informations pointue sur l'hydraulique urbaine et la gestion des réseaux d'assainissement mentionnées dans les fiches de poste et compétences techniques internes. Quel outil interrogez-vous ?",
      },
      choices: {
        ddg: "DuckDuckGo",
        google: "Google",
        wiki: "Wikipedia",
        pj: "Pages Jaunes",
        ai: "Claude, Gemini, ...",
        internal: "IA interne de l'entreprise",
      },
      answers: {
        internal: {
          fr: `L'IA interne de l'entreprise est la seule solution adaptée car elle exploite les RAG et documents administratifs internes (fiches de poste, procédures techniques) tout en préservant strictement l'anonymat et les règles européennes du RGPD.

- Les outils publics comme Google, DuckDuckGo ou Wikipedia ne contiennent pas ces documents internes confidentiels.
- Les Pages Jaunes ou les IA publiques ne doivent pas être utilisées pour manipuler des données internes ou des profils de postes de la structure.
`,
        },
      },
    },
    q10: {
      kind: "qcm",
      question: {
        fr: "Vous souhaitez trouver le numéro de téléphone et l'adresse physique d'un artisan local spécialisé dans la maintenance de bâtiments pour effectuer un devis rapide. Quel outil utilisez-vous ?",
      },
      choices: {
        ddg: "DuckDuckGo",
        google: "Google",
        wiki: "Wikipedia",
        pj: "Pages Jaunes",
        ai: "Claude, Gemini, ...",
        internal: "IA interne de l'entreprise",
      },
      answers: {
        pj: {
          fr: `Les Pages Jaunes constituent l'annuaire professionnel par excellence pour trouver des artisans locaux avec leurs coordonnées directes.

- Google propose des résultats similaires mais mélange annonces publicitaires et tracking.
- DuckDuckGo n'est pas optimisé pour la recherche d'annuaire professionnel local.
- Wikipedia ne répertorie pas les artisans.
- L'IA interne ou externe n'est pas un annuaire d'entreprises du bâtiment.
`,
        },
      },
    },
    q11: {
      kind: "qcm",
      question: {
        fr: "Vous souhaitez obtenir une explication générale et vulgarisée sur le concept de 'développement durable' et son historique institutionnel international. Quel outil est le plus pertinent ?",
      },
      choices: {
        ddg: "DuckDuckGo",
        google: "Google",
        wiki: "Wikipedia",
        pj: "Pages Jaunes",
        ai: "Claude, Gemini, ...",
        internal: "IA interne de l'entreprise",
      },
      answers: {
        wiki: {
          fr: `Wikipedia fournit une synthèse encyclopédique structurée, neutre et documentée sur les concepts théoriques et historiques de premier plan.

- Les moteurs de recherche (Google, DuckDuckGo) renvoient des milliers de liens hétérogènes au lieu d'une synthèse claire.
- Les Pages Jaunes ne traitent pas de notions conceptuelles.
- L'IA interne est dédiée aux documents de la structure et non à la culture générale universelle.
`,
        },
      },
    },
    q12: {
      kind: "qcm",
      question: {
        fr: "Vous devez synthétiser sous forme de tableau comparatif les grands principes des intelligences artificielles génératives actuelles pour une note d'information générale, en profitant d'un assistant conversationnel externe. Quel outil sollicitez-vous ?",
      },
      choices: {
        ddg: "DuckDuckGo",
        google: "Google",
        wiki: "Wikipedia",
        pj: "Pages Jaunes",
        ai: "Claude, Gemini, ...",
        internal: "IA interne de l'entreprise",
      },
      answers: {
        ai: {
          fr: `Claude ou Gemini sont des IA conversationnelles parfaitement taillées pour structurer des tableaux comparatifs complexes et reformuler des concepts technologiques.

- L'IA interne pourrait servir, mais s'agissant d'un sujet technologique général sans données confidentielles d'entreprise, les IA publiques généralistes conviennent parfaitement.
- Google et DuckDuckGo ne génèrent pas directement de tableaux de synthèse structurés.
- Wikipedia donne des articles figés et non interactifs.
- Les Pages Jaunes sont totalement inadaptées.
`,
        },
      },
    },
  },
};
