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
};

export default IT;
