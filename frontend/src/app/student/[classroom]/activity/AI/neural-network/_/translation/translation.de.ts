import FR from "./translation.fr";

const DE: typeof FR = {
  explanation: `## Eine Tabelle auswendig lernen

Die Tabelle oben auf dem Bildschirm hat **7 Felder**: 2 ❤️, 1 💰 und 4 💀.
Wir möchten, dass ein **neuronales Netz** den Inhalt jedes Feldes lernt, nur anhand seiner **Nummer**.

- 🟢 **Eingaben**: die Nummer des Feldes, binär mit 3 Ziffern geschrieben.
- 🔵 **Verborgene Schicht**: 4 Neuronen, die die Eingaben kombinieren.
- 🟡 **Ausgaben**: die Sicherheit des Netzes für jedes Objekt. Die größte ist seine Antwort.

Am Anfang sind die Koeffizienten **zufällig**: Das Netz antwortet irgendetwas.
Nach jedem Versuch werden die Koeffizienten **ein wenig korrigiert**, damit die richtige Antwort wahrscheinlicher wird.`,
  intro:
    "Klicke auf ein Feld der Tabelle: Das neuronale Netz versucht zu erraten, was es enthält, dann werden seine Koeffizienten korrigiert. Mach weiter, bis es alle Felder errät!",
  addRounds: "$1 Trainingsschritte hinzufügen",
  rounds:
    "$1 Trainingsschritte: Jedes Mal rät das Netz ein zufälliges Feld, dann werden seine Koeffizienten korrigiert.",
  correct: "Feld $1: Das Netz antwortet $2 mit $3 % Sicherheit. Richtig!",
  wrong: "Feld $1: Das Netz antwortet $2 mit $3 % Sicherheit, aber es war $4. Falsch!",
};

export default DE;
