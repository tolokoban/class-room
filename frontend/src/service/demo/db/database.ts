import { DemoBackend, getKey, Key, Row } from "./backend";
import { FOREIGN_KEYS, getContentKey, TableName, Tables, TABLES_WITH_CONTENT } from "./tables";

/**
 * Typed access to the demo database, with the `ON DELETE CASCADE` of the SQL schema:
 * deleting a row also deletes the rows that reference it, and their contents.
 */
export class DemoDatabase {
  constructor(private readonly backend: DemoBackend) {}

  async all<T extends TableName>(table: T): Promise<Tables[T][]> {
    return (await this.backend.getAll(table)) as unknown as Tables[T][];
  }

  async where<T extends TableName>(
    table: T,
    predicate: (row: Tables[T]) => boolean,
  ): Promise<Tables[T][]> {
    return (await this.all(table)).filter(predicate);
  }

  /** @returns The first row matching `predicate`, or `undefined`. */
  async findOne<T extends TableName>(
    table: T,
    predicate: (row: Tables[T]) => boolean,
  ): Promise<Tables[T] | undefined> {
    return (await this.all(table)).find(predicate);
  }

  async get<T extends TableName>(table: T, key: Key): Promise<Tables[T] | undefined> {
    return (await this.backend.get(table, key)) as unknown as Tables[T] | undefined;
  }

  /** Insert a row in an auto-incremented table. @returns The new `id`. */
  async insert<T extends TableName>(table: T, row: Omit<Tables[T], "id">): Promise<number> {
    return this.backend.add(table, row as Row);
  }

  /** Insert or replace a row. */
  async put<T extends TableName>(table: T, row: Tables[T]): Promise<void> {
    await this.backend.put(table, row as unknown as Row);
  }

  /** Change some columns of an existing row. Do nothing if the row does not exist. */
  async update<T extends TableName>(table: T, key: Key, changes: Partial<Tables[T]>) {
    const row = await this.get(table, key);
    if (!row) return;

    await this.put(table, { ...row, ...changes });
  }

  /** Delete a row and, by cascade, all the rows that reference it. */
  async delete<T extends TableName>(table: T, key: Key): Promise<void> {
    const row = await this.backend.get(table, key);
    if (row) await this.deleteRow(table, row);
  }

  /** Delete the rows matching `predicate`. @returns The number of deleted rows. */
  async deleteWhere<T extends TableName>(
    table: T,
    predicate: (row: Tables[T]) => boolean,
  ): Promise<number> {
    const rows = await this.where(table, predicate);
    for (const row of rows) await this.deleteRow(table, row as unknown as Row);
    return rows.length;
  }

  async getContent(table: TableName, id: number): Promise<Blob | undefined> {
    return this.backend.getContent(getContentKey(table, id));
  }

  async setContent(table: TableName, id: number, blob: Blob): Promise<void> {
    await this.backend.putContent(getContentKey(table, id), blob);
  }

  async deleteContent(table: TableName, id: number): Promise<void> {
    await this.backend.deleteContent(getContentKey(table, id));
  }

  private async deleteRow(table: TableName, row: Row): Promise<void> {
    for (const fk of FOREIGN_KEYS) {
      if (fk.references !== table) continue;

      const children = (await this.backend.getAll(fk.table)).filter(
        (child) => child[fk.column] === row.id,
      );
      for (const child of children) await this.deleteRow(fk.table, child);
    }
    await this.backend.delete(table, getKey(table, row));
    if (TABLES_WITH_CONTENT.includes(table)) await this.deleteContent(table, Number(row.id));
  }
}
