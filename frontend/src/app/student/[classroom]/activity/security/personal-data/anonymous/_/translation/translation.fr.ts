const FR = {
	title: "Anonymisation de documents",
	anonymize: "Anonymiser",
	placeholder: "Écrivez ou collez ici un texte au format Markdown…",
	loading: "Chargement du modèle d'IA… $1 %",
	loadingRemaining: "Chargement du modèle d'IA… $1 % (encore environ $2)",
	error: "Impossible de charger le modèle : $1",
	example: `# Dossier d'inscription

Bonjour, je m'appelle **Jean Dupont** et je suis né le 14 mars 2009.
J'habite 12 rue de la Paix, 1003 Lausanne.

- Courriel : jean.dupont@posteo.ch
- Téléphone : +41 79 123 45 67
- IBAN : CH93 0076 2011 6238 5295 7

Mon mot de passe pour le site de l'école est \`Sup3rS3cret!\`.
`,
} satisfies Record<string, string>;

export default FR;
