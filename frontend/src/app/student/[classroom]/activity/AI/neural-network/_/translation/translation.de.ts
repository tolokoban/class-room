import FR from "./translation.fr";

const DE: typeof FR = {
  explanation: `## Ein Kartenspiel auswendig lernen

Das Kartenspiel oben auf dem Bildschirm hat **7 Karten**: 3 ♠️, 2 ♥️, 1 ♦️ und 1 ♣️.
Wir möchten, dass ein **neuronales Netz** die Farbe jeder Karte lernt, nur anhand ihrer **Nummer**.

- 🟢 **Eingaben**: die Nummer der Karte, binär mit 3 Ziffern geschrieben.
- 🔵 **Verborgene Schicht**: 4 Neuronen, die die Eingaben kombinieren.
- 🟡 **Ausgaben**: die Sicherheit des Netzes für jede Farbe (♠️, ♥️, ♦️ und ♣️). Die größte ist seine Antwort.

Am Anfang sind die Koeffizienten **zufällig**: Das Netz antwortet irgendetwas.
Nach jedem Versuch werden die Koeffizienten **ein wenig korrigiert**, damit die richtige Antwort wahrscheinlicher wird.`,
  intro:
    "Klicke auf eine Karte des Kartenspiels: Das neuronale Netz versucht, ihre Farbe zu erraten, dann werden seine Koeffizienten korrigiert. Mach weiter, bis es alle Karten errät!",
  addRounds: "$1 Trainingsschritte hinzufügen",
  rounds:
    "$1 Trainingsschritte: Jedes Mal rät das Netz eine zufällige Karte, dann werden seine Koeffizienten korrigiert.",
  correct: "Karte $1: Das Netz antwortet $2 mit $3 % Sicherheit. Richtig!",
  wrong: "Karte $1: Das Netz antwortet $2 mit $3 % Sicherheit, aber es war $4. Falsch!",
};

export default DE;
