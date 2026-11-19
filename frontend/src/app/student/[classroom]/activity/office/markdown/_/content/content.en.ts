import FR from "./content.fr";

const EN: typeof FR = {
  paragraphs: `A Markdown text is split into paragraphs.

To move on to the next paragraph, going to a new line is not enough: you have to leave an empty line between the two paragraphs.

A simple line break is displayed as a space: the two lines end up stuck together in the same paragraph.`,

  lineBreak: `Sometimes you want to go to a new line without changing paragraph,\\
like in a poem or in an address.

To do this, you end the line with a backslash,\\
just before the line break.\\
The next line stays in the same paragraph.`,

  title: `# Headings

A heading stands alone on its line.

To turn a line into a heading, you start it with a hash sign followed by a space.

The heading is then displayed big and bold.

The number of hash signs gives the level of the heading.

## Two hash signs

Two hash signs give a subheading, smaller than the main heading.

### Three hash signs

Three hash signs give a sub-subheading. You can go up to six levels.`,

  bold: `# Bold

To put words in **bold**, you surround them with **two asterisks** on each side.

There must be **no space** between the asterisks and the text they surround.

# Italic

*Italic* is obtained with *a single asterisk* on each side of the text.

You can also use an *underscore* instead of the asterisk.

And nothing prevents you from mixing *italic* and **bold** in the same sentence.`,

  bulletList: `# Bullet lists

Each item of a bullet list:

- stands alone on its line;
- starts with a dash followed by a space;
- can contain **bold** or *italic* text.

There must be an empty line between the list and the paragraph that follows it.`,

  numberedList: `# Numbered lists

To make a numbered list:

1. start each line with a number;
2. follow this number with a period and a space;
3. let Markdown display the numbers.

Only the first number counts: it gives the starting number of the list.`,

  nestedList: `# Nested lists

A list can contain another one:

- to nest an item, you shift it to the right
  - with spaces at the beginning of the line,
  - up to the start of the text of the parent item;
- you can mix both kinds of lists
  1. a numbered list inside a bullet list,
  2. or the other way around.`,

  inlineCode: `# Code in the text

To write a file name like \`report.pdf\` or a command like \`ls -l\`, you surround it with backticks.

The text between backticks is displayed with a monospaced font.

The asterisks it contains are **not** interpreted: \`**this is not bold**\`.`,

  codeBlock: `# Code blocks

For code on several lines, you write a line of three backticks before the code, and another one after.

\`\`\`
function hello(name) {
    return "Hello " + name
}
\`\`\`

The spaces at the beginning of the code lines are kept.`,

  quote: `# Quotes

> To quote a text, you start each line with a greater-than sign followed by a space.

The quote is displayed indented.

> A quote can contain several paragraphs.
>
> The empty line between them must then also start with a greater-than sign.`,

  link: `# Links

To create a link, you put the clickable text between square brackets, then the address between parentheses, right after.

Here are two links: the [Wikipedia encyclopedia](https://en.wikipedia.org) and the [Markdown guide](https://www.markdownguide.org).

An address that starts with https also becomes a link on its own.`,

  separator: `# Separators

A line that contains only three dashes draws a horizontal line.

---

There must be an empty line before the three dashes. Otherwise, the line above becomes a heading!

---

This line is used to separate the parts of a text.`,

  table: `# Tables

In a table, the cells are separated by vertical bars.

| Row | Role |
| --- | --- |
| First | The column headers |
| Second | Only dashes, to separate the headers from the content |
| Following | The content of the table |

There must be an empty line before and after the table.`,

  tableAlign: `# Column alignment

In the row of dashes, colons set the alignment of each column.

| Left | Center | Right |
| :--- | :---: | ---: |
| colon before the dashes | colons on both sides | colon after the dashes |`,

  taskList: `# Task lists

- [x] Start each item with a dash, like in a bullet list.
- [x] Add square brackets with a space between them to get an empty box.
- [ ] Replace this space with the letter x to tick the box.`,

  escape: `# Escaping

Some characters have a special meaning in Markdown. To display them as they are, you put a backslash in front of them.

\\# This line starts with a hash sign, but it is not a heading.

1986\\. This is not a numbered list, it is a year.

The calculation 2\\*3\\*4 gives 24.`,

  recap: `# Summary

## What you can do

You now know how to format a text with Markdown:

1. **headings** of several levels;
2. text in *italic* or in **bold**;
3. lists
   - with bullets,
   - with numbers,
   - or with tasks.

---

## Going further

> Markdown is everywhere: in forums, wikis, development tools,\\
> and even in the messages we write to an AI.

| Element | Syntax |
| --- | --- |
| Code in the text | \`backticks\` |
| Link | [brackets and parentheses](https://www.markdownguide.org) |

\`\`\`text
A code block keeps    its spaces.
\`\`\``,

  challenge: `# Final challenge

## A *very* **secret** recipe

This challenge mixes **all** the syntaxes seen so far.\\
Take your time: every detail matters.

### Ingredients

- [x] 2 eggs
- [x] 100 g of **flour**
- [ ] 1 pinch of *salt*

### Steps

1. Mix in a bowl:
   - the flour,
   - the eggs
     1. one by one,
     2. without stopping.
2. Bake at \`180°C\` for 2\\*3\\*5 minutes.

> **Tip** from the chef:\\
> read the [Markdown guide](https://www.markdownguide.org).

---

| Step | Duration | Price |
| :--- | :---: | ---: |
| Preparation | *10 min* | \`2 €\` |
| Baking | **30 min** | \`1 €\` |

\\# This is not a heading.

\`\`\`python
def bake(minutes):
    return "Ready in " + str(minutes) + " min"
\`\`\``,
};

export default EN;
