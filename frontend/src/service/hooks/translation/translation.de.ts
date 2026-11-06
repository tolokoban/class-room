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
  all20401: "Ungültige Eingabe.",
  all20402: "Diese Klasse existiert nicht.",
  all20403: "Sie sind nicht der Eigentümer dieser Klasse.",
  all20404: "Datenbankfehler beim Löschen der Klasse.",

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

  // activity/current-set
  all30501: "Ungültige Eingabe.",
  all30502: "Diese Klasse existiert nicht.",
  all30503: "Sie sind nicht der Eigentümer dieser Klasse.",
  all30504: "Datenbankfehler beim Festlegen der aktuellen Aktivität.",

  // room/enter
  all40101: "Ungültige Daten.",
  all40102: "Diese Klasse existiert nicht.",
  all40103: "Datenbankfehler beim Betreten der Klasse.",

  // room/students
  all40201: "Ungültige Daten.",
  all40202: "Diese Klasse existiert nicht.",
  all40203: "Sie sind nicht der Eigentümer dieser Klasse.",

  // HTTP-Fehler
  all413: "Die Datei ist zu groß für den Server.",

  // file/add
  all50101: "Ungültige Daten.",
  all50102: "Diese Klasse existiert nicht.",
  all50103: "Sie sind nicht der Eigentümer dieser Klasse.",
  all50104:
    "In dieser Klasse gibt es bereits eine Datei mit diesem Namen. Verwenden Sie stattdessen das Ersetzen.",
  all50105: "Datenbankfehler beim Hinzufügen der Datei.",
  all50106: "Die Datei kann nicht auf dem Server gespeichert werden.",

  // file/replace
  all50201: "Ungültige Daten.",
  all50202: "Diese Datei existiert nicht.",
  all50203: "Sie sind nicht der Eigentümer dieser Datei.",
  all50204: "Eine andere Datei in dieser Klasse hat bereits diesen Namen.",
  all50205: "Die neue Datei muss vom gleichen Typ sein wie die ersetzte Datei.",
  all50206: "Datenbankfehler beim Ersetzen der Datei.",
  all50207: "Die Datei kann nicht auf dem Server gespeichert werden.",

  // file/delete
  all50301: "Ungültige Daten.",
  all50302: "Diese Datei existiert nicht.",
  all50303: "Sie sind nicht der Eigentümer dieser Datei.",
  all50304: "Datenbankfehler beim Löschen der Datei.",

  // file/list
  all50401: "Ungültige Daten.",
  all50402: "Diese Klasse existiert nicht.",
  all50403: "Sie sind nicht der Eigentümer dieser Klasse.",
};

export default DE;
