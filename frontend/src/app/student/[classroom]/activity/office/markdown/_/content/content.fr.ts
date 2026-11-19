/**
 * Markdown code expected for each exercise.
 * The initial code given to the student is the same text without any syntax
 * (see `stripMarkdown()`).
 * Each exercise introduces a new syntax, and can reuse the previous ones only.
 * The text describes the new syntax, without showing it.
 */
const FR = {
  paragraphs: `Un texte Markdown est découpé en paragraphes.

Pour passer au paragraphe suivant, il ne suffit pas d'aller à la ligne : il faut laisser une ligne vide entre les deux paragraphes.

Un simple retour à la ligne est affiché comme une espace : les deux lignes se retrouvent collées dans le même paragraphe.`,

  lineBreak: `Parfois, on veut aller à la ligne sans changer de paragraphe,\\
comme dans un poème ou dans une adresse.

Pour cela, on termine la ligne par une barre oblique inversée,\\
juste avant le retour à la ligne.\\
La ligne suivante reste dans le même paragraphe.`,

  title: `# Les titres

Un titre se trouve seul sur sa ligne.

Pour transformer une ligne en titre, on la commence par un dièse suivi d'une espace.

Le titre est alors affiché en grand et en gras.

Le nombre de dièses indique le niveau du titre.

## Deux dièses

Deux dièses donnent un sous-titre, plus petit que le titre principal.

### Trois dièses

Trois dièses donnent un sous-sous-titre. On peut aller jusqu'à six niveaux.`,

  bold: `# Le gras

Pour mettre des mots en **gras**, on les entoure de **deux astérisques** de chaque côté.

Il ne faut **pas d'espace** entre les astérisques et le texte qu'ils entourent.

# L'italique

L'*italique* s'obtient avec *un seul astérisque* de chaque côté du texte.

On peut aussi utiliser un *tiret bas* à la place de l'astérisque.

Et rien n'empêche de mélanger l'*italique* et le **gras** dans la même phrase.`,

  bulletList: `# Les listes à puces

Chaque élément d'une liste à puces :

- est seul sur sa ligne ;
- commence par un tiret suivi d'une espace ;
- peut contenir du texte en **gras** ou en *italique*.

Il faut une ligne vide entre la liste et le paragraphe qui la suit.`,

  numberedList: `# Les listes numérotées

Pour faire une liste numérotée :

1. on commence chaque ligne par un nombre ;
2. on fait suivre ce nombre d'un point et d'une espace ;
3. on laisse Markdown afficher les numéros.

Seul le premier nombre compte : il donne le numéro de départ de la liste.`,

  nestedList: `# Les listes imbriquées

Une liste peut en contenir une autre :

- pour imbriquer un élément, on le décale vers la droite
  - avec des espaces au début de la ligne,
  - jusqu'au début du texte de l'élément parent ;
- on peut mélanger les deux types de listes
  1. une liste numérotée dans une liste à puces,
  2. ou l'inverse.`,

  inlineCode: `# Le code dans le texte

Pour écrire un nom de fichier comme \`rapport.pdf\` ou une commande comme \`ls -l\`, on l'entoure d'accents graves.

Le texte entre accents graves est affiché avec une police à chasse fixe.

Les astérisques qu'il contient ne sont **pas** interprétés : \`**ceci n'est pas en gras**\`.`,

  codeBlock: `# Les blocs de code

Pour un code de plusieurs lignes, on écrit une ligne de trois accents graves avant le code, et une autre après.

\`\`\`
function bonjour(nom) {
    return "Bonjour " + nom
}
\`\`\`

Les espaces au début des lignes du code sont conservées.`,

  quote: `# Les citations

> Pour citer un texte, on commence chaque ligne par un chevron fermant suivi d'une espace.

La citation est affichée en retrait.

> Une citation peut contenir plusieurs paragraphes.
>
> La ligne vide qui les sépare doit alors aussi commencer par un chevron.`,

  link: `# Les liens

Pour créer un lien, on met le texte cliquable entre crochets, puis l'adresse entre parenthèses, juste après.

Voici deux liens : l'[encyclopédie Wikipédia](https://fr.wikipedia.org) et le [guide de Markdown](https://www.markdownguide.org).

Une adresse qui commence par https devient aussi un lien toute seule.`,

  separator: `# Les séparateurs

Une ligne qui ne contient que trois tirets trace un trait horizontal.

---

Il faut une ligne vide avant les trois tirets. Sinon, la ligne du dessus devient un titre !

---

Ce trait sert à séparer les parties d'un texte.`,

  table: `# Les tableaux

Dans un tableau, les cellules sont séparées par des barres verticales.

| Ligne | Rôle |
| --- | --- |
| Première | Les titres des colonnes |
| Deuxième | Seulement des tirets, pour séparer les titres du contenu |
| Suivantes | Le contenu du tableau |

Il faut une ligne vide avant et après le tableau.`,

  tableAlign: `# L'alignement des colonnes

Dans la ligne de tirets, des deux-points règlent l'alignement de chaque colonne.

| À gauche | Au centre | À droite |
| :--- | :---: | ---: |
| deux-points avant les tirets | deux-points des deux côtés | deux-points après les tirets |`,

  taskList: `# Les listes de tâches

- [x] Commencer chaque élément par un tiret, comme dans une liste à puces.
- [x] Ajouter des crochets avec une espace entre eux pour obtenir une case vide.
- [ ] Remplacer cette espace par la lettre x pour cocher la case.`,

  escape: `# L'échappement

Certains caractères ont un sens spécial en Markdown. Pour les afficher tels quels, on les fait précéder d'une barre oblique inversée.

\\# Cette ligne commence par un dièse, mais ce n'est pas un titre.

1986\\. Ceci n'est pas une liste numérotée, c'est une année.

Le calcul 2\\*3\\*4 donne 24.`,

  recap: `# Récapitulatif

## Ce que vous savez faire

Vous savez maintenant mettre en forme un texte avec Markdown :

1. des **titres** de plusieurs niveaux ;
2. du texte en *italique* ou en **gras** ;
3. des listes
   - à puces,
   - numérotées,
   - ou de tâches.

---

## Pour aller plus loin

> Markdown est partout : dans les forums, les wikis, les outils de développement,\\
> et même dans les messages que l'on écrit à une IA.

| Élément | Syntaxe |
| --- | --- |
| Code dans le texte | \`accents graves\` |
| Lien | [crochets et parenthèses](https://www.markdownguide.org) |

\`\`\`text
Un bloc de code garde    ses espaces.
\`\`\``,

  challenge: `# Défi final

## Une recette *très* **secrète**

Ce défi mélange **toutes** les syntaxes vues jusqu'ici.\\
Prenez votre temps : chaque détail compte.

### Ingrédients

- [x] 2 œufs
- [x] 100 g de **farine**
- [ ] 1 pincée de *sel*

### Étapes

1. Mélanger dans un saladier :
   - la farine,
   - les œufs
     1. un par un,
     2. sans s'arrêter.
2. Cuire à \`180°C\` pendant 2\\*3\\*5 minutes.

> **Astuce** du chef :\\
> consultez le [guide Markdown](https://www.markdownguide.org).

---

| Étape | Durée | Prix |
| :--- | :---: | ---: |
| Préparation | *10 min* | \`2 €\` |
| Cuisson | **30 min** | \`1 €\` |

\\# Ceci n'est pas un titre.

\`\`\`python
def cuire(minutes):
    return "Prêt dans " + str(minutes) + " min"
\`\`\``,
} satisfies Record<string, string>;

export default FR;
