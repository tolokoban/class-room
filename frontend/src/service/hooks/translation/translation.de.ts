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

  // activity/result-get
  all30601: "Ungültige Eingabe.",
  all30602: "Diese Klasse existiert nicht.",
  all30603: "Dieser Spitzname wird bereits auf einem anderen Computer verwendet.",
  all30604: "Datenbankfehler beim Lesen des Ergebnisses.",

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

  // file/delete
  all50301: "Ungültige Daten.",
  all50302: "Diese Datei existiert nicht.",
  all50303: "Sie sind nicht der Eigentümer dieser Datei.",
  all50304: "Datenbankfehler beim Löschen der Datei.",

  // file/list
  all50401: "Ungültige Daten.",
  all50402: "Diese Klasse existiert nicht.",
  all50403: "Sie sind nicht der Eigentümer dieser Klasse.",

  // file/notes-get
  all50601: "Ungültige Daten.",
  all50602: "Diese Klasse existiert nicht.",
  all50603: "Sie sind nicht der Eigentümer dieser Klasse.",
  all50604: "Der Inhalt der Notizen fehlt auf dem Server.",

  // file/notes-set
  all50701: "Ungültige Daten.",
  all50702: "Diese Klasse existiert nicht.",
  all50703: "Sie sind nicht der Eigentümer dieser Klasse.",
  all50704: "Datenbankfehler beim Speichern der Notizen.",
  all50705: "Die Notizen können nicht auf dem Server gespeichert werden.",

  // file/upload-init
  all50801: "Ungültige Daten.",
  all50802: "Diese Klasse existiert nicht.",
  all50803: "Diese Datei existiert nicht.",
  all50804: "Sie sind nicht der Eigentümer dieser Klasse.",
  all50805:
    "Eine andere Datei in dieser Klasse hat bereits diesen Namen. Um eine Datei zu ersetzen, verwenden Sie ihre Schaltfläche zum Ersetzen.",
  all50806: "Der Name „notes.md“ ist für die Notizen der Klasse reserviert.",
  all50807: "Die neue Datei muss vom gleichen Typ sein wie die ersetzte Datei.",
  all50808: "Die Datei ist zu groß (höchstens 100 MB).",
  all50809:
    "Nicht genug Speicherplatz auf dem Server, oder die Datei kann nicht gespeichert werden.",
  all50810: "Datenbankfehler beim Hochladen der Datei.",

  // file/upload-chunk
  all50901: "Ungültige Daten.",
  all50902: "Dieser Upload existiert nicht (oder ist abgelaufen).",
  all50903: "Ungültiger Teil der Datei.",
  all50904: "Die Datei kann nicht auf dem Server gespeichert werden.",

  // file/upload-complete
  all51001: "Ungültige Daten.",
  all51002: "Dieser Upload existiert nicht (oder ist abgelaufen).",
  all51003: "Teile der Datei fehlen.",
  all51004: "Eine andere Datei in dieser Klasse hat bereits diesen Namen.",
  all51005: "Die Datei kann nicht auf dem Server gespeichert werden.",
  all51006: "Datenbankfehler beim Speichern der Datei.",
  // room/enter, room/check, room/seats, room/kick, class/update, written/*
  all20301: "Ungültige Daten.",
  all20302: "Diese Klasse existiert nicht.",
  all20303: "Sie sind nicht der Besitzer dieser Klasse.",
  all20304: "Dieser Code wird bereits von einer anderen Klasse verwendet.",
  all20305: "Datenbankfehler.",
  all40104: "Dieser Spitzname wird bereits von einem anderen Schüler der Klasse verwendet.",
  all40105: "Die Klasse ist voll: Fragen Sie Ihre Lehrkraft.",
  all40301: "Ungültige Daten.",
  all40302: "Diese Klasse existiert nicht.",
  all40401: "Ungültige Daten.",
  all40402: "Diese Klasse existiert nicht.",
  all40403: "Sie sind nicht der Besitzer dieser Klasse.",
  all40501: "Ungültige Daten.",
  all40502: "Diese Klasse existiert nicht.",
  all40503: "Sie sind nicht der Besitzer dieser Klasse.",
  all40504: "Datenbankfehler.",
  all60201: "Ungültige Daten.",
  all60202: "Sie haben bereits eine schriftliche Arbeit mit diesem Namen.",
  all60203: "Datenbankfehler.",
  all60301: "Ungültige Daten.",
  all60302: "Diese schriftliche Arbeit existiert nicht.",
  all60303: "Sie sind nicht der Besitzer dieser schriftlichen Arbeit.",
  all60304: "Sie haben bereits eine schriftliche Arbeit mit diesem Namen.",
  all60305: "Datenbankfehler.",
  all60401: "Ungültige Daten.",
  all60402: "Diese schriftliche Arbeit existiert nicht.",
  all60403: "Sie sind nicht der Besitzer dieser schriftlichen Arbeit.",
  all60404: "Datenbankfehler.",
  all60501: "Ungültige Daten.",
  all60502: "Diese Klasse existiert nicht.",
  all60503: "Sie sind nicht der Besitzer dieser Klasse.",
  all60504: "Diese schriftliche Arbeit existiert nicht.",
  all60505: "Sie sind nicht der Besitzer dieser schriftlichen Arbeit.",
  all60506: "Diese schriftliche Arbeit ist dieser Klasse bereits zugewiesen.",
  all60507: "Datenbankfehler.",
  all60601: "Ungültige Daten.",
  all60602: "Diese Klasse existiert nicht.",
  all60603: "Sie sind nicht der Besitzer dieser Klasse.",
  all60604: "Diese schriftliche Arbeit existiert nicht.",
  all60605: "Sie sind nicht der Besitzer dieser schriftlichen Arbeit.",
  all60606: "Diese schriftliche Arbeit ist dieser Klasse nicht zugewiesen.",
  all60607: "Datenbankfehler.",
  all60701: "Ungültige Daten.",
  all60702: "Diese Klasse existiert nicht.",
  all60703: "Sie sind nicht der Besitzer dieser Klasse.",
  all60801: "Ungültige Daten.",
  all60802: "Diese Klasse existiert nicht.",
  all60803: "Sie sind nicht der Besitzer dieser Klasse.",
  all60804: "Diese schriftliche Arbeit existiert nicht.",
  all60805: "Sie sind nicht der Besitzer dieser schriftlichen Arbeit.",
  all60806: "Diese schriftliche Arbeit ist dieser Klasse nicht zugewiesen.",
  all60807: "Diese Aktion ist im aktuellen Zustand des Timers nicht möglich.",
  all60808: "Datenbankfehler.",
  all60901: "Ungültige Daten.",
  all60902: "Diese Klasse existiert nicht.",
  all60903: "Sie sind nicht der Besitzer dieser Klasse.",
  all60904: "Diese schriftliche Arbeit existiert nicht.",
  all60905: "Sie sind nicht der Besitzer dieser schriftlichen Arbeit.",
  all60906: "Diese schriftliche Arbeit ist dieser Klasse nicht zugewiesen.",
  all61001: "Ungültige Daten.",
  all61002: "Diese Klasse existiert nicht.",
  all61003: "Sie sind nicht der Besitzer dieser Klasse.",
  all61004: "Diese schriftliche Arbeit existiert nicht.",
  all61005: "Sie sind nicht der Besitzer dieser schriftlichen Arbeit.",
  all61006: "Diese schriftliche Arbeit ist dieser Klasse nicht zugewiesen.",
  all61007: "Datenbankfehler.",
  all61301: "Ungültige Daten.",
  all61302: "Diese Klasse existiert nicht.",
  all61303: "Diese schriftliche Arbeit ist in dieser Klasse nicht verfügbar.",
  all61304: "Diese schriftliche Arbeit ist nicht die aktuelle Aktivität.",
  all61401: "Ungültige Daten.",
  all61402: "Diese Klasse existiert nicht.",
  all61403: "Diese schriftliche Arbeit ist in dieser Klasse nicht verfügbar.",
  all61404: "Sie sind nicht mehr mit dieser Klasse verbunden.",
  all61405: "Die Übung hat noch nicht begonnen.",
  all61406: "Die Dateien dieser Übung sind abgelaufen.",
  all61407: "Diese Datei wird nicht erwartet.",
  all61408: "Die Datei ist zu groß (oder leer).",
  all61409: "Dieser Dateityp wird nicht akzeptiert.",
  all61410: "Nicht genug Platz auf dem Server, oder die Datei kann nicht gespeichert werden.",
  all61411: "Datenbankfehler.",
  all61501: "Ungültige Daten.",
  all61502: "Dieser Upload existiert nicht oder wurde abgebrochen.",
  all61503: "Ungültiger Dateiteil.",
  all61504: "Die Datei kann nicht auf dem Server gespeichert werden.",
  all61601: "Ungültige Daten.",
  all61602: "Dieser Upload existiert nicht oder wurde abgebrochen.",
  all61603: "Die Datei wurde nicht vollständig gesendet.",
  all61604: "Dieser Dateityp wird nicht akzeptiert.",
  all61605: "Die Datei kann nicht auf dem Server gespeichert werden.",
  all61606: "Datenbankfehler.",
  all61701: "Ungültige Daten.",
  all61702: "Diese Klasse existiert nicht.",
  all61703: "Diese schriftliche Arbeit ist in dieser Klasse nicht verfügbar.",
  all61704: "Sie sind nicht mehr mit dieser Klasse verbunden.",
  all61705: "Datenbankfehler.",
  all61801: "Ungültige Daten.",
  all61802: "Diese Klasse existiert nicht.",
  all61803: "Sie sind nicht der Besitzer dieser Klasse.",
  all61804:
    "Die Liste der schriftlichen Arbeiten dieser Klasse hat sich geändert. Bitte versuchen Sie es erneut.",
  all61805: "Datenbankfehler.",
  all61901: "Ungültige Daten.",
  all61902: "Diese schriftliche Arbeit existiert nicht.",
  all61903: "Sie sind nicht der Besitzer dieser schriftlichen Arbeit.",
  all61904:
    "Es sind bereits 20 Dateien angehängt: Löschen Sie eine, bevor Sie eine weitere hinzufügen.",
  all61905: "Die Datei ist zu groß (maximal 100 MB) oder leer.",
  all61906:
    "Nicht genug Speicherplatz auf dem Server, oder die Datei kann nicht gespeichert werden.",
  all61907: "Datenbankfehler.",
  all62001: "Ungültige Daten.",
  all62002: "Dieser Upload existiert nicht oder wurde abgebrochen.",
  all62003: "Ungültiger Dateiteil.",
  all62004: "Die Datei kann nicht auf dem Server gespeichert werden.",
  all62101: "Ungültige Daten.",
  all62102: "Dieser Upload existiert nicht oder wurde abgebrochen.",
  all62103: "Die Datei wurde nicht vollständig gesendet.",
  all62104: "Die Datei kann nicht auf dem Server gespeichert werden.",
  all62105: "Datenbankfehler.",
  all62201: "Ungültige Daten.",
  all62202: "Diese angehängte Datei existiert nicht.",
  all62203: "Sie sind nicht der Besitzer dieser angehängten Datei.",
  all62204: "Datenbankfehler.",
};

export default DE;
