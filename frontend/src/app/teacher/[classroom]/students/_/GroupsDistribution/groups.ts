/**
 * Shuffle `names` and split them into groups of at least `size` members.
 * The number of groups is `floor(names.length / size)`, and the remaining
 * names are spread over the groups, so their sizes differ by one at most.
 * Caveat: if there are fewer names than `size`, a single (smaller) group is returned,
 * and an empty list gives no group at all.
 */
export function makeGroups(names: string[], size: number): string[][] {
  if (names.length === 0) return [];

  const shuffled = shuffle(names);
  const count = Math.max(1, Math.floor(shuffled.length / Math.max(1, size)));
  const groups: string[][] = Array.from({ length: count }, () => []);
  shuffled.forEach((name, index) => groups[index % count].push(name));
  return groups;
}

/**
 * Return a shuffled copy of `items` (Fisher-Yates), leaving `items` untouched.
 */
function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
