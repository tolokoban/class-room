import React from "react";

const KIND: Record<string, string> = { " ": "space", "\t": "tab", "\n": "eol" };

/**
 * Wrap every space, tab and line break in a span so that CSS can draw a marker
 * on top of it. The characters themselves are kept, so the text does not move.
 * @param selected In a selected segment, a line break is preceded by a
 * highlighting space (see `computeSegments`): this space gets the eol marker.
 */
export function revealInvisibles(text: string, selected: boolean): React.ReactNode[] {
  const pattern = selected ? /( \n|[ \t\n])/u : /([ \t\n])/u;
  return text.split(pattern).map((part, index) => {
    if (index % 2 === 0) return part;
    if (part === " \n") {
      return (
        <React.Fragment key={index}>
          <span data-invisible="eol"> </span>
          {"\n"}
        </React.Fragment>
      );
    }
    return (
      <span key={index} data-invisible={KIND[part]}>
        {part}
      </span>
    );
  });
}
