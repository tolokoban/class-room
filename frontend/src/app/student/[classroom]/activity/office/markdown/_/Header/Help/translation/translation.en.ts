import FR from "./translation.fr";

const EN: typeof FR = {
  title: "Markdown cheat sheet",
  close: "Close",
  code: "Code",
  result: "Result",

  paragraphsTitle: "Paragraphs",
  paragraphsText:
    "An empty line separates two paragraphs. A simple line break is displayed as a space.",
  paragraphsExample: `First paragraph,
still the first one.

Second paragraph.`,

  lineBreakTitle: "Line break",
  lineBreakText:
    "A backslash at the end of a line forces a line break inside the same paragraph. Two spaces at the end of a line do the same thing, but they are invisible.",
  lineBreakExample: `12 Lake Street\\
Springfield`,

  titleTitle: "Headings",
  titleText: "A hash sign followed by a space at the beginning of a line turns it into a heading.",
  titleExample: `# My heading`,

  subtitlesTitle: "Heading levels",
  subtitlesText: "The number of hash signs (from 1 to 6) gives the level of the heading.",
  subtitlesExample: `## Subheading

### Sub-subheading`,

  boldTitle: "Bold",
  boldText: "Two asterisks (or two underscores) on each side of the text.",
  boldExample: `A word in **bold**, another one in __bold__.`,

  italicTitle: "Italic",
  italicText:
    "One asterisk (or one underscore) on each side of the text. Three asterisks give bold italic.",
  italicExample: `A word in *italic*, another one in _italic_, and one in ***bold italic***.`,

  strikethroughTitle: "Strikethrough",
  strikethroughText: "Two tildes on each side of the text.",
  strikethroughExample: `A ~~crossed out~~ price.`,

  bulletListTitle: "Bullet lists",
  bulletListText:
    "Each item starts with a dash (or an asterisk, or a plus sign) followed by a space. Leave an empty line after the list.",
  bulletListExample: `- Apples
- Pears
- Apricots`,

  numberedListTitle: "Numbered lists",
  numberedListText:
    "Each item starts with a number, a period and a space. Only the first number counts: it gives the starting number.",
  numberedListExample: `1. Preheat the oven
2. Mix
3. Bake`,

  nestedListTitle: "Nested lists",
  nestedListText:
    "Indent the items of the sublist with spaces, up to the start of the text of the parent item.",
  nestedListExample: `- Fruits
  - Apples
  - Pears
- Vegetables
  1. Carrots
  2. Leeks`,

  taskListTitle: "Task lists",
  taskListText:
    "A bullet list whose items start with a box: square brackets with a space (empty) or an x (ticked).",
  taskListExample: `- [x] Do the shopping
- [ ] Tidy up the kitchen`,

  inlineCodeTitle: "Code in the text",
  inlineCodeText: "Backticks around the text. What is inside is not interpreted.",
  inlineCodeExample: "Open the file `notes.txt`, without `**bold**`.",

  codeBlockTitle: "Code blocks",
  codeBlockText:
    "A line of three backticks (or three tildes) before the code, and another one after.",
  codeBlockExample: `\`\`\`
for i in range(3):
    print(i)
\`\`\``,

  quoteTitle: "Quotes",
  quoteText:
    "A greater-than sign followed by a space at the beginning of each line, including the empty lines of the quote.",
  quoteExample: `> First paragraph of the quote.
>
> Second paragraph.`,

  linkTitle: "Links",
  linkText:
    "The clickable text between square brackets, followed by the address between parentheses. An address that starts with https becomes a link on its own.",
  linkExample: `Visit [Wikipedia](https://en.wikipedia.org)
or https://www.markdownguide.org`,

  imageTitle: "Images",
  imageText:
    "Like a link, preceded by an exclamation mark. The text between square brackets describes the image.",
  imageExample: `![Markdown logo](https://upload.wikimedia.org/wikipedia/commons/4/48/Markdown-mark.svg)`,

  separatorTitle: "Separators",
  separatorText:
    "A line with only three dashes (or three asterisks). Leave an empty line before it.",
  separatorExample: `First part

---

Second part`,

  tableTitle: "Tables",
  tableText:
    "The cells are separated by vertical bars. The second row contains only dashes and separates the headers from the content.",
  tableExample: `| Name | Age |
| --- | --- |
| Alice | 16 |
| Bob | 17 |`,

  tableAlignTitle: "Column alignment",
  tableAlignText:
    "In the row of dashes, colons on the left, on both sides or on the right align the column to the left, center or right.",
  tableAlignExample: `| Left | Center | Right |
| :--- | :---: | ---: |
| a | b | c |`,

  escapeTitle: "Escaping",
  escapeText: "A backslash in front of a special character displays it as it is.",
  escapeExample: `\\# Not a heading

1986\\. Not a list

2\\*3\\*4`,

  footnoteTitle: "Footnotes",
  footnoteText:
    "A note reference between square brackets, starting with a caret, and the note itself further down.",
  footnoteExample: `A statement[^1].

[^1]: The source of the statement.`,
};

export default EN;
