/**
 * Minimal ZIP writer without compression (method STORE), like `sendZip()` in `written.php`.
 */

export interface ZipEntry {
  name: string;
  content: Blob;
}

let crcTable: Uint32Array | null = null;

function getCrcTable(): Uint32Array {
  if (crcTable) return crcTable;

  crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crcTable[n] = c >>> 0;
  }
  return crcTable;
}

export function crc32(data: Uint8Array): number {
  const table = getCrcTable();
  let crc = 0xffffffff;
  for (const byte of data) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

/** `[time, date]` in MS-DOS format. */
function getDosTime(timestamp: number): [number, number] {
  const d = new Date(timestamp * 1000);
  return [
    (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2),
    (Math.max(0, d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
  ];
}

/**
 * @param timestamp UNIX timestamp in seconds, used as the date of all the entries.
 */
export async function makeZip(entries: ZipEntry[], timestamp: number): Promise<Blob> {
  const [time, date] = getDosTime(timestamp);
  const encoder = new TextEncoder();
  const parts: BlobPart[] = [];
  const directory: Uint8Array[] = [];
  let offset = 0;
  for (const entry of entries) {
    const name = encoder.encode(entry.name);
    const content = new Uint8Array(await entry.content.arrayBuffer());
    const crc = crc32(content);
    const size = content.length;
    const header = new DataView(new ArrayBuffer(30));
    header.setUint32(0, 0x04034b50, true);
    header.setUint16(4, 20, true);
    // Bit 11: the name is encoded in UTF-8.
    header.setUint16(6, 0x0800, true);
    header.setUint16(8, 0, true);
    header.setUint16(10, time, true);
    header.setUint16(12, date, true);
    header.setUint32(14, crc, true);
    header.setUint32(18, size, true);
    header.setUint32(22, size, true);
    header.setUint16(26, name.length, true);
    header.setUint16(28, 0, true);
    parts.push(header.buffer, name, content);

    const central = new DataView(new ArrayBuffer(46));
    central.setUint32(0, 0x02014b50, true);
    central.setUint16(4, 20, true);
    central.setUint16(6, 20, true);
    central.setUint16(8, 0x0800, true);
    central.setUint16(10, 0, true);
    central.setUint16(12, time, true);
    central.setUint16(14, date, true);
    central.setUint32(16, crc, true);
    central.setUint32(20, size, true);
    central.setUint32(24, size, true);
    central.setUint16(28, name.length, true);
    central.setUint32(42, offset, true);
    directory.push(new Uint8Array(central.buffer), name);
    offset += 30 + name.length + size;
  }
  const directorySize = directory.reduce((sum, item) => sum + item.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, entries.length, true);
  end.setUint16(10, entries.length, true);
  end.setUint32(12, directorySize, true);
  end.setUint32(16, offset, true);
  return new Blob([...parts, ...directory, end.buffer] as BlobPart[], { type: "application/zip" });
}
