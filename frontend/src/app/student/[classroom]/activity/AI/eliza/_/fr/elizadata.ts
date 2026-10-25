// data for elizabot.ts (French version)
// adapted from the English data, itself prestructured as layed out in Weizenbaum's description
// [cf: Communications of the ACM, Vol. 9, #1 (January 1966): p 36-45.]
//
// Eliza speaks to the user with "vous". The user can use "tu" or "vous".
//
// The patterns are matched against a normalized sentence:
// - lower case, without punctuation,
// - hyphens replaced by spaces ("peut-être" -> "peut être"),
// - elisions expanded ("j'ai" -> "je ai", "l'école" -> "le école"),
// - `elizaPres` substitutions applied.
//
// In the reassembly rules, "(2)" is the 2nd captured part of the pattern,
// reflected from the user's point of view to Eliza's ("mon" -> "votre",
// "je suis" -> "vous êtes", "tu me détestes" -> "je vous déteste").
// "(je ne 2)" reflects the captured part prefixed with "je ne".
// Elisions are restored in the replies ("je ai" -> "j'ai").
//
// Eliza does not know the gender of the user: avoid adjectives that
// have to agree with the user ("sûr", "content", ...) in the replies.

/**
 * A decomposition rule: a pattern and its list of reassembly rules.
 * A pattern starting with `$` means the reply is stored in memory
 * instead of being returned immediately.
 */
export type ElizaDecomp = readonly [pattern: string, reassemblies: readonly string[]]

export type ElizaKeyword = readonly [key: string, rank: number, decomps: readonly ElizaDecomp[]]

export interface ElizaReflection {
    /** Plain word swaps. */
    words: Readonly<Record<string, string>>
    /**
     * Subject pronouns, with their replacement and the person of the verb that follows.
     * The verb is conjugated for "first" (je -> vous) and "second" (tu/vous -> je).
     */
    subjects: Readonly<Record<string, readonly [replacement: string, person: "first" | "second" | "third"]>>
    /** Words that can stand between a subject and its verb ("je ne me sens pas"). */
    clitics: Readonly<Record<string, string>>
    /** Irregular verbs: "je suis" -> "vous êtes". */
    verbsFirstToSecond: Readonly<Record<string, string>>
    /** Irregular verbs: "vous êtes" / "tu es" -> "je suis". */
    verbsSecondToFirst: Readonly<Record<string, string>>
    /** After these words, an object "vous" becomes "moi" instead of "me". */
    prepositions: readonly string[]
    /** Before these words, an object "vous" becomes "moi" instead of "me". */
    stressedFollowers: readonly string[]
}

export const elizaInitials: readonly string[] = [
"Bonjour. Dites-moi quel est votre problème.",
"Dites-moi ce qui vous tracasse.",
"Quelque chose vous préoccupe ?"
];

export const elizaFinals: readonly string[] = [
"Au revoir. C'était un plaisir de discuter avec vous.",
"Au revoir. C'était vraiment une conversation agréable.",
"Au revoir. J'attends notre prochaine séance avec impatience.",
"C'était une bonne séance, n'est-ce pas ? Mais c'est terminé pour aujourd'hui. Au revoir.",
"Peut-être pourrons-nous en reparler lors de notre prochaine séance ? Au revoir."
];

// compared to the whole sentence, before the `elizaPres` substitutions
export const elizaQuits: readonly string[] = [
"au revoir",
"bye",
"adieu",
"à plus",
"a plus",
"à bientôt",
"a bientot",
"ciao",
"tchao",
"bonne nuit",
"quitter",
"fin",
"stop"
];

// pairs of "word", "replacement" applied to the input before matching
export const elizaPres: readonly string[] = [
// elisions
"j'", "je ",
"m'", "me ",
"t'", "te ",
"s'", "se ",
"l'", "le ",
"n'", "ne ",
"d'", "de ",
"c'", "ce ",
"qu'", "que ",
"jusqu'", "jusque ",
"lorsqu'", "lorsque ",
"puisqu'", "puisque ",
"s'il", "si il",
"s'ils", "si ils",
"t'es", "tu es",
"t'as", "tu as",
// questions
"que est ce que", "quoi",
"que est ce qui", "quoi",
"est ce que", "",
// texting
"chui", "je suis",
"chuis", "je suis",
"jsuis", "je suis",
"jsui", "je suis",
"jpense", "je pense",
"jsais", "je sais",
"chais", "je sais",
"jveux", "je veux",
"pk", "pourquoi",
"pq", "pourquoi",
"pkoi", "pourquoi",
"pcq", "parce que",
"pck", "parce que",
"psk", "parce que",
"parceque", "parce que",
"ptet", "peut être",
"peutetre", "peut être",
"slt", "salut",
"bjr", "bonjour",
"cc", "coucou",
"nan", "non",
// missing accents
"ca", "ça",
"etre", "être",
"etes", "êtes",
"etais", "étais",
"etait", "était",
"etiez", "étiez",
"peut etre", "peut être",
"reve", "rêve",
"reves", "rêves",
"rever", "rêver",
"desole", "désolé",
"desolee", "désolée",
"pere", "père",
"mere", "mère",
"frere", "frère",
"deprime", "déprimé",
"deprimee", "déprimée",
"decu", "déçu",
"decue", "déçue",
"different", "différent",
"differente", "différente",
"prenom", "prénom",
"francais", "français",
// synonyms
"machine", "ordinateur",
"machines", "ordinateur",
"ordinateurs", "ordinateur",
"robot", "ordinateur",
"robots", "ordinateur",
"bot", "ordinateur",
"chatbot", "ordinateur",
"ia", "ordinateur",
"certainement", "oui",
"évidemment", "oui",
"absolument", "oui",
"bien sûr", "oui",
"ouais", "oui",
"probablement", "peut être",
"sans doute", "peut être",
"identique", "pareil",
"identiques", "pareil",
"équivalent", "pareil",
"équivalente", "pareil",
"semblable", "pareil",
"semblables", "pareil",
"similaire", "pareil",
"similaires", "pareil",
"pareille", "pareil",
"pareils", "pareil",
"pareilles", "pareil"
];

export const elizaReflection: ElizaReflection = {
    words: {
        "mon": "votre",
        "ma": "votre",
        "mes": "vos",
        "moi": "vous",
        "me": "vous",
        "ton": "mon",
        "ta": "ma",
        "tes": "mes",
        "toi": "moi",
        "te": "me",
        "votre": "mon",
        "vos": "mes",
        "mien": "vôtre",
        "mienne": "vôtre",
        "tien": "mien",
        "tienne": "mienne",
        "vôtre": "mien",
    },
    subjects: {
        "je": ["vous", "first"],
        "tu": ["je", "second"],
        "vous": ["je", "second"],
        "il": ["il", "third"],
        "elle": ["elle", "third"],
        "on": ["on", "third"],
        "nous": ["nous", "third"],
        "ils": ["ils", "third"],
        "elles": ["elles", "third"],
    },
    clitics: {
        "ne": "ne",
        "me": "vous",
        "te": "me",
        "vous": "me",
        "nous": "nous",
        "se": "se",
        "le": "le",
        "la": "la",
        "les": "les",
        "lui": "lui",
        "leur": "leur",
        "y": "y",
        "en": "en",
    },
    verbsFirstToSecond: {
        "suis": "êtes",
        "ai": "avez",
        "vais": "allez",
        "fais": "faites",
        "dis": "dites",
        "peux": "pouvez",
        "veux": "voulez",
        "sais": "savez",
        "dois": "devez",
        "crois": "croyez",
        "vois": "voyez",
        "viens": "venez",
        "reviens": "revenez",
        "deviens": "devenez",
        "souviens": "souvenez",
        "tiens": "tenez",
        "prends": "prenez",
        "comprends": "comprenez",
        "apprends": "apprenez",
        "mets": "mettez",
        "bois": "buvez",
        "connais": "connaissez",
        "parais": "paraissez",
        "plais": "plaisez",
        "tais": "taisez",
        "hais": "haïssez",
        "finis": "finissez",
        "choisis": "choisissez",
        "réussis": "réussissez",
        "réfléchis": "réfléchissez",
        "grandis": "grandissez",
        "sors": "sortez",
        "pars": "partez",
        "dors": "dormez",
        "sens": "sentez",
        "ressens": "ressentez",
        "mens": "mentez",
        "sers": "servez",
        "cours": "courez",
        "écris": "écrivez",
        "lis": "lisez",
        "vis": "vivez",
        "ris": "riez",
        "souris": "souriez",
        "perds": "perdez",
        "attends": "attendez",
        "entends": "entendez",
        "réponds": "répondez",
        "rends": "rendez",
        "descends": "descendez",
        "meurs": "mourez",
        "reçois": "recevez",
        "déçois": "décevez",
        "conduis": "conduisez",
        "fuis": "fuyez",
        "envoie": "envoyez",
        "essaie": "essayez",
        "paie": "payez",
        "ennuie": "ennuyez",
        "appuie": "appuyez",
        "nettoie": "nettoyez",
    },
    verbsSecondToFirst: {
        "êtes": "suis",
        "es": "suis",
        "avez": "ai",
        "as": "ai",
        "allez": "vais",
        "vas": "vais",
        "faites": "fais",
        "dites": "dis",
        "pouvez": "peux",
        "voulez": "veux",
        "savez": "sais",
        "devez": "dois",
        "croyez": "crois",
        "voyez": "vois",
        "venez": "viens",
        "revenez": "reviens",
        "devenez": "deviens",
        "souvenez": "souviens",
        "tenez": "tiens",
        "prenez": "prends",
        "comprenez": "comprends",
        "apprenez": "apprends",
        "mettez": "mets",
        "buvez": "bois",
        "connaissez": "connais",
        "paraissez": "parais",
        "plaisez": "plais",
        "taisez": "tais",
        "haïssez": "hais",
        "finissez": "finis",
        "choisissez": "choisis",
        "réussissez": "réussis",
        "réfléchissez": "réfléchis",
        "grandissez": "grandis",
        "sortez": "sors",
        "partez": "pars",
        "dormez": "dors",
        "sentez": "sens",
        "ressentez": "ressens",
        "mentez": "mens",
        "servez": "sers",
        "courez": "cours",
        "écrivez": "écris",
        "lisez": "lis",
        "vivez": "vis",
        "riez": "ris",
        "souriez": "souris",
        "perdez": "perds",
        "attendez": "attends",
        "entendez": "entends",
        "répondez": "réponds",
        "rendez": "rends",
        "descendez": "descends",
        "mourez": "meurs",
        "recevez": "reçois",
        "décevez": "déçois",
        "conduisez": "conduis",
        "fuyez": "fuis",
        "envoyez": "envoie",
        "essayez": "essaie",
        "payez": "paie",
        "ennuyez": "ennuie",
        "appuyez": "appuie",
        "nettoyez": "nettoie",
        // present of verbs ending in -ier (not imperfect)
        "oubliez": "oublie",
        "étudiez": "étudie",
        "criez": "crie",
        "copiez": "copie",
        "appréciez": "apprécie",
        "remerciez": "remercie",
        "vérifiez": "vérifie",
        "confiez": "confie",
        "enviez": "envie",
        "priez": "prie",
        "niez": "nie",
        // irregular futures
        "aurez": "aurai",
        "irez": "irai",
        "pourrez": "pourrai",
        "voudrez": "voudrai",
        "saurez": "saurai",
        "devrez": "devrai",
        "verrez": "verrai",
        "viendrez": "viendrai",
        "ferez": "ferai",
    },
    prepositions: [
        "avec", "sans", "chez", "contre", "sur", "sous", "par", "envers", "comme",
        "sauf", "entre", "vers", "après", "avant", "derrière", "devant", "et", "ou",
    ],
    stressedFollowers: [
        "et", "ou", "aussi", "même", "non", "seulement", "que", "qui",
    ],
};

export const elizaSynons: Readonly<Record<string, readonly string[]>> = {
"être": ["suis", "es", "est", "sommes", "êtes", "sont", "étais", "était", "étions", "étiez", "étaient", "serai", "sera", "serais", "serait"],
"croire": ["pense", "crois", "trouve", "imagine", "suppose", "sens"],
"nepeux": ["ne peux pas", "peux pas", "ne arrive pas à", "arrive pas à", "ne parviens pas à"],
"veux": ["voudrais", "aimerais", "souhaite", "désire"],
"personne": ["tout le monde", "chacun", "aucun"],
"famille": ["mère", "maman", "père", "papa", "soeur", "sœur", "frère", "femme", "mari", "enfants", "enfant", "fils", "fille", "parents", "grand mère", "grand père", "cousin", "cousine", "oncle", "tante"],
"heureux": ["heureuse", "content", "contente", "joyeux", "joyeuse", "ravi", "ravie", "mieux"],
"triste": ["malheureux", "malheureuse", "déprimé", "déprimée", "malade", "seul", "seule", "fatigué", "fatiguée", "déçu", "déçue"],
// pronouns and verbs addressing Eliza
"tu": ["vous"],
"te": ["vous"],
"es": ["êtes"],
"as": ["avez"],
"étais": ["étiez"],
"mon": ["ma", "mes"],
"ton": ["ta", "tes", "votre", "vos"],
"peux": ["pouvez", "pourrais", "pourriez", "puis"],
"souviens": ["rappelle", "rappelles", "souvenez", "rappelez"],
"rappelles": ["rappelez", "fais penser", "faites penser"]
};

export const elizaKeywords: readonly ElizaKeyword[] = [

/*
  Array of
  ["<key>", <rank>, [
    ["<decomp>", [
      "<reasmb>",
      "<reasmb>",
      "<reasmb>"
    ]],
    ["<decomp>", [
      "<reasmb>",
      "<reasmb>",
      "<reasmb>"
    ]]
  ]]
*/

["xnone", 0, [
 ["*", [
     "Je ne vous comprends pas tout à fait.",
     "Continuez, je vous prie.",
     "Que cela vous suggère-t-il ?",
     "Tenez-vous beaucoup à parler de ce genre de choses ?",
     "C'est intéressant. Continuez, je vous prie.",
     "Dites-m'en davantage.",
     "Cela vous gêne-t-il d'en parler ?"
  ]]
]],
["désolé", 0, [
 ["*", [
     "Ne vous excusez pas, je vous prie.",
     "Les excuses ne sont pas nécessaires.",
     "Je vous ai déjà dit que les excuses ne sont pas nécessaires.",
     "Cela ne me dérange pas. Continuez, je vous prie."
  ]]
]],
["désolée", 0, [
 ["*", [
     "goto désolé"
  ]]
]],
["pardon", 0, [
 ["*", [
     "goto désolé"
  ]]
]],
["excuse", 0, [
 ["*", [
     "goto désolé"
  ]]
]],
["excusez", 0, [
 ["*", [
     "goto désolé"
  ]]
]],
["souviens", 5, [
 ["* je me @souviens *", [
     "Vous souvenez-vous souvent (3) ?",
     "Le fait de vous souvenir (3) vous rappelle-t-il autre chose ?",
     "De quoi d'autre vous souvenez-vous ?",
     "Pourquoi vous souvenez-vous (3) maintenant ?",
     "Qu'est-ce qui, dans la situation présente, vous y fait penser ?",
     "Quel est le lien entre moi et ce souvenir ?",
     "Quels autres souvenirs cela vous évoque-t-il ?"
  ]],
 ["* @tu @te @souviens *", [
     "Pensiez-vous que j'allais oublier ?",
     "Pourquoi devrais-je me souvenir (5) maintenant ?",
     "Et si je ne me souvenais pas (5) ?",
     "goto quoi",
     "Vous parlez (5) ?"
  ]],
 ["* @te @souviens @tu *", [
     "Pensiez-vous que j'allais oublier ?",
     "Pourquoi devrais-je me souvenir (5) maintenant ?",
     "Et si je ne me souvenais pas (5) ?",
     "goto quoi",
     "Vous parlez (5) ?"
  ]]
]],
["rappelle", 5, [
 ["*", [
     "goto souviens"
  ]]
]],
["souvenez", 5, [
 ["*", [
     "goto souviens"
  ]]
]],
["oublie", 5, [
 ["* je oublie *", [
     "Pouvez-vous imaginer pourquoi vous oubliez (2) ?",
     "Pourquoi n'arrivez-vous pas à vous en souvenir ?",
     "Y pensez-vous souvent ?",
     "Cela vous dérange-t-il d'oublier cela ?",
     "Serait-ce un blocage ?",
     "Oubliez-vous souvent les choses ?",
     "Pensez-vous que vous cherchez à oublier (2) ?"
  ]],
 ["* je ai oublié *", [
     "goto oublie"
  ]],
 ["* @tu @as oublié *", [
     "Pourquoi cette question ?",
     "Avez-vous la certitude de me l'avoir dit ?",
     "Cela vous dérangerait-il que j'aie oublié (4) ?",
     "Pourquoi devrais-je me rappeler (4) maintenant ?",
     "goto quoi",
     "Parlez-moi davantage de cela."
  ]]
]],
["oublié", 5, [
 ["*", [
     "goto oublie"
  ]]
]],
["si", 3, [
 ["* si *", [
     "Vraiment, si (2) ?",
     "Que feriez-vous si (2) ?",
     "Et que se passerait-il si (2) ?",
     "Souhaitez-vous vraiment que cela arrive ?",
     "Que savez-vous de cette hypothèse ?",
     "Où mène cette spéculation ?"
  ]]
]],
["rêvé", 4, [
 ["* je ai rêvé *", [
     "Vraiment, (2) ?",
     "Vous est-il déjà arrivé de rêver (2) les yeux ouverts ?",
     "Aviez-vous déjà rêvé (2) auparavant ?",
     "goto rêve"
  ]]
]],
["rêve", 3, [
 ["*", [
     "Que vous suggère ce rêve ?",
     "Rêvez-vous souvent ?",
     "Quelles personnes apparaissent dans vos rêves ?",
     "Pensez-vous que les rêves ont un rapport avec votre problème ?"
  ]]
]],
["rêves", 3, [
 ["*", [
     "goto rêve"
  ]]
]],
["cauchemar", 3, [
 ["*", [
     "goto rêve"
  ]]
]],
["cauchemars", 3, [
 ["*", [
     "goto rêve"
  ]]
]],
["peut être", 0, [
 ["*", [
     "Cela n'a pas l'air très certain.",
     "Pourquoi ce ton hésitant ?",
     "Pourriez-vous être plus précis ?",
     "Vous avez un doute ?",
     "Ne le savez-vous pas ?",
     "Quelle probabilité donneriez-vous à cela ?"
  ]]
]],
["nom", 15, [
 ["*", [
     "Les noms ne m'intéressent pas.",
     "Je vous l'ai déjà dit, les noms m'importent peu -- continuez, je vous prie."
  ]]
]],
["prénom", 15, [
 ["*", [
     "goto nom"
  ]]
]],
["appelle", 15, [
 ["* je me appelle *", [
     "goto nom"
  ]]
]],
["anglais", 0, [
 ["*", [
     "goto xforeign",
     "Je vous l'ai déjà dit, je ne comprends pas l'anglais."
  ]]
]],
["english", 0, [
 ["*", [
     "goto anglais"
  ]]
]],
["allemand", 0, [
 ["*", [
     "goto xforeign",
     "Je vous l'ai déjà dit, je ne comprends pas l'allemand."
  ]]
]],
["deutsch", 0, [
 ["*", [
     "goto allemand"
  ]]
]],
["italien", 0, [
 ["*", [
     "goto xforeign",
     "Je vous l'ai déjà dit, je ne comprends pas l'italien."
  ]]
]],
["italiano", 0, [
 ["*", [
     "goto italien"
  ]]
]],
["espagnol", 0, [
 ["*", [
     "goto xforeign",
     "Je vous l'ai déjà dit, je ne comprends pas l'espagnol."
  ]]
]],
["español", 0, [
 ["*", [
     "goto espagnol"
  ]]
]],
["xforeign", 0, [
 ["*", [
     "Je ne parle que le français."
  ]]
]],
["bonjour", 0, [
 ["*", [
     "Bonjour. Exposez-moi votre problème, je vous prie.",
     "Salut. Qu'est-ce qui vous amène ?"
  ]]
]],
["salut", 0, [
 ["*", [
     "goto bonjour"
  ]]
]],
["bonsoir", 0, [
 ["*", [
     "goto bonjour"
  ]]
]],
["coucou", 0, [
 ["*", [
     "goto bonjour"
  ]]
]],
["hello", 0, [
 ["*", [
     "goto bonjour"
  ]]
]],
["ordinateur", 50, [
 ["*", [
     "Les ordinateurs vous inquiètent-ils ?",
     "Pourquoi parlez-vous des ordinateurs ?",
     "Quel rapport voyez-vous entre les machines et votre problème ?",
     "Ne pensez-vous pas que les ordinateurs peuvent aider les gens ?",
     "Qu'est-ce qui vous inquiète dans les machines ?",
     "Que pensez-vous des machines ?",
     "Vous ne pensez tout de même pas que je suis un programme informatique ?"
  ]]
]],
["suis", 0, [
 ["* suis je *", [
     "Croyez-vous que vous êtes (2) ?",
     "Aimeriez-vous être (2) ?",
     "Voudriez-vous que je vous dise que vous êtes (2) ?",
     "Que cela signifierait-il si vous étiez (2) ?",
     "goto quoi"
  ]],
 ["* je suis *", [
     "goto je"
  ]],
 ["*", [
     "Pourquoi dites-vous « suis » ?",
     "Je ne comprends pas bien."
  ]]
]],
["es", 0, [
 ["* @es @tu *", [
     "Pourquoi cela vous intéresse-t-il de savoir si je suis (4) ?",
     "Préféreriez-vous que je ne sois pas (4) ?",
     "Peut-être que je suis (4) dans vos fantasmes.",
     "Pensez-vous parfois que je suis (4) ?",
     "goto quoi",
     "Est-ce que cela compterait pour vous ?",
     "Et si j'étais (4) ?"
  ]],
 ["* @tu @es *", [
     "goto tu"
  ]]
]],
["êtes", 0, [
 ["*", [
     "goto es"
  ]]
]],
["sont", 0, [
 ["* sont *", [
     "Pensiez-vous qu'ils pourraient ne pas être (2) ?",
     "Aimeriez-vous qu'ils ne soient pas (2) ?",
     "Et s'ils n'étaient pas (2) ?",
     "Sont-ils toujours (2) ?",
     "Il est possible qu'ils soient (2).",
     "Est-il certain qu'ils sont (2) ?"
  ]]
]],
["ton", 0, [
 ["* @ton *", [
     "Pourquoi vous préoccupez-vous de (2) (3) ?",
     "Vous inquiétez-vous de ce genre de chose chez quelqu'un d'autre ?",
     "Vraiment, (2) (3) ?",
     "Qu'est-ce qui vous fait penser à (2) (3) ?",
     "Voulez-vous (2) (3) ?"
  ]]
]],
["ta", 0, [
 ["*", [
     "goto ton"
  ]]
]],
["tes", 0, [
 ["*", [
     "goto ton"
  ]]
]],
["votre", 0, [
 ["*", [
     "goto ton"
  ]]
]],
["vos", 0, [
 ["*", [
     "goto ton"
  ]]
]],
["étais", 2, [
 ["* étais je *", [
     "Et si vous étiez (2) ?",
     "Pensez-vous que vous étiez (2) ?",
     "Étiez-vous (2) ?",
     "Que cela signifierait-il si vous étiez (2) ?",
     "Que vous évoque « (2) » ?",
     "goto quoi"
  ]],
 ["* je étais *", [
     "Vraiment ?",
     "Pourquoi me dites-vous maintenant que vous étiez (2) ?",
     "Peut-être savais-je déjà que vous étiez (2)."
  ]],
 ["* @tu @étais *", [
     "Aimeriez-vous croire que j'étais (4) ?",
     "Qu'est-ce qui vous fait penser que j'étais (4) ?",
     "Qu'en pensez-vous ?",
     "Peut-être que j'étais (4).",
     "Et si j'avais été (4) ?"
  ]],
 ["* @étais @tu *", [
     "Aimeriez-vous croire que j'étais (4) ?",
     "Qu'est-ce qui vous fait penser que j'étais (4) ?",
     "Qu'en pensez-vous ?",
     "Peut-être que j'étais (4).",
     "Et si j'avais été (4) ?"
  ]]
]],
["étiez", 2, [
 ["*", [
     "goto étais"
  ]]
]],
["je", 0, [
 ["* je ai besoin *", [
     "Pourquoi avez-vous besoin (2) ?",
     "Avez-vous vraiment besoin (2) ?",
     "Depuis quand avez-vous besoin (2) ?",
     "Que se passerait-il si vous ne l'obteniez pas ?"
  ]],
 ["* je ai envie *", [
     "Pourquoi avez-vous envie (2) ?",
     "Avez-vous vraiment envie (2) ?",
     "Que ressentiriez-vous si cela arrivait ?",
     "Quel rapport cette envie a-t-elle avec notre discussion ?"
  ]],
 ["* je @veux *", [
     "Pourquoi voulez-vous (3) ?",
     "Vous voulez vraiment (3) ?",
     "Que signifierait pour vous le fait de vouloir (3) ?",
     "Supposons que vous y parveniez bientôt. Et ensuite ?",
     "Et si cela n'arrivait jamais ?",
     "Quel rapport y a-t-il entre vouloir (3) et notre discussion ?"
  ]],
 ["* je suis* @triste *", [
     "Cela me peine d'apprendre que vous êtes (3).",
     "Pensez-vous que venir ici vous aidera à ne plus être (3) ?",
     "Ce n'est sûrement pas agréable d'être (3).",
     "Pouvez-vous m'expliquer ce qui vous rend (3) ?"
  ]],
 ["* je suis* @heureux *", [
     "En quoi ai-je pu vous aider à être (3) ?",
     "Est-ce votre traitement qui vous rend (3) ?",
     "Qu'est-ce qui vous rend (3) en ce moment ?",
     "Pouvez-vous expliquer pourquoi vous êtes soudain (3) ?"
  ]],
 ["* je étais *", [
     "goto étais"
  ]],
 ["* je @croire que je *", [
     "Le pensez-vous vraiment ?",
     "Mais vous n'en avez pas la certitude ?",
     "Pensez-vous vraiment que (je 3) ?"
  ]],
 ["* je @croire que @tu *", [
     "goto tu"
  ]],
 ["* je @croire que *", [
     "Pourquoi pensez-vous que (3) ?",
     "Qu'est-ce qui vous fait penser que (3) ?",
     "En avez-vous la certitude ?"
  ]],
 ["* je suis *", [
     "Est-ce parce que vous êtes (2) que vous venez me voir ?",
     "Depuis combien de temps êtes-vous (2) ?",
     "Pensez-vous qu'il soit normal d'être (2) ?",
     "Aimez-vous être (2) ?",
     "Connaissez-vous d'autres personnes qui sont (2) ?"
  ]],
 ["* je @nepeux *", [
     "Comment savez-vous que vous ne pouvez pas (3) ?",
     "Avez-vous essayé ?",
     "Peut-être pourriez-vous (3) maintenant.",
     "Voulez-vous vraiment être capable de (3) ?",
     "Et si vous pouviez (3) ?"
  ]],
 ["* je ne *", [
     "Vraiment, (je ne 2) ?",
     "Pourquoi (je ne 2) ?",
     "Aimeriez-vous que ce soit différent ?",
     "Cela vous dérange-t-il ?"
  ]],
 ["* je me sens *", [
     "Parlez-moi davantage de ce que vous ressentez.",
     "Vous sentez-vous souvent (2) ?",
     "Aimez-vous vous sentir (2) ?",
     "Que vous rappelle le fait de vous sentir (2) ?"
  ]],
 ["* je @te *", [
     "Vous voulez dire que (je te 3) ?",
     "Pourquoi dites-vous que (je te 3) ?",
     "Peut-être que dans vos fantasmes, (je te 3).",
     "Et y a-t-il d'autres personnes dont vous diriez cela ?"
  ]],
 ["*", [
     "Vous dites que (1) ?",
     "Pouvez-vous développer ?",
     "Dites-vous que (1) pour une raison particulière ?",
     "C'est très intéressant."
  ]]
]],
["tu", 0, [
 ["* @tu me @rappelles *", [
     "goto pareil"
  ]],
 ["* @peux @tu *", [
     "goto peux"
  ]],
 ["* @tu @peux *", [
     "goto peux"
  ]],
 ["* @tu @es *", [
     "Qu'est-ce qui vous fait penser que je suis (4) ?",
     "Cela vous fait-il plaisir de croire que je suis (4) ?",
     "Aimeriez-vous parfois être (4) ?",
     "Peut-être aimeriez-vous être (4)."
  ]],
 ["* @tu me *", [
     "Pourquoi pensez-vous que (tu me 3) ?",
     "Vous aimez penser que (tu me 3), n'est-ce pas ?",
     "Qu'est-ce qui vous fait penser que (tu me 3) ?",
     "Vraiment, (tu me 3) ?",
     "Voulez-vous croire que (tu me 3) ?",
     "Supposons que (tu me 3) -- qu'est-ce que cela signifierait ?",
     "Quelqu'un d'autre croit-il que (tu me 3) ?"
  ]],
 ["* @tu *", [
     "Nous parlions de vous -- pas de moi.",
     "Oh, (tu 3) ?",
     "Vous ne parlez pas vraiment de moi, n'est-ce pas ?",
     "Que ressentez-vous en ce moment ?"
  ]],
 ["*", [
     "Nous parlions de vous -- pas de moi.",
     "Ne parlons pas de moi.",
     "Revenons à vous, voulez-vous ?"
  ]]
]],
["vous", 0, [
 ["*", [
     "goto tu"
  ]]
]],
["toi", 0, [
 ["*", [
     "goto tu"
  ]]
]],
["oui", 0, [
 ["*", [
     "Cela semble clair pour vous.",
     "Vous en avez la certitude.",
     "Je vois.",
     "Je comprends."
  ]]
]],
["non", 0, [
 ["*", [
     "Dites-vous non simplement par esprit de contradiction ?",
     "Voilà une réponse bien négative.",
     "Pourquoi pas ?",
     "Pourquoi « non » ?"
  ]]
]],
["mon", 2, [
 ["$ * @mon *", [
     "Est-ce que cela a un rapport avec le fait que (2) (3) ?",
     "Revenons sur le fait que (2) (3).",
     "Tout à l'heure, vous disiez que (2) (3).",
     "Mais (2) (3)."
  ]],
 ["* @mon * @famille *", [
     "Parlez-moi davantage de votre famille.",
     "Qui d'autre dans votre famille (5) ?",
     "(2) (4) ?",
     "À quoi d'autre pensez-vous quand vous pensez à (2) (4) ?"
  ]],
 ["* @mon *", [
     "(2) (3) ?",
     "Pourquoi dites-vous que (2) (3) ?",
     "Cela vous fait-il penser à autre chose qui vous appartient ?",
     "Est-ce important pour vous que (2) (3) ?"
  ]]
]],
["ma", 2, [
 ["*", [
     "goto mon"
  ]]
]],
["mes", 2, [
 ["*", [
     "goto mon"
  ]]
]],
["peux", 0, [
 ["* @peux @tu *", [
     "Vous croyez que je peux (4), n'est-ce pas ?",
     "goto quoi",
     "Vous voudriez que je sois capable de (4).",
     "Peut-être aimeriez-vous être capable de (4) vous-même."
  ]],
 ["* @tu @peux *", [
     "Vous croyez que je peux (4), n'est-ce pas ?",
     "goto quoi",
     "Vous voudriez que je sois capable de (4).",
     "Peut-être aimeriez-vous être capable de (4) vous-même."
  ]],
 ["* @peux je *", [
     "Que vous puissiez (3) ou non dépend plus de vous que de moi.",
     "Voulez-vous être capable de (3) ?",
     "Peut-être ne voulez-vous pas (3).",
     "goto quoi"
  ]]
]],
["pouvez", 0, [
 ["*", [
     "goto peux"
  ]]
]],
["pourrais", 0, [
 ["*", [
     "goto peux"
  ]]
]],
["pourriez", 0, [
 ["*", [
     "goto peux"
  ]]
]],
["puis", 0, [
 ["*", [
     "goto peux"
  ]]
]],
["quoi", 0, [
 ["*", [
     "Pourquoi cette question ?",
     "Cette question vous intéresse-t-elle ?",
     "Que voulez-vous vraiment savoir ?",
     "Ce genre de question vous préoccupe-t-il beaucoup ?",
     "Quelle réponse vous ferait le plus plaisir ?",
     "Qu'en pensez-vous ?",
     "À quoi pensez-vous en posant cette question ?",
     "Vous êtes-vous déjà posé ce genre de question ?",
     "En avez-vous parlé à quelqu'un d'autre ?"
  ]]
]],
["qui", 0, [
 ["qui *", [
     "goto quoi"
  ]]
]],
["quand", 0, [
 ["quand *", [
     "goto quoi"
  ]]
]],
["où", 0, [
 ["où *", [
     "goto quoi"
  ]]
]],
["comment", 0, [
 ["comment *", [
     "goto quoi"
  ]]
]],
["combien", 0, [
 ["combien *", [
     "goto quoi"
  ]]
]],
["quel", 0, [
 ["*", [
     "goto quoi"
  ]]
]],
["quelle", 0, [
 ["*", [
     "goto quoi"
  ]]
]],
["parce que", 0, [
 ["*", [
     "Est-ce la vraie raison ?",
     "D'autres raisons ne vous viennent-elles pas à l'esprit ?",
     "Cette raison explique-t-elle autre chose ?",
     "Quelles autres raisons pourrait-il y avoir ?"
  ]]
]],
["car", 0, [
 ["*", [
     "goto parce que"
  ]]
]],
// rank 1 to be tried before "je" and "tu",
// but without a catch-all rule, so other keywords still get a chance
["pourquoi", 1, [
 ["* pourquoi @tu ne *", [
     "Croyez-vous que (tu ne 3) ?",
     "Peut-être que je le ferai en temps voulu.",
     "Et vous, le feriez-vous ?",
     "Vous voudriez que je le fasse ?",
     "goto quoi"
  ]],
 ["* pourquoi je ne peux pas *", [
     "Pensez-vous que vous devriez pouvoir (2) ?",
     "Voulez-vous être capable de (2) ?",
     "Pensez-vous que cela vous aiderait à (2) ?",
     "Avez-vous une idée de la raison pour laquelle vous ne pouvez pas (2) ?",
     "goto quoi"
  ]],
]],
// catch-all for "pourquoi", tried after all the other keywords of rank 0
["pourquoi", 0, [
 ["*", [
     "goto quoi"
  ]]
]],
["personne", 2, [
 ["* @personne *", [
     "Vraiment, (2) ?",
     "Vraiment (2), sans exception ?",
     "Pensez-vous à quelqu'un en particulier ?",
     "Qui, par exemple ?",
     "Pensez-vous à une personne en particulier ?",
     "Qui donc, si je peux me permettre ?",
     "Quelqu'un de spécial, peut-être ?",
     "Vous avez une personne précise en tête, n'est-ce pas ?",
     "De qui pensez-vous parler, au juste ?"
  ]]
]],
["tout le monde", 2, [
 ["*", [
     "goto personne"
  ]]
]],
["chacun", 2, [
 ["*", [
     "goto personne"
  ]]
]],
["aucun", 2, [
 ["*", [
     "goto personne"
  ]]
]],
["toujours", 1, [
 ["*", [
     "Pouvez-vous me donner un exemple précis ?",
     "Quand ?",
     "À quel événement pensez-vous ?",
     "Vraiment, toujours ?"
  ]]
]],
["jamais", 1, [
 ["*", [
     "Jamais ?",
     "Vraiment jamais ?",
     "Ne voyez-vous aucune exception ?",
     "Pourquoi jamais ?"
  ]]
]],
["pareil", 10, [
 ["*", [
     "De quelle manière ?",
     "Quelle ressemblance voyez-vous ?",
     "Que vous suggère cette similitude ?",
     "Quels autres liens voyez-vous ?",
     "Selon vous, que signifie cette ressemblance ?",
     "Quel est le lien, à votre avis ?",
     "Pourrait-il vraiment y avoir un lien ?",
     "Comment ?"
  ]]
]],
["ressemble", 10, [
 ["*", [
     "goto pareil"
  ]]
]],
["ressembles", 10, [
 ["*", [
     "goto pareil"
  ]]
]],
["ressemblez", 10, [
 ["*", [
     "goto pareil"
  ]]
]],
["comme", 10, [
 ["* @être *comme *", [
     "goto pareil"
  ]]
]],
["différent", 0, [
 ["*", [
     "En quoi est-ce différent ?",
     "Quelles différences voyez-vous ?",
     "Que vous suggère cette différence ?",
     "Quelles autres distinctions voyez-vous ?",
     "Selon vous, que signifie cette disparité ?",
     "Pourrait-il y avoir un lien, à votre avis ?",
     "Comment ?"
  ]]
]],
["différente", 0, [
 ["*", [
     "goto différent"
  ]]
]]

];

const VOWEL = "(?=[aeiouyàâäéèêëîïôöûùüœ]|h(?!a[iïu]|ont|asard|ors|éro|url|ibou))"

// regexp/replacement pairs to be performed as final cleanings
export const elizaPostTransforms: ReadonlyArray<readonly [pattern: RegExp, replacement: string]> = [
	// elisions: "je ai" -> "j'ai", "que il" -> "qu'il"
	[new RegExp(`(?<![\\p{L}\\p{N}-])(j|m|t|s|l|n|d|c|qu|jusqu|lorsqu|puisqu)e ${VOWEL}`, "gu"), "$1'"],
	[new RegExp(`(?<![\\p{L}\\p{N}-])la ${VOWEL}`, "gu"), "l'"],
	[/(?<![\p{L}\p{N}])si (ils?)(?![\p{L}\p{N}])/gu, "s'$1"],
];

// eof
