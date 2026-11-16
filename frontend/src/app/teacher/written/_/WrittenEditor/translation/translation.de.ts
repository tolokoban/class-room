import FR from "./translation.fr";

const DE: typeof FR = {
  titleNew: "Neue schriftliche Arbeit",
  titleEdit: "„$1“ bearbeiten",
  name: "Name",
  duration: "Dauer der Übung (Minuten)",
  expiration: "Löschung der Dateien (Stunden nach dem Ende)",
  description: "Anweisungen (Markdown)",
  edit: "Bearbeiten",
  view: "Vorschau",
  placeholder: "Beschreiben Sie, was die Schüler erstellen sollen...",
  files: "Erwartete Dateien",
  filesHint:
    "Der Name einer erwarteten Datei ist Teil des Namens der heruntergeladenen Dateien: „Spitzname.Name.xxxxxx.ext“.",
  addFile: "Erwartete Datei hinzufügen",
  save: "Speichern",
  delete: "Löschen",
  saved: "Die schriftliche Arbeit „$1“ wurde gespeichert.",
  deleteConfirm:
    "„$1“ endgültig löschen? Sie wird aus allen Klassen entfernt und alle von den Schülern hochgeladenen Dateien werden gelöscht.",
  deleted: "Die schriftliche Arbeit „$1“ wurde gelöscht.",
  filesChangedConfirm:
    "Sie haben erwartete Dateien entfernt oder umbenannt. Die $1 bereits von den Schülern dafür hochgeladenen Datei(en) werden endgültig gelöscht. Fortfahren?",
  errorName: "Bitte geben Sie einen Namen ein.",
  errorNoFile: "Mindestens eine erwartete Datei ist erforderlich.",
  errorFileName:
    'Ungültiger Name der erwarteten Datei: „$1“. Er darf nicht mit einem Punkt beginnen und keines dieser Zeichen enthalten: / \\ : * ? " < > |',
  errorFileDuplicate: "Zwei erwartete Dateien haben denselben Namen: „$1“.",
};

export default DE;
