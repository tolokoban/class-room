/**
 * For each section of the help (see `../sections.ts`):
 * `xxxTitle`, `xxxText` (explanation) and `xxxExample` (Markdown code).
 */
const FR = {
  title: "Aide-mémoire Markdown",
  close: "Fermer",
  download: "Télécharger",
  code: "Code",
  result: "Résultat",

  paragraphsTitle: "Paragraphes",
  paragraphsText:
    "Une ligne vide sépare deux paragraphes. Un simple retour à la ligne est affiché comme une espace.",
  paragraphsExample: `Premier paragraphe,
toujours le premier.

Second paragraphe.`,

  lineBreakTitle: "Retour à la ligne",
  lineBreakText:
    "Une barre oblique inversée en fin de ligne force un retour à la ligne dans le même paragraphe. Deux espaces en fin de ligne font la même chose, mais elles sont invisibles.",
  lineBreakExample: `Rue du Lac 12\\
1000 Lausanne`,

  titleTitle: "Titres",
  titleText: "Un dièse suivi d'une espace au début d'une ligne en fait un titre.",
  titleExample: `# Mon titre`,

  subtitlesTitle: "Niveaux de titres",
  subtitlesText: "Le nombre de dièses (de 1 à 6) donne le niveau du titre.",
  subtitlesExample: `## Sous-titre

### Sous-sous-titre`,

  boldTitle: "Gras",
  boldText: "Deux astérisques (ou deux tirets bas) de chaque côté du texte.",
  boldExample: `Un mot en **gras**, un autre en __gras__.`,

  italicTitle: "Italique",
  italicText:
    "Un astérisque (ou un tiret bas) de chaque côté du texte. Trois astérisques donnent du gras italique.",
  italicExample: `Un mot en *italique*, un autre en _italique_, et un en ***gras italique***.`,

  strikethroughTitle: "Texte barré",
  strikethroughText: "Deux tildes de chaque côté du texte.",
  strikethroughExample: `Un prix ~~barré~~.`,

  bulletListTitle: "Listes à puces",
  bulletListText:
    "Chaque élément commence par un tiret (ou un astérisque, ou un plus) suivi d'une espace. Laissez une ligne vide après la liste.",
  bulletListExample: `- Pommes
- Poires
- Abricots`,

  numberedListTitle: "Listes numérotées",
  numberedListText:
    "Chaque élément commence par un nombre, un point et une espace. Seul le premier nombre compte : il donne le numéro de départ.",
  numberedListExample: `1. Préchauffer le four
2. Mélanger
3. Cuire`,

  nestedListTitle: "Listes imbriquées",
  nestedListText:
    "Décalez les éléments de la sous-liste avec des espaces, jusqu'au début du texte de l'élément parent.",
  nestedListExample: `- Fruits
  - Pommes
  - Poires
- Légumes
  1. Carottes
  2. Poireaux`,

  taskListTitle: "Listes de tâches",
  taskListText:
    "Une liste à puces dont les éléments commencent par une case : crochets avec une espace (vide) ou un x (cochée).",
  taskListExample: `- [x] Faire les courses
- [ ] Ranger la cuisine`,

  inlineCodeTitle: "Code dans le texte",
  inlineCodeText:
    "Des accents graves autour du texte. Ce qui est à l'intérieur n'est pas interprété.",
  inlineCodeExample: "Ouvrez le fichier `notes.txt`, sans `**gras**`.",

  codeBlockTitle: "Blocs de code",
  codeBlockText:
    "Une ligne de trois accents graves (ou trois tildes) avant le code, et une autre après.",
  codeBlockExample: `\`\`\`
for i in range(3):
    print(i)
\`\`\``,

  quoteTitle: "Citations",
  quoteText:
    "Un chevron fermant suivi d'une espace au début de chaque ligne, y compris les lignes vides de la citation.",
  quoteExample: `> Premier paragraphe de la citation.
>
> Second paragraphe.`,

  linkTitle: "Liens",
  linkText:
    "Le texte cliquable entre crochets, suivi de l'adresse entre parenthèses. Une adresse qui commence par https devient un lien toute seule.",
  linkExample: `Visitez [Wikipédia](https://fr.wikipedia.org)
ou https://www.markdownguide.org`,

  imageTitle: "Images",
  imageText:
    "Comme un lien, précédé d'un point d'exclamation. Le texte entre crochets décrit l'image.",
  imageExample: `![Logo de Markdown](https://upload.wikimedia.org/wikipedia/commons/4/48/Markdown-mark.svg)`,

  separatorTitle: "Séparateurs",
  separatorText:
    "Une ligne avec seulement trois tirets (ou trois astérisques). Laissez une ligne vide avant.",
  separatorExample: `Première partie

---

Seconde partie`,

  tableTitle: "Tableaux",
  tableText:
    "Les cellules sont séparées par des barres verticales. La deuxième ligne ne contient que des tirets et sépare les titres du contenu.",
  tableExample: `| Nom | Âge |
| --- | --- |
| Alice | 16 |
| Bob | 17 |`,

  tableAlignTitle: "Alignement des colonnes",
  tableAlignText:
    "Dans la ligne de tirets, des deux-points à gauche, des deux côtés ou à droite alignent la colonne à gauche, au centre ou à droite.",
  tableAlignExample: `| Gauche | Centre | Droite |
| :--- | :---: | ---: |
| a | b | c |`,

  escapeTitle: "Échappement",
  escapeText: "Une barre oblique inversée devant un caractère spécial l'affiche tel quel.",
  escapeExample: `\\# Pas un titre

1986\\. Pas une liste

2\\*3\\*4`,

  footnoteTitle: "Notes de bas de page",
  footnoteText:
    "Un appel de note entre crochets, commençant par un accent circonflexe, et la note elle-même plus loin.",
  footnoteExample: `Une affirmation[^1].

[^1]: La source de l'affirmation.`,
} satisfies Record<string, string>;

export default FR;
