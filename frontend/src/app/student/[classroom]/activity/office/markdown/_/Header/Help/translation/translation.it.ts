import FR from "./translation.fr";

const IT: typeof FR = {
  title: "Promemoria Markdown",
  close: "Chiudi",
  download: "Scarica",
  code: "Codice",
  result: "Risultato",

  paragraphsTitle: "Paragrafi",
  paragraphsText:
    "Una riga vuota separa due paragrafi. Un semplice ritorno a capo viene visualizzato come uno spazio.",
  paragraphsExample: `Primo paragrafo,
sempre il primo.

Secondo paragrafo.`,

  lineBreakTitle: "Ritorno a capo",
  lineBreakText:
    "Una barra rovesciata a fine riga forza un ritorno a capo nello stesso paragrafo. Due spazi a fine riga fanno la stessa cosa, ma sono invisibili.",
  lineBreakExample: `Via del Lago 12\\
6900 Lugano`,

  titleTitle: "Titoli",
  titleText:
    "Un cancelletto seguito da uno spazio all'inizio di una riga la trasforma in un titolo.",
  titleExample: `# Il mio titolo`,

  subtitlesTitle: "Livelli dei titoli",
  subtitlesText: "Il numero di cancelletti (da 1 a 6) indica il livello del titolo.",
  subtitlesExample: `## Sottotitolo

### Sotto-sottotitolo`,

  boldTitle: "Grassetto",
  boldText: "Due asterischi (o due trattini bassi) da ogni lato del testo.",
  boldExample: `Una parola in **grassetto**, un'altra in __grassetto__.`,

  italicTitle: "Corsivo",
  italicText:
    "Un asterisco (o un trattino basso) da ogni lato del testo. Tre asterischi danno il grassetto corsivo.",
  italicExample: `Una parola in *corsivo*, un'altra in _corsivo_ e una in ***grassetto corsivo***.`,

  strikethroughTitle: "Testo barrato",
  strikethroughText: "Due tilde da ogni lato del testo.",
  strikethroughExample: `Un prezzo ~~barrato~~.`,

  bulletListTitle: "Elenchi puntati",
  bulletListText:
    "Ogni elemento inizia con un trattino (o un asterisco, o un più) seguito da uno spazio. Lasciare una riga vuota dopo l'elenco.",
  bulletListExample: `- Mele
- Pere
- Albicocche`,

  numberedListTitle: "Elenchi numerati",
  numberedListText:
    "Ogni elemento inizia con un numero, un punto e uno spazio. Conta solo il primo numero: indica il numero di partenza.",
  numberedListExample: `1. Preriscaldare il forno
2. Mescolare
3. Cuocere`,

  nestedListTitle: "Elenchi annidati",
  nestedListText:
    "Spostare gli elementi del sottoelenco con degli spazi, fino all'inizio del testo dell'elemento genitore.",
  nestedListExample: `- Frutta
  - Mele
  - Pere
- Verdura
  1. Carote
  2. Porri`,

  taskListTitle: "Elenchi di attività",
  taskListText:
    "Un elenco puntato i cui elementi iniziano con una casella: parentesi quadre con uno spazio (vuota) o una x (spuntata).",
  taskListExample: `- [x] Fare la spesa
- [ ] Riordinare la cucina`,

  inlineCodeTitle: "Codice nel testo",
  inlineCodeText:
    "Degli accenti gravi attorno al testo. Ciò che sta all'interno non viene interpretato.",
  inlineCodeExample: "Aprire il file `appunti.txt`, senza `**grassetto**`.",

  codeBlockTitle: "Blocchi di codice",
  codeBlockText: "Una riga di tre accenti gravi (o tre tilde) prima del codice, e un'altra dopo.",
  codeBlockExample: `\`\`\`
for i in range(3):
    print(i)
\`\`\``,

  quoteTitle: "Citazioni",
  quoteText:
    "Un segno di maggiore seguito da uno spazio all'inizio di ogni riga, comprese le righe vuote della citazione.",
  quoteExample: `> Primo paragrafo della citazione.
>
> Secondo paragrafo.`,

  linkTitle: "Link",
  linkText:
    "Il testo cliccabile tra parentesi quadre, seguito dall'indirizzo tra parentesi tonde. Un indirizzo che inizia con https diventa un link da solo.",
  linkExample: `Visitare [Wikipedia](https://it.wikipedia.org)
o https://www.markdownguide.org`,

  imageTitle: "Immagini",
  imageText:
    "Come un link, preceduto da un punto esclamativo. Il testo tra parentesi quadre descrive l'immagine.",
  imageExample: `![Logo di Markdown](https://upload.wikimedia.org/wikipedia/commons/4/48/Markdown-mark.svg)`,

  separatorTitle: "Separatori",
  separatorText:
    "Una riga con solo tre trattini (o tre asterischi). Lasciare una riga vuota prima.",
  separatorExample: `Prima parte

---

Seconda parte`,

  tableTitle: "Tabelle",
  tableText:
    "Le celle sono separate da barre verticali. La seconda riga contiene solo trattini e separa i titoli dal contenuto.",
  tableExample: `| Nome | Età |
| --- | --- |
| Alice | 16 |
| Bob | 17 |`,

  tableAlignTitle: "Allineamento delle colonne",
  tableAlignText:
    "Nella riga di trattini, i due punti a sinistra, da entrambi i lati o a destra allineano la colonna a sinistra, al centro o a destra.",
  tableAlignExample: `| Sinistra | Centro | Destra |
| :--- | :---: | ---: |
| a | b | c |`,

  escapeTitle: "Escape",
  escapeText: "Una barra rovesciata davanti a un carattere speciale lo visualizza così com'è.",
  escapeExample: `\\# Non è un titolo

1986\\. Non è un elenco

2\\*3\\*4`,

  footnoteTitle: "Note a piè di pagina",
  footnoteText:
    "Un richiamo di nota tra parentesi quadre, che inizia con un accento circonflesso, e la nota stessa più avanti.",
  footnoteExample: `Un'affermazione[^1].

[^1]: La fonte dell'affermazione.`,
};

export default IT;
