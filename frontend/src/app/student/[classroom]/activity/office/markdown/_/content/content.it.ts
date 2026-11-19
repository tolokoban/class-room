import FR from "./content.fr";

const IT: typeof FR = {
  paragraphs: `Un testo Markdown è suddiviso in paragrafi.

Per passare al paragrafo successivo non basta andare a capo: bisogna lasciare una riga vuota tra i due paragrafi.

Un semplice ritorno a capo viene visualizzato come uno spazio: le due righe finiscono attaccate nello stesso paragrafo.`,

  lineBreak: `A volte si vuole andare a capo senza cambiare paragrafo,\\
come in una poesia o in un indirizzo.

Per farlo, si termina la riga con una barra rovesciata,\\
subito prima del ritorno a capo.\\
La riga successiva resta nello stesso paragrafo.`,

  title: `# I titoli

Un titolo si trova da solo sulla sua riga.

Per trasformare una riga in un titolo, la si inizia con un cancelletto seguito da uno spazio.

Il titolo viene allora visualizzato grande e in grassetto.

Il numero di cancelletti indica il livello del titolo.

## Due cancelletti

Due cancelletti danno un sottotitolo, più piccolo del titolo principale.

### Tre cancelletti

Tre cancelletti danno un sotto-sottotitolo. Si può arrivare fino a sei livelli.`,

  bold: `# Il grassetto

Per mettere delle parole in **grassetto**, le si circonda con **due asterischi** da ogni lato.

Non ci deve essere **nessuno spazio** tra gli asterischi e il testo che circondano.

# Il corsivo

Il *corsivo* si ottiene con *un solo asterisco* da ogni lato del testo.

Si può anche usare un *trattino basso* al posto dell'asterisco.

E niente impedisce di mescolare il *corsivo* e il **grassetto** nella stessa frase.`,

  bulletList: `# Gli elenchi puntati

Ogni elemento di un elenco puntato:

- si trova da solo sulla sua riga;
- inizia con un trattino seguito da uno spazio;
- può contenere testo in **grassetto** o in *corsivo*.

Ci vuole una riga vuota tra l'elenco e il paragrafo che lo segue.`,

  numberedList: `# Gli elenchi numerati

Per fare un elenco numerato:

1. si inizia ogni riga con un numero;
2. si fa seguire questo numero da un punto e da uno spazio;
3. si lascia che Markdown visualizzi i numeri.

Conta solo il primo numero: indica il numero di partenza dell'elenco.`,

  nestedList: `# Gli elenchi annidati

Un elenco può contenerne un altro:

- per annidare un elemento, lo si sposta verso destra
  - con degli spazi all'inizio della riga,
  - fino all'inizio del testo dell'elemento genitore;
- si possono mescolare i due tipi di elenco
  1. un elenco numerato in un elenco puntato,
  2. o il contrario.`,

  inlineCode: `# Il codice nel testo

Per scrivere un nome di file come \`relazione.pdf\` o un comando come \`ls -l\`, lo si circonda con degli accenti gravi.

Il testo tra accenti gravi viene visualizzato con un carattere a spaziatura fissa.

Gli asterischi che contiene **non** vengono interpretati: \`**questo non è in grassetto**\`.`,

  codeBlock: `# I blocchi di codice

Per un codice su più righe, si scrive una riga di tre accenti gravi prima del codice, e un'altra dopo.

\`\`\`
function ciao(nome) {
    return "Ciao " + nome
}
\`\`\`

Gli spazi all'inizio delle righe del codice vengono conservati.`,

  quote: `# Le citazioni

> Per citare un testo, si inizia ogni riga con un segno di maggiore seguito da uno spazio.

La citazione viene visualizzata rientrata.

> Una citazione può contenere più paragrafi.
>
> La riga vuota che li separa deve allora iniziare anch'essa con un segno di maggiore.`,

  link: `# I link

Per creare un link, si mette il testo cliccabile tra parentesi quadre, poi l'indirizzo tra parentesi tonde, subito dopo.

Ecco due link: l'[enciclopedia Wikipedia](https://it.wikipedia.org) e la [guida di Markdown](https://www.markdownguide.org).

Anche un indirizzo che inizia con https diventa un link da solo.`,

  separator: `# I separatori

Una riga che contiene solo tre trattini traccia una linea orizzontale.

---

Ci vuole una riga vuota prima dei tre trattini. Altrimenti, la riga sopra diventa un titolo!

---

Questa linea serve a separare le parti di un testo.`,

  table: `# Le tabelle

In una tabella, le celle sono separate da barre verticali.

| Riga | Ruolo |
| --- | --- |
| Prima | I titoli delle colonne |
| Seconda | Solo trattini, per separare i titoli dal contenuto |
| Successive | Il contenuto della tabella |

Ci vuole una riga vuota prima e dopo la tabella.`,

  tableAlign: `# L'allineamento delle colonne

Nella riga di trattini, i due punti regolano l'allineamento di ogni colonna.

| A sinistra | Al centro | A destra |
| :--- | :---: | ---: |
| due punti prima dei trattini | due punti da entrambi i lati | due punti dopo i trattini |`,

  taskList: `# Gli elenchi di attività

- [x] Iniziare ogni elemento con un trattino, come in un elenco puntato.
- [x] Aggiungere delle parentesi quadre con uno spazio tra di loro per ottenere una casella vuota.
- [ ] Sostituire questo spazio con la lettera x per spuntare la casella.`,

  escape: `# L'escape

Alcuni caratteri hanno un significato speciale in Markdown. Per visualizzarli così come sono, li si fa precedere da una barra rovesciata.

\\# Questa riga inizia con un cancelletto, ma non è un titolo.

1986\\. Questo non è un elenco numerato, è un anno.

Il calcolo 2\\*3\\*4 dà 24.`,

  recap: `# Riepilogo

## Che cosa sapete fare

Ora sapete formattare un testo con Markdown:

1. dei **titoli** di più livelli;
2. del testo in *corsivo* o in **grassetto**;
3. degli elenchi
   - puntati,
   - numerati,
   - o di attività.

---

## Per approfondire

> Markdown è ovunque: nei forum, nei wiki, negli strumenti di sviluppo,\\
> e persino nei messaggi che si scrivono a un'IA.

| Elemento | Sintassi |
| --- | --- |
| Codice nel testo | \`accenti gravi\` |
| Link | [parentesi quadre e tonde](https://www.markdownguide.org) |

\`\`\`text
Un blocco di codice conserva    i suoi spazi.
\`\`\``,

  challenge: `# Sfida finale

## Una ricetta *molto* **segreta**

Questa sfida mescola **tutte** le sintassi viste finora.\\
Prenditi il tuo tempo: ogni dettaglio conta.

### Ingredienti

- [x] 2 uova
- [x] 100 g di **farina**
- [ ] 1 pizzico di *sale*

### Passaggi

1. Mescolare in una ciotola:
   - la farina,
   - le uova
     1. una alla volta,
     2. senza fermarsi.
2. Cuocere a \`180°C\` per 2\\*3\\*5 minuti.

> **Consiglio** dello chef:\\
> consulta la [guida Markdown](https://www.markdownguide.org).

---

| Passaggio | Durata | Prezzo |
| :--- | :---: | ---: |
| Preparazione | *10 min* | \`2 €\` |
| Cottura | **30 min** | \`1 €\` |

\\# Questo non è un titolo.

\`\`\`python
def cuocere(minuti):
    return "Pronto in " + str(minuti) + " min"
\`\`\``,
};

export default IT;
