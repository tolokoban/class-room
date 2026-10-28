let counter = 1;

export function nextId() {
  return (counter++).toString(36);
}
