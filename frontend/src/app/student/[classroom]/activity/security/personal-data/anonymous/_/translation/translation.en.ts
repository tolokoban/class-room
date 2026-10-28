import FR from "./translation.fr";

const EN: typeof FR = {
	title: "Document anonymization",
	anonymize: "Anonymize",
	placeholder: "Write or paste a Markdown text here…",
	loading: "Loading the AI model… $1 %",
	loadingRemaining: "Loading the AI model… $1 % (about $2 left)",
	error: "Unable to load the model: $1",
	example: `# Registration form

Hello, my name is **John Smith** and I was born on March 14, 2009.
I live at 12 Baker Street, London NW1 6XE.

- Email: john.smith@posteo.co.uk
- Phone: +44 20 7946 0958
- IBAN: GB29 NWBK 6016 1331 9268 19

My password for the school website is \`Sup3rS3cret!\`.
`,
};

export default EN;
