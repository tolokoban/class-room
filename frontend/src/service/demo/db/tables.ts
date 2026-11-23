/**
 * Replica of `backend/database/sql/structure.sql` for the demo mode.
 * The column names are the same as in SQL, so that the demo handlers can be
 * written as a translation of the PHP entrypoints.
 * Tables `user`, `role` and `user_role` are useless: the only user is `DEMO_TEACHER`.
 */

export interface ClassRow {
  id: number;
  user: number;
  code: string;
  name: string;
  description: string;
  activity: string | null;
  max_students: number;
}

export interface ActivityRow {
  id: number;
  code: string;
  classroom: number;
  computer: string;
  nickname: string;
  result: string | null;
}

export interface RoomRow {
  computer: string;
  nickname: string;
  classroom: number;
  /** UNIX timestamp in seconds (DATETIME in SQL). */
  time: number;
}

/** The content is stored in `contents` under the key `files/{id}`. */
export interface FilesRow {
  id: number;
  classroom: number;
  name: string;
  size: number;
  mime: string;
}

/**
 * A file of table `files` being uploaded by chunks.
 * The content is stored in `contents` under the key `file_upload/{id}`.
 */
export interface FileUploadRow {
  id: number;
  classroom: number;
  /** File to replace, or `null` to add a new file. */
  file: number | null;
  name: string;
  mime: string;
  size: number;
  received: number;
  time: number;
}

export interface SeatRow {
  classroom: number;
  computer: string;
  nickname: string;
  /** UNIX timestamp in seconds (DATETIME in SQL). */
  time: number;
}

export interface WrittenRow {
  id: number;
  user: number;
  name: string;
  description: string;
  duration: number;
  expiration: number;
  /** JSON: Array<{ name: string, mimeTypes: string[], maxSize: number }> */
  files: string;
}

export interface WrittenAssignmentRow {
  id: number;
  written: number;
  classroom: number;
  end_time: number | null;
  remaining: number | null;
  extension: number;
  expires_at: number | null;
  position: number;
}

/** The content is stored in `contents` under the key `written_attachment/{id}`. */
export interface WrittenAttachmentRow {
  id: number;
  written: number;
  name: string;
  mime: string;
  ext: string;
  size: number;
  received: number;
  complete: number;
  time: number;
}

/** The content is stored in `contents` under the key `written_upload/{id}`. */
export interface WrittenUploadRow {
  id: number;
  assignment: number;
  computer: string;
  nickname: string;
  slot: string;
  original: string;
  mime: string;
  ext: string;
  size: number;
  received: number;
  complete: number;
  late: number;
  time: number;
}

export interface Tables {
  class: ClassRow;
  activity: ActivityRow;
  room: RoomRow;
  files: FilesRow;
  file_upload: FileUploadRow;
  seat: SeatRow;
  written: WrittenRow;
  written_assignment: WrittenAssignmentRow;
  written_attachment: WrittenAttachmentRow;
  written_upload: WrittenUploadRow;
}

export type TableName = keyof Tables;

/** Primary key of each table. Tables with `id` are auto-incremented. */
export const PRIMARY_KEYS: { [T in TableName]: Array<keyof Tables[T]> } = {
  class: ["id"],
  activity: ["id"],
  room: ["computer"],
  files: ["id"],
  file_upload: ["id"],
  seat: ["classroom", "computer"],
  written: ["id"],
  written_assignment: ["id"],
  written_attachment: ["id"],
  written_upload: ["id"],
};

export const TABLE_NAMES = Object.keys(PRIMARY_KEYS) as TableName[];

export interface ForeignKey {
  table: TableName;
  column: string;
  references: TableName;
}

/** All of them are `ON DELETE CASCADE`, referencing the column `id`. */
export const FOREIGN_KEYS: ForeignKey[] = [
  { table: "activity", column: "classroom", references: "class" },
  { table: "room", column: "classroom", references: "class" },
  { table: "files", column: "classroom", references: "class" },
  { table: "file_upload", column: "classroom", references: "class" },
  { table: "file_upload", column: "file", references: "files" },
  { table: "seat", column: "classroom", references: "class" },
  { table: "written_assignment", column: "written", references: "written" },
  { table: "written_assignment", column: "classroom", references: "class" },
  { table: "written_attachment", column: "written", references: "written" },
  { table: "written_upload", column: "assignment", references: "written_assignment" },
];

/**
 * Tables whose rows have a content (a `Blob`), stored under the key `{table}/{id}`.
 * The content is deleted with the row.
 */
export const TABLES_WITH_CONTENT: TableName[] = [
  "files",
  "file_upload",
  "written_attachment",
  "written_upload",
];

export function getContentKey(table: TableName, id: number): string {
  return `${table}/${id}`;
}
