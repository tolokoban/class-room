import FR from "./translation.fr";

const DE: typeof FR = {
	title: "Anonymisierung von Dokumenten",
	anonymize: "Anonymisieren",
	placeholder: "Schreiben oder fügen Sie hier einen Text im Markdown-Format ein…",
	loading: "KI-Modell wird geladen… $1 %",
	loadingRemaining: "KI-Modell wird geladen… $1 % (noch etwa $2)",
	error: "Das Modell kann nicht geladen werden: $1",
	example: `# Anmeldeformular

Hallo, ich heisse **Anna Müller** und bin am 14. März 2009 geboren.
Ich wohne an der Bahnhofstrasse 12, 8001 Zürich.

- E-Mail: anna.mueller@posteo.ch
- Telefon: +41 79 123 45 67
- IBAN: CH93 0076 2011 6238 5295 7

Mein Passwort für die Schulwebsite ist \`Sup3rS3cret!\`.
`,
};

export default DE;
