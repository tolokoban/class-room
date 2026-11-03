/**
 * Exercises, sorted by increasing difficulty.
 * In `input` and `expected`, the text between `{` and `}` is bold.
 */
export const EXERCISES: Record<
  string,
  {
    title: Record<string, string>;
    input: string;
    expected: string;
  }
> = {
  // Le Laboureur et ses Enfants
  wholeText: {
    title: {
      fr: "Tout le texte",
      en: "The whole text",
      de: "Der ganze Text",
      it: "Tutto il testo",
    },
    input: `Travaillez, prenez de la peine :
C'est le fonds qui manque le moins.`,
    expected: `{Travaillez, prenez de la peine :
C'est le fonds qui manque le moins.}`,
  },
  // La Cigale et la Fourmi
  lastWordOfFirstLine: {
    title: {
      fr: "Le dernier mot de la ligne",
      en: "The last word of the line",
      de: "Das letzte Wort der Zeile",
      it: "L'ultima parola della riga",
    },
    input: `La Cigale, ayant chanté
Tout l'été,
Se trouva fort dépourvue
Quand la bise fut venue :
Pas un seul petit morceau
De mouche ou de vermisseau.`,
    expected: `La Cigale, ayant {chanté}
Tout l'été,
Se trouva fort dépourvue
Quand la bise fut venue :
Pas un seul petit morceau
De mouche ou de vermisseau.`,
  },
  // Le Chêne et le Roseau
  wholeLine: {
    title: {
      fr: "Une ligne entière",
      en: "A whole line",
      de: "Eine ganze Zeile",
      it: "Una riga intera",
    },
    input: `Le Chêne un jour dit au Roseau :
Vous avez bien sujet d'accuser la Nature ;
Un Roitelet pour vous est un pesant fardeau.`,
    expected: `Le Chêne un jour dit au Roseau :
{Vous avez bien sujet d'accuser la Nature ;}
Un Roitelet pour vous est un pesant fardeau.`,
  },
  // Le Lion et le Rat
  removeBold: {
    title: {
      fr: "Enlever le gras",
      en: "Remove the bold",
      de: "Fettdruck entfernen",
      it: "Togliere il grassetto",
    },
    input: `Il {faut}, autant qu'on peut, obliger tout le monde :
On a souvent besoin d'un plus petit que soi.`,
    expected: `Il faut, autant qu'on peut, obliger tout le monde :
On a souvent besoin d'un plus petit que soi.`,
  },
  // Le Loup et l'Agneau
  lastWordOfText: {
    title: {
      fr: "Le dernier mot du texte",
      en: "The last word of the text",
      de: "Das letzte Wort des Textes",
      it: "L'ultima parola del testo",
    },
    input: `La raison du plus fort est toujours la meilleure :
Nous l'allons montrer tout à l'heure.
Un Agneau se désaltérait
Dans le courant d'une onde pure.`,
    expected: `La raison du plus fort est toujours la meilleure :
Nous l'allons montrer tout à l'heure.
Un Agneau se désaltérait
Dans le courant d'une onde {pure}.`,
  },
  boldSimple: {
    title: {
      fr: "Un mot au milieu du texte",
      en: "A word in the middle of the text",
      de: "Ein Wort mitten im Text",
      it: "Una parola in mezzo al testo",
    },
    input: `Vive le vent,
vive le vent
d'hiver qui s'en va
sifflant, soufflant,
dans les grands sapins verts.`,
    expected: `Vive le vent,
vive le vent
d'{hiver} qui s'en va
sifflant, soufflant,
dans les grands sapins verts.`,
  },
  // Le Rat de ville et le Rat des champs
  severalWords: {
    title: {
      fr: "Plusieurs mots d'un coup",
      en: "Several words at once",
      de: "Mehrere Wörter auf einmal",
      it: "Più parole in una volta",
    },
    input: `Autrefois le Rat de ville
Invita le Rat des champs,
D'une façon fort civile,
À des reliefs d'Ortolans.`,
    expected: `Autrefois le Rat de ville
Invita le {Rat des champs},
D'une façon fort civile,
À des reliefs d'Ortolans.`,
  },
  // Le Héron
  twoWords: {
    title: {
      fr: "Deux mots éloignés",
      en: "Two distant words",
      de: "Zwei entfernte Wörter",
      it: "Due parole lontane",
    },
    input: `Un jour sur ses longs pieds allait je ne sais où
Le Héron au long bec emmanché d'un long cou.`,
    expected: `Un jour sur ses longs pieds allait je ne sais où
Le {Héron} au long bec emmanché d'un long {cou}.`,
  },
  // La Grenouille qui se veut faire aussi grosse que le Bœuf
  threeWords: {
    title: {
      fr: "Trois mots éloignés",
      en: "Three distant words",
      de: "Drei entfernte Wörter",
      it: "Tre parole lontane",
    },
    input: `Une Grenouille vit un Bœuf
Qui lui sembla de belle taille.
Elle qui n'était pas grosse en tout comme un œuf,`,
    expected: `Une {Grenouille} vit un {Bœuf}
Qui lui sembla de belle taille.
Elle qui n'était pas grosse en tout comme un {œuf},`,
  },
  // La Grenouille qui se veut faire aussi grosse que le Bœuf
  joinLines: {
    title: {
      fr: "Joindre deux lignes",
      en: "Join two lines",
      de: "Zwei Zeilen verbinden",
      it: "Unire due righe",
    },
    input: `Une Grenouille
vit un Bœuf
Qui lui sembla de belle taille.`,
    expected: `Une Grenouille vit un Bœuf
Qui lui sembla de belle taille.`,
  },
  // Le Lièvre et la Tortue
  splitLine: {
    title: {
      fr: "Couper une ligne en deux",
      en: "Split a line in two",
      de: "Eine Zeile teilen",
      it: "Dividere una riga in due",
    },
    input: `Rien ne sert de courir ; il faut partir à point.
Le Lièvre et la Tortue en sont un témoignage.`,
    expected: `Rien ne sert de courir ;
il faut partir à point.
Le Lièvre et la Tortue en sont un témoignage.`,
  },
  // Le Loup et le Chien
  deleteLine: {
    title: {
      fr: "Supprimer une ligne",
      en: "Delete a line",
      de: "Eine Zeile löschen",
      it: "Cancellare una riga",
    },
    input: `Un Loup n'avait que les os et la peau,
Le Chat mange la Souris.
Tant les chiens faisaient bonne garde.`,
    expected: `Un Loup n'avait que les os et la peau,
Tant les chiens faisaient bonne garde.`,
  },
  // Le Corbeau et le Renard
  copyWord: {
    title: {
      fr: "Copier un mot (Renard)",
      en: "Copy a word",
      de: "Ein Wort kopieren",
      it: "Copiare una parola",
    },
    input: `Maître Corbeau, sur un arbre perché,
Tenait en son bec un fromage.
Renard, par l'odeur alléchée,`,
    expected: `Maître Corbeau, sur un arbre perché,
Tenait en son bec un fromage.
Maître Renard, par l'odeur alléchée,`,
  },
  // Les Animaux malades de la peste
  duplicateLine: {
    title: {
      fr: "Dupliquer une ligne",
      en: "Duplicate a line",
      de: "Eine Zeile verdoppeln",
      it: "Duplicare una riga",
    },
    input: `Un mal qui répand la terreur,
Ils ne mouraient pas tous,`,
    expected: `Un mal qui répand la terreur,
Ils ne mouraient pas tous,
Ils ne mouraient pas tous,`,
  },
  // Le Corbeau et le Renard
  invertLines: {
    title: {
      fr: "Inverser deux lignes",
      en: "Swap two lines",
      de: "Zwei Zeilen vertauschen",
      it: "Invertire due righe",
    },
    input: `Maître corbeau sur un arbre perché
Maître renard, par l'odeur alléchée,
tenait en son bec un fromage.
lui tint à peu près ce language.`,
    expected: `Maître corbeau sur un arbre perché
tenait en son bec un fromage.
Maître renard, par l'odeur alléchée,
lui tint à peu près ce language.`,
  },
  // Le Lièvre et la Tortue
  swapWords: {
    title: {
      fr: "Échanger deux mots",
      en: "Swap two words",
      de: "Zwei Wörter vertauschen",
      it: "Scambiare due parole",
    },
    input: `Rien sert ne de courir ; il faut partir à point.
Le Lièvre et la Tortue en sont un témoignage.`,
    expected: `Rien ne sert de courir ; il faut partir à point.
Le Lièvre et la Tortue en sont un témoignage.`,
  },
  // La Mort et le Bûcheron
  reorderLines: {
    title: {
      fr: "Remettre les vers dans l'ordre",
      en: "Put the lines back in order",
      de: "Die Verse ordnen",
      it: "Rimettere i versi in ordine",
    },
    input: `Sous le faix du fagot aussi bien que des ans
Gémissant et courbé marchait à pas pesants,
Un pauvre Bûcheron tout couvert de ramée,
Et tâchait de gagner sa chaumine enfumée.`,
    expected: `Un pauvre Bûcheron tout couvert de ramée,
Sous le faix du fagot aussi bien que des ans
Gémissant et courbé marchait à pas pesants,
Et tâchait de gagner sa chaumine enfumée.`,
  },
  // Le Héron
  moveBoldWord: {
    title: {
      fr: "Déplacer un mot en gras",
      en: "Move a bold word",
      de: "Ein fettes Wort verschieben",
      it: "Spostare una parola in grassetto",
    },
    input: `Un jour sur ses longs pieds allait je ne sais où
au long bec emmanché d'un long cou.
Le {Héron}`,
    expected: `Un jour sur ses longs pieds allait je ne sais où
Le {Héron} au long bec emmanché d'un long cou.`,
  },
  // Le Loup et le Chien
  replaceWord: {
    title: {
      fr: "Remplacer un mot partout",
      en: "Replace a word everywhere",
      de: "Ein Wort überall ersetzen",
      it: "Sostituire una parola ovunque",
    },
    input: `Le Loup et le Chien
Un Chat n'avait que les os et la peau,
Tant les chiens faisaient bonne garde.
Ce Chat rencontre un Dogue aussi puissant que beau,`,
    expected: `Le Loup et le Chien
Un Loup n'avait que les os et la peau,
Tant les chiens faisaient bonne garde.
Ce Loup rencontre un Dogue aussi puissant que beau,`,
  },
  // La Laitière et le Pot au lait
  fixTypo: {
    title: {
      fr: "Corriger une faute (cousSinet)",
      en: "Fix a typo",
      de: "Einen Tippfehler korrigieren",
      it: "Correggere un errore",
    },
    input: `Perrette sur sa tête ayant un Pot au lait
Bien posé sur un cousinet,
Prétendait arriver sans encombre à la ville.`,
    expected: `Perrette sur sa tête ayant un Pot au lait
Bien posé sur un coussinet,
Prétendait arriver sans encombre à la ville.`,
  },
};
