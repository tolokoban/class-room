import FR from "./translation.fr";

const DE: typeof FR = {
  title: "Markdown-Spickzettel",
  close: "Schließen",
  code: "Code",
  result: "Ergebnis",

  paragraphsTitle: "Absätze",
  paragraphsText:
    "Eine Leerzeile trennt zwei Absätze. Ein einfacher Zeilenumbruch wird als Leerzeichen angezeigt.",
  paragraphsExample: `Erster Absatz,
immer noch der erste.

Zweiter Absatz.`,

  lineBreakTitle: "Zeilenumbruch",
  lineBreakText:
    "Ein umgekehrter Schrägstrich am Zeilenende erzwingt einen Zeilenumbruch im selben Absatz. Zwei Leerzeichen am Zeilenende bewirken dasselbe, sind aber unsichtbar.",
  lineBreakExample: `Seestrasse 12\\
8002 Zürich`,

  titleTitle: "Überschriften",
  titleText:
    "Eine Raute, gefolgt von einem Leerzeichen, am Anfang einer Zeile macht sie zu einer Überschrift.",
  titleExample: `# Meine Überschrift`,

  subtitlesTitle: "Überschriftenebenen",
  subtitlesText: "Die Anzahl der Rauten (von 1 bis 6) gibt die Ebene der Überschrift an.",
  subtitlesExample: `## Unterüberschrift

### Unter-Unterüberschrift`,

  boldTitle: "Fett",
  boldText: "Zwei Sternchen (oder zwei Unterstriche) auf jeder Seite des Textes.",
  boldExample: `Ein Wort in **fett**, ein anderes in __fett__.`,

  italicTitle: "Kursiv",
  italicText:
    "Ein Sternchen (oder ein Unterstrich) auf jeder Seite des Textes. Drei Sternchen ergeben fett und kursiv.",
  italicExample: `Ein Wort in *kursiv*, ein anderes in _kursiv_ und eines in ***fett kursiv***.`,

  strikethroughTitle: "Durchgestrichen",
  strikethroughText: "Zwei Tilden auf jeder Seite des Textes.",
  strikethroughExample: `Ein ~~durchgestrichener~~ Preis.`,

  bulletListTitle: "Aufzählungslisten",
  bulletListText:
    "Jedes Element beginnt mit einem Bindestrich (oder einem Sternchen oder einem Plus), gefolgt von einem Leerzeichen. Lassen Sie nach der Liste eine Leerzeile.",
  bulletListExample: `- Äpfel
- Birnen
- Aprikosen`,

  numberedListTitle: "Nummerierte Listen",
  numberedListText:
    "Jedes Element beginnt mit einer Zahl, einem Punkt und einem Leerzeichen. Nur die erste Zahl zählt: Sie gibt die Startnummer an.",
  numberedListExample: `1. Backofen vorheizen
2. Mischen
3. Backen`,

  nestedListTitle: "Verschachtelte Listen",
  nestedListText:
    "Rücken Sie die Elemente der Unterliste mit Leerzeichen ein, bis zum Textanfang des übergeordneten Elements.",
  nestedListExample: `- Früchte
  - Äpfel
  - Birnen
- Gemüse
  1. Karotten
  2. Lauch`,

  taskListTitle: "Aufgabenlisten",
  taskListText:
    "Eine Aufzählungsliste, deren Elemente mit einem Kästchen beginnen: eckige Klammern mit einem Leerzeichen (leer) oder einem x (angekreuzt).",
  taskListExample: `- [x] Einkaufen gehen
- [ ] Die Küche aufräumen`,

  inlineCodeTitle: "Code im Text",
  inlineCodeText: "Backticks um den Text. Was darin steht, wird nicht interpretiert.",
  inlineCodeExample: "Öffnen Sie die Datei `notizen.txt`, ohne `**fett**`.",

  codeBlockTitle: "Codeblöcke",
  codeBlockText:
    "Eine Zeile mit drei Backticks (oder drei Tilden) vor dem Code und eine weitere danach.",
  codeBlockExample: `\`\`\`
for i in range(3):
    print(i)
\`\`\``,

  quoteTitle: "Zitate",
  quoteText:
    "Ein Größer-als-Zeichen, gefolgt von einem Leerzeichen, am Anfang jeder Zeile, auch in den Leerzeilen des Zitats.",
  quoteExample: `> Erster Absatz des Zitats.
>
> Zweiter Absatz.`,

  linkTitle: "Links",
  linkText:
    "Der anklickbare Text in eckigen Klammern, gefolgt von der Adresse in runden Klammern. Eine Adresse, die mit https beginnt, wird von allein zu einem Link.",
  linkExample: `Besuchen Sie [Wikipedia](https://de.wikipedia.org)
oder https://www.markdownguide.org`,

  imageTitle: "Bilder",
  imageText:
    "Wie ein Link, mit einem Ausrufezeichen davor. Der Text in eckigen Klammern beschreibt das Bild.",
  imageExample: `![Markdown-Logo](https://upload.wikimedia.org/wikipedia/commons/4/48/Markdown-mark.svg)`,

  separatorTitle: "Trennlinien",
  separatorText:
    "Eine Zeile mit nur drei Bindestrichen (oder drei Sternchen). Lassen Sie davor eine Leerzeile.",
  separatorExample: `Erster Teil

---

Zweiter Teil`,

  tableTitle: "Tabellen",
  tableText:
    "Die Zellen werden durch senkrechte Striche getrennt. Die zweite Zeile enthält nur Bindestriche und trennt die Überschriften vom Inhalt.",
  tableExample: `| Name | Alter |
| --- | --- |
| Alice | 16 |
| Bob | 17 |`,

  tableAlignTitle: "Ausrichtung der Spalten",
  tableAlignText:
    "In der Zeile mit den Bindestrichen richten Doppelpunkte links, auf beiden Seiten oder rechts die Spalte links, zentriert oder rechts aus.",
  tableAlignExample: `| Links | Zentriert | Rechts |
| :--- | :---: | ---: |
| a | b | c |`,

  escapeTitle: "Maskieren",
  escapeText: "Ein umgekehrter Schrägstrich vor einem Sonderzeichen zeigt es unverändert an.",
  escapeExample: `\\# Keine Überschrift

1986\\. Keine Liste

2\\*3\\*4`,

  footnoteTitle: "Fußnoten",
  footnoteText:
    "Ein Fußnotenverweis in eckigen Klammern, der mit einem Zirkumflex beginnt, und weiter unten die Fußnote selbst.",
  footnoteExample: `Eine Behauptung[^1].

[^1]: Die Quelle der Behauptung.`,
};

export default DE;
