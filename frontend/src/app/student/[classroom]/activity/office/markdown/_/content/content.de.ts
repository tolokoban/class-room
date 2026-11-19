import FR from "./content.fr";

const DE: typeof FR = {
  paragraphs: `Ein Markdown-Text ist in Absätze unterteilt.

Um zum nächsten Absatz zu wechseln, reicht ein Zeilenumbruch nicht aus: Man muss eine Leerzeile zwischen den beiden Absätzen lassen.

Ein einfacher Zeilenumbruch wird als Leerzeichen angezeigt: Die beiden Zeilen landen zusammen im selben Absatz.`,

  lineBreak: `Manchmal möchte man in eine neue Zeile wechseln, ohne den Absatz zu wechseln,\\
wie in einem Gedicht oder in einer Adresse.

Dazu beendet man die Zeile mit einem umgekehrten Schrägstrich,\\
direkt vor dem Zeilenumbruch.\\
Die nächste Zeile bleibt im selben Absatz.`,

  title: `# Überschriften

Eine Überschrift steht allein in ihrer Zeile.

Um eine Zeile in eine Überschrift zu verwandeln, beginnt man sie mit einer Raute, gefolgt von einem Leerzeichen.

Die Überschrift wird dann groß und fett angezeigt.

Die Anzahl der Rauten gibt die Ebene der Überschrift an.

## Zwei Rauten

Zwei Rauten ergeben eine Unterüberschrift, kleiner als die Hauptüberschrift.

### Drei Rauten

Drei Rauten ergeben eine Unter-Unterüberschrift. Man kann bis zu sechs Ebenen verwenden.`,

  bold: `# Fettschrift

Um Wörter **fett** zu schreiben, umgibt man sie auf jeder Seite mit **zwei Sternchen**.

Zwischen den Sternchen und dem umgebenen Text darf **kein Leerzeichen** stehen.

# Kursivschrift

*Kursivschrift* erhält man mit *einem einzigen Sternchen* auf jeder Seite des Textes.

Man kann statt des Sternchens auch einen *Unterstrich* verwenden.

Und nichts hindert einen daran, *kursiv* und **fett** im selben Satz zu mischen.`,

  bulletList: `# Aufzählungslisten

Jedes Element einer Aufzählungsliste:

- steht allein in seiner Zeile;
- beginnt mit einem Bindestrich, gefolgt von einem Leerzeichen;
- kann **fetten** oder *kursiven* Text enthalten.

Zwischen der Liste und dem folgenden Absatz muss eine Leerzeile stehen.`,

  numberedList: `# Nummerierte Listen

Für eine nummerierte Liste:

1. beginnt man jede Zeile mit einer Zahl;
2. lässt man auf diese Zahl einen Punkt und ein Leerzeichen folgen;
3. überlässt man Markdown die Anzeige der Nummern.

Nur die erste Zahl zählt: Sie gibt die Startnummer der Liste an.`,

  nestedList: `# Verschachtelte Listen

Eine Liste kann eine andere enthalten:

- um ein Element zu verschachteln, rückt man es nach rechts ein
  - mit Leerzeichen am Zeilenanfang,
  - bis zum Textanfang des übergeordneten Elements;
- man kann beide Listenarten mischen
  1. eine nummerierte Liste in einer Aufzählungsliste,
  2. oder umgekehrt.`,

  inlineCode: `# Code im Text

Um einen Dateinamen wie \`bericht.pdf\` oder einen Befehl wie \`ls -l\` zu schreiben, umgibt man ihn mit Backticks.

Der Text zwischen Backticks wird in einer Schrift mit fester Zeichenbreite angezeigt.

Die Sternchen darin werden **nicht** interpretiert: \`**das ist nicht fett**\`.`,

  codeBlock: `# Codeblöcke

Für Code über mehrere Zeilen schreibt man eine Zeile mit drei Backticks vor den Code und eine weitere danach.

\`\`\`
function hallo(name) {
    return "Hallo " + name
}
\`\`\`

Die Leerzeichen am Anfang der Codezeilen bleiben erhalten.`,

  quote: `# Zitate

> Um einen Text zu zitieren, beginnt man jede Zeile mit einem Größer-als-Zeichen, gefolgt von einem Leerzeichen.

Das Zitat wird eingerückt angezeigt.

> Ein Zitat kann mehrere Absätze enthalten.
>
> Die Leerzeile dazwischen muss dann ebenfalls mit einem Größer-als-Zeichen beginnen.`,

  link: `# Links

Um einen Link zu erstellen, setzt man den anklickbaren Text in eckige Klammern und direkt danach die Adresse in runde Klammern.

Hier sind zwei Links: die [Enzyklopädie Wikipedia](https://de.wikipedia.org) und der [Markdown-Leitfaden](https://www.markdownguide.org).

Eine Adresse, die mit https beginnt, wird auch von allein zu einem Link.`,

  separator: `# Trennlinien

Eine Zeile, die nur drei Bindestriche enthält, zeichnet eine waagrechte Linie.

---

Vor den drei Bindestrichen muss eine Leerzeile stehen. Sonst wird die Zeile darüber zu einer Überschrift!

---

Diese Linie dient dazu, die Teile eines Textes zu trennen.`,

  table: `# Tabellen

In einer Tabelle werden die Zellen durch senkrechte Striche getrennt.

| Zeile | Rolle |
| --- | --- |
| Erste | Die Spaltenüberschriften |
| Zweite | Nur Bindestriche, um die Überschriften vom Inhalt zu trennen |
| Weitere | Der Inhalt der Tabelle |

Vor und nach der Tabelle muss eine Leerzeile stehen.`,

  tableAlign: `# Die Ausrichtung der Spalten

In der Zeile mit den Bindestrichen legen Doppelpunkte die Ausrichtung jeder Spalte fest.

| Links | Zentriert | Rechts |
| :--- | :---: | ---: |
| Doppelpunkt vor den Bindestrichen | Doppelpunkte auf beiden Seiten | Doppelpunkt nach den Bindestrichen |`,

  taskList: `# Aufgabenlisten

- [x] Jedes Element mit einem Bindestrich beginnen, wie in einer Aufzählungsliste.
- [x] Eckige Klammern mit einem Leerzeichen dazwischen einfügen, um ein leeres Kästchen zu erhalten.
- [ ] Dieses Leerzeichen durch den Buchstaben x ersetzen, um das Kästchen anzukreuzen.`,

  escape: `# Maskieren

Manche Zeichen haben in Markdown eine besondere Bedeutung. Um sie unverändert anzuzeigen, setzt man einen umgekehrten Schrägstrich davor.

\\# Diese Zeile beginnt mit einer Raute, ist aber keine Überschrift.

1986\\. Das ist keine nummerierte Liste, sondern eine Jahreszahl.

Die Rechnung 2\\*3\\*4 ergibt 24.`,

  recap: `# Zusammenfassung

## Was Sie können

Sie wissen jetzt, wie man einen Text mit Markdown formatiert:

1. **Überschriften** mit mehreren Ebenen;
2. Text in *kursiv* oder in **fett**;
3. Listen
   - mit Aufzählungszeichen,
   - mit Nummern,
   - oder mit Aufgaben.

---

## Weiterführendes

> Markdown ist überall: in Foren, Wikis, Entwicklungswerkzeugen,\\
> und sogar in den Nachrichten, die man an eine KI schreibt.

| Element | Syntax |
| --- | --- |
| Code im Text | \`Backticks\` |
| Link | [eckige und runde Klammern](https://www.markdownguide.org) |

\`\`\`text
Ein Codeblock behält    seine Leerzeichen.
\`\`\``,

  challenge: `# Abschlussaufgabe

## Ein *sehr* **geheimes** Rezept

Diese Aufgabe mischt **alle** bisher gesehenen Syntaxen.\\
Nehmen Sie sich Zeit: Jedes Detail zählt.

### Zutaten

- [x] 2 Eier
- [x] 100 g **Mehl**
- [ ] 1 Prise *Salz*

### Schritte

1. In einer Schüssel mischen:
   - das Mehl,
   - die Eier
     1. eines nach dem anderen,
     2. ohne aufzuhören.
2. Bei \`180°C\` 2\\*3\\*5 Minuten backen.

> **Tipp** vom Küchenchef:\\
> lesen Sie die [Markdown-Anleitung](https://www.markdownguide.org).

---

| Schritt | Dauer | Preis |
| :--- | :---: | ---: |
| Vorbereitung | *10 min* | \`2 €\` |
| Backen | **30 min** | \`1 €\` |

\\# Das ist keine Überschrift.

\`\`\`python
def backen(minuten):
    return "Fertig in " + str(minuten) + " min"
\`\`\``,
};

export default DE;
