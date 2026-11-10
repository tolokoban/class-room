export type FileExtension =
  | "docx"
  | "xlsx"
  | "pptx"
  | "pdf"
  | "png"
  | "jpg"
  | "txt"
  | "zip"
  | "mp3"
  | "mp4";

export interface FakeFile {
  /** Name without extension, per language. */
  name: Record<string, string>;
  extension: FileExtension;
  /** Size in kilobytes. */
  size: number;
}

/**
 * Content of the folder "Documents", sorted by (French) name.
 * The exercises refer to these files by their index.
 */
export const FILES: FakeFile[] = [
  file("xlsx", 18, "Budget 2026", "Budget 2026", "Budget 2026", "Budget 2026"),
  file(
    "docx",
    27,
    "Compte rendu de réunion",
    "Meeting minutes",
    "Sitzungsprotokoll",
    "Verbale della riunione",
  ),
  file("pdf", 412, "Contrat de location", "Rental agreement", "Mietvertrag", "Contratto d'affitto"),
  file("docx", 35, "CV", "CV", "Lebenslauf", "CV"),
  file(
    "pdf",
    96,
    "Facture d'électricité",
    "Electricity bill",
    "Stromrechnung",
    "Bolletta della luce",
  ),
  file(
    "docx",
    22,
    "Lettre de motivation",
    "Cover letter",
    "Bewerbungsschreiben",
    "Lettera di presentazione",
  ),
  file("txt", 1, "Liste de courses", "Shopping list", "Einkaufsliste", "Lista della spesa"),
  file("png", 54, "Logo", "Logo", "Logo", "Logo"),
  file("docx", 61, "Notes de cours", "Lecture notes", "Kursnotizen", "Appunti del corso"),
  file("jpg", 2348, "Photo de classe", "Class photo", "Klassenfoto", "Foto di classe"),
  file("xlsx", 15, "Planning", "Schedule", "Zeitplan", "Pianificazione"),
  file(
    "pptx",
    3120,
    "Présentation du projet",
    "Project presentation",
    "Projektpräsentation",
    "Presentazione del progetto",
  ),
  file(
    "docx",
    148,
    "Rapport de stage",
    "Internship report",
    "Praktikumsbericht",
    "Relazione di tirocinio",
  ),
  file("pdf", 210, "Recette du gâteau", "Cake recipe", "Kuchenrezept", "Ricetta della torta"),
  file("zip", 15872, "Sauvegarde", "Backup", "Sicherung", "Backup"),
  file("png", 87, "Schéma", "Diagram", "Diagramm", "Schema"),
  file("mp3", 812, "Sonnerie", "Ringtone", "Klingelton", "Suoneria"),
  file(
    "mp4",
    48230,
    "Souvenirs de vacances",
    "Holiday memories",
    "Urlaubserinnerungen",
    "Ricordi delle vacanze",
  ),
  file("xlsx", 24, "Tableau des notes", "Grades", "Notentabelle", "Tabella dei voti"),
  file("jpg", 3105, "Vacances à la mer", "Seaside holiday", "Urlaub am Meer", "Vacanze al mare"),
];

function file(
  extension: FileExtension,
  size: number,
  fr: string,
  en: string,
  de: string,
  it: string,
): FakeFile {
  return { extension, size, name: { fr, en, de, it } };
}
