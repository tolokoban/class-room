const BODY_LENGTH = 120;
const CHECKSUM_LENGTH = 8;
const RX_COMPUTER_ID = new RegExp(`^[0-9a-f]{${BODY_LENGTH + CHECKSUM_LENGTH}}$`);

/**
 * @returns 120 random hexadecimal chars followed by
 * 8 hexadecimal chars of checksum.
 */
export function createComputerId(): string {
  const bytes = new Uint8Array(BODY_LENGTH / 2);
  crypto.getRandomValues(bytes);
  const body = Array.from(bytes, toHex2).join("");
  return `${body}${checksum(body)}`;
}

export function isComputerId(data: unknown): data is string {
  if (typeof data !== "string") return false;
  if (!RX_COMPUTER_ID.test(data)) return false;

  const body = data.substring(0, BODY_LENGTH);
  return data.substring(BODY_LENGTH) === checksum(body);
}

/**
 * FNV-1a 32 bits hash, as 8 hexadecimal chars.
 */
function checksum(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(CHECKSUM_LENGTH, "0");
}

function toHex2(byte: number): string {
  return byte.toString(16).padStart(2, "0");
}
