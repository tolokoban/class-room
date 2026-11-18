import { PRIMARY_KEYS, TABLE_NAMES, TableName } from "./tables";

export type Row = Record<string, unknown>;
export type Key = number | string | Array<number | string>;

/**
 * Low level storage of the demo database: IndexedDB in the browser,
 * memory in the unit tests.
 */
export interface DemoBackend {
  getAll(table: TableName): Promise<Row[]>;
  get(table: TableName, key: Key): Promise<Row | undefined>;
  /** Insert a row without `id` in an auto-incremented table. @returns The new `id`. */
  add(table: TableName, row: Row): Promise<number>;
  /** Insert or replace a row. */
  put(table: TableName, row: Row): Promise<void>;
  delete(table: TableName, key: Key): Promise<void>;
  getContent(key: string): Promise<Blob | undefined>;
  putContent(key: string, blob: Blob): Promise<void>;
  deleteContent(key: string): Promise<void>;
}

export function getKey(table: TableName, row: Row): Key {
  const columns = PRIMARY_KEYS[table] as string[];
  if (columns.length === 1) return row[columns[0]] as number | string;

  return columns.map((column) => row[column] as number | string);
}

const DB_NAME = "class-room-demo";
const DB_VERSION = 1;
const CONTENTS = "contents";

/**
 * The database is kept between the visits: it is never deleted, even on logout.
 */
export class IndexedDbBackend implements DemoBackend {
  private readonly db: Promise<IDBDatabase>;

  constructor() {
    this.db = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.addEventListener("upgradeneeded", () => {
        const db = request.result;
        for (const table of TABLE_NAMES) {
          if (db.objectStoreNames.contains(table)) continue;

          const columns = PRIMARY_KEYS[table] as string[];
          db.createObjectStore(
            table,
            columns.length === 1 && columns[0] === "id"
              ? { keyPath: "id", autoIncrement: true }
              : { keyPath: columns.length === 1 ? columns[0] : columns },
          );
        }
        if (!db.objectStoreNames.contains(CONTENTS)) db.createObjectStore(CONTENTS);
      });
      request.addEventListener("success", () => resolve(request.result));
      request.addEventListener("error", () => reject(request.error));
    });
  }

  async getAll(table: TableName): Promise<Row[]> {
    return (await this.request(table, "readonly", (store) => store.getAll())) as Row[];
  }

  async get(table: TableName, key: Key): Promise<Row | undefined> {
    return (await this.request(table, "readonly", (store) => store.get(key))) as Row | undefined;
  }

  async add(table: TableName, row: Row): Promise<number> {
    const { id: _id, ...rowWithoutId } = row;
    return Number(await this.request(table, "readwrite", (store) => store.add(rowWithoutId)));
  }

  async put(table: TableName, row: Row): Promise<void> {
    await this.request(table, "readwrite", (store) => store.put(row));
  }

  async delete(table: TableName, key: Key): Promise<void> {
    await this.request(table, "readwrite", (store) => store.delete(key));
  }

  async getContent(key: string): Promise<Blob | undefined> {
    return (await this.request(CONTENTS, "readonly", (store) => store.get(key))) as
      | Blob
      | undefined;
  }

  async putContent(key: string, blob: Blob): Promise<void> {
    await this.request(CONTENTS, "readwrite", (store) => store.put(blob, key));
  }

  async deleteContent(key: string): Promise<void> {
    await this.request(CONTENTS, "readwrite", (store) => store.delete(key));
  }

  private async request(
    storeName: string,
    mode: IDBTransactionMode,
    action: (store: IDBObjectStore) => IDBRequest,
  ): Promise<unknown> {
    const db = await this.db;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const request = action(transaction.objectStore(storeName));
      transaction.addEventListener("complete", () => resolve(request.result));
      transaction.addEventListener("error", () => reject(transaction.error));
      transaction.addEventListener("abort", () => reject(transaction.error));
    });
  }
}

/** For the unit tests. */
export class MemoryBackend implements DemoBackend {
  private readonly tables = new Map<TableName, Map<string, Row>>();
  private readonly counters = new Map<TableName, number>();
  private readonly contents = new Map<string, Blob>();

  async getAll(table: TableName): Promise<Row[]> {
    return [...this.table(table).values()].map((row) => ({ ...row }));
  }

  async get(table: TableName, key: Key): Promise<Row | undefined> {
    const row = this.table(table).get(JSON.stringify(key));
    return row ? { ...row } : undefined;
  }

  async add(table: TableName, row: Row): Promise<number> {
    const id = (this.counters.get(table) ?? 0) + 1;
    this.counters.set(table, id);
    await this.put(table, { ...row, id });
    return id;
  }

  async put(table: TableName, row: Row): Promise<void> {
    this.table(table).set(JSON.stringify(getKey(table, row)), { ...row });
  }

  async delete(table: TableName, key: Key): Promise<void> {
    this.table(table).delete(JSON.stringify(key));
  }

  async getContent(key: string): Promise<Blob | undefined> {
    return this.contents.get(key);
  }

  async putContent(key: string, blob: Blob): Promise<void> {
    this.contents.set(key, blob);
  }

  async deleteContent(key: string): Promise<void> {
    this.contents.delete(key);
  }

  private table(name: TableName): Map<string, Row> {
    let table = this.tables.get(name);
    if (!table) {
      table = new Map();
      this.tables.set(name, table);
    }
    return table;
  }
}
