import FR from "./translation.fr";

const IT: typeof FR = {
  titleNew: "Nuova produzione scritta",
  titleEdit: "Modifica «$1»",
  name: "Nome",
  duration: "Durata dell'esercizio (minuti)",
  expiration: "Eliminazione dei file (ore dopo la fine)",
  description: "Istruzioni (Markdown)",
  edit: "Modifica",
  view: "Anteprima",
  placeholder: "Descrivi cosa devono produrre gli studenti...",
  files: "File previsti",
  filesHint:
    "Il nome di un file previsto fa parte del nome dei file scaricati: «pseudonimo.nome.xxxxxx.ext».",
  addFile: "Aggiungi un file previsto",
  save: "Salva",
  delete: "Elimina",
  saved: "La produzione scritta «$1» è stata salvata.",
  deleteConfirm:
    "Eliminare definitivamente «$1»? Sarà rimossa da tutte le classi e tutti i file caricati dagli studenti saranno eliminati.",
  deleted: "La produzione scritta «$1» è stata eliminata.",
  filesChangedConfirm:
    "Hai rimosso o rinominato dei file previsti. I $1 file già caricati dagli studenti per essi saranno eliminati definitivamente. Continuare?",
  errorName: "Inserisci un nome.",
  errorNoFile: "È necessario almeno un file previsto.",
  errorFileName:
    'Nome del file previsto non valido: «$1». Non deve iniziare con un punto né contenere / \\ : * ? " < > |',
  errorFileDuplicate: "Due file previsti hanno lo stesso nome: «$1».",
};

export default IT;
