import FR from "./translation.fr";

const DE: typeof FR = {
  // Generic errors (frontend/src/service/calls/service.ts)
  all1: "Unerwartetes Antwortformat.",

  // user/login
  all10101: "Ungültige Daten.",
  all10102: "Unbekannter Benutzername oder falsches Passwort.",

  // class/add
  all20101: "Ungültige Eingabe.",
  all20102: "Dieser Code wird bereits von einer anderen Klasse verwendet.",
  all20103: "Datenbankfehler beim Erstellen der Klasse.",

  // activity/result-set
  all30101: "Ungültige Eingabe.",
  all30102: "Diese Klasse existiert nicht.",
  all30103: "Dieser Spitzname wird bereits auf einem anderen Computer verwendet.",
  all30104: "Datenbankfehler beim Speichern des Ergebnisses.",

  // activity/result-all
  all30201: "Ungültige Eingabe.",
  all30202: "Diese Klasse existiert nicht.",
  all30203: "Sie sind nicht der Eigentümer dieser Klasse.",

  // activity/clear
  all30301: "Ungültige Eingabe.",
  all30302: "Diese Klasse existiert nicht.",
  all30303: "Sie sind nicht der Eigentümer dieser Klasse.",
  all30304: "Datenbankfehler beim Löschen der Ergebnisse.",

  // activity/current
  all30401: "Ungültige Eingabe.",
  all30402: "Diese Klasse existiert nicht.",
};

export default DE;
