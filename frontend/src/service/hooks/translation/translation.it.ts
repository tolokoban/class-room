import FR from "./translation.fr";

const IT: typeof FR = {
  // Generic errors (frontend/src/service/calls/service.ts)
  all1: "Formato di risposta inatteso.",

  // user/login
  all10101: "Dati non validi.",
  all10102: "Nome utente sconosciuto o password errata.",

  // class/add
  all20101: "Dati non validi.",
  all20102: "Questo codice è già usato da un'altra classe.",
  all20103: "Errore del database durante la creazione della classe.",
  all20401: "Dati non validi.",
  all20402: "Questa classe non esiste.",
  all20403: "Non sei il proprietario di questa classe.",
  all20404: "Errore del database durante l'eliminazione della classe.",

  // activity/result-set
  all30101: "Dati non validi.",
  all30102: "Questa classe non esiste.",
  all30103: "Questo pseudonimo è già usato su un altro computer.",
  all30104: "Errore del database durante il salvataggio del risultato.",

  // activity/result-all
  all30201: "Dati non validi.",
  all30202: "Questa classe non esiste.",
  all30203: "Non sei il proprietario di questa classe.",

  // activity/clear
  all30301: "Dati non validi.",
  all30302: "Questa classe non esiste.",
  all30303: "Non sei il proprietario di questa classe.",
  all30304: "Errore del database durante l'eliminazione dei risultati.",

  // activity/current
  all30401: "Dati non validi.",
  all30402: "Questa classe non esiste.",

  // activity/current-set
  all30501: "Dati non validi.",
  all30502: "Questa classe non esiste.",
  all30503: "Non sei il proprietario di questa classe.",
  all30504: "Errore del database durante la scelta dell'attività corrente.",

  // room/enter
  all40101: "Dati non validi.",
  all40102: "Questa classe non esiste.",
  all40103: "Errore del database durante l'ingresso nella classe.",

  // room/students
  all40201: "Dati non validi.",
  all40202: "Questa classe non esiste.",
  all40203: "Non sei il proprietario di questa classe.",

  // Errori HTTP
  all413: "Il file è troppo grande per il server.",

  // file/add
  all50101: "Dati non validi.",
  all50102: "Questa classe non esiste.",
  all50103: "Non sei il proprietario di questa classe.",
  all50104: "Esiste già un file con questo nome in questa classe. Usa la sostituzione.",
  all50105: "Errore del database durante l'aggiunta del file.",
  all50106: "Impossibile salvare il file sul server.",
  all50107: "Il nome «notes.md» è riservato alle note della classe.",

  // file/replace
  all50201: "Dati non validi.",
  all50202: "Questo file non esiste.",
  all50203: "Non sei il proprietario di questo file.",
  all50204: "Un altro file ha già questo nome in questa classe.",
  all50205: "Il nuovo file deve essere dello stesso tipo di quello che sostituisce.",
  all50206: "Errore del database durante la sostituzione del file.",
  all50207: "Impossibile salvare il file sul server.",
  all50208: "Il nome «notes.md» è riservato alle note della classe.",

  // file/delete
  all50301: "Dati non validi.",
  all50302: "Questo file non esiste.",
  all50303: "Non sei il proprietario di questo file.",
  all50304: "Errore del database durante l'eliminazione del file.",

  // file/list
  all50401: "Dati non validi.",
  all50402: "Questa classe non esiste.",
  all50403: "Non sei il proprietario di questa classe.",

  // file/notes-get
  all50601: "Dati non validi.",
  all50602: "Questa classe non esiste.",
  all50603: "Non sei il proprietario di questa classe.",
  all50604: "Il contenuto delle note non è presente sul server.",

  // file/notes-set
  all50701: "Dati non validi.",
  all50702: "Questa classe non esiste.",
  all50703: "Non sei il proprietario di questa classe.",
  all50704: "Errore del database durante il salvataggio delle note.",
  all50705: "Impossibile salvare le note sul server.",
};

export default IT;
