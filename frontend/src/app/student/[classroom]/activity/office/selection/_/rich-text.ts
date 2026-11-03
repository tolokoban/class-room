export interface RichChar {
  char: string;
  bold: boolean;
}

export type RichText = RichChar[];

/**
 * Parse the simple format of the exercises:
 * `\n` is a line break and the text between `{` and `}` is bold.
 */
export function parseRichText(source: string): RichText {
  const text: RichText = [];
  let bold = false;
  for (const char of source) {
    if (char === "{") bold = true;
    else if (char === "}") bold = false;
    else text.push({ char, bold });
  }
  return text;
}

/**
 * Two texts are equal if they have the same characters with the same boldness.
 * The boldness of white spaces is ignored, because it cannot be seen.
 */
export function richTextEquals(a: RichText, b: RichText): boolean {
  if (a.length !== b.length) return false;

  return a.every((itemA, index) => {
    const itemB = b[index];
    if (itemA.char !== itemB.char) return false;

    return isSpace(itemA.char) || itemA.bold === itemB.bold;
  });
}

export function isSpace(char: string): boolean {
  return /\s/u.test(char);
}
