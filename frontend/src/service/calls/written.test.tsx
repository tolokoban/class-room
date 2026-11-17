import { renderToStaticMarkup } from "react-dom/server";
import Markdown, { defaultUrlTransform } from "react-markdown";

import {
  getWrittenAttachmentLink,
  getWrittenAttachmentUrl,
  makeWrittenAttachmentResolver,
  WrittenAttachment,
} from "./written";

// The real module loads the state of the application (it needs `localStorage`).
vi.mock("./service", () => ({ api: vi.fn(), ApiErrorTypeAssertion: Error, throwIfError: vi.fn() }));

const BASE = "https://example.com/app/";

const ATTACHMENTS: WrittenAttachment[] = [
  { id: 7, name: "hugo.pdf", mime: "application/pdf", size: 1000 },
  { id: 8, name: "mon fichier [v2].docx", mime: "application/msword", size: 2000 },
  { id: 9, name: "Carte.PNG", mime: "image/png", size: 3000 },
];

beforeAll(() => {
  vi.stubGlobal("document", { baseURI: BASE });
});

afterAll(() => {
  vi.unstubAllGlobals();
});

/** Same composition of `urlTransform` as in `<Md resolveUrl />`. */
function render(value: string, resolveUrl: (url: string) => string | undefined): string {
  return renderToStaticMarkup(
    <Markdown urlTransform={(url) => resolveUrl(url) ?? defaultUrlTransform(url)}>
      {value}
    </Markdown>,
  );
}

describe("getWrittenAttachmentUrl()", () => {
  it("should not need a class room for the owner", () => {
    expect(getWrittenAttachmentUrl(7)).toBe("api/written/attachment-get?attachmentId=7");
  });

  it("should encode the class room code", () => {
    expect(getWrittenAttachmentUrl(7, "a b&c")).toBe(
      "api/written/attachment-get?attachmentId=7&classroomCode=a%20b%26c",
    );
  });
});

describe("makeWrittenAttachmentResolver()", () => {
  const resolve = makeWrittenAttachmentResolver(ATTACHMENTS, "CLASS");

  it("should ignore the other URLs", () => {
    expect(resolve("https://example.com")).toBeUndefined();
    expect(resolve("#/teacher")).toBeUndefined();
  });

  it("should resolve an attachment to an absolute URL", () => {
    expect(resolve("attachment:hugo.pdf")).toBe(
      `${BASE}api/written/attachment-get?attachmentId=7&classroomCode=CLASS`,
    );
  });

  it("should decode the name and ignore the case", () => {
    expect(resolve("attachment:mon%20fichier%20%5Bv2%5D.docx")).toContain("attachmentId=8");
    expect(resolve("ATTACHMENT:carte.png")).toContain("attachmentId=9");
  });

  it("should give an empty URL for an unknown attachment", () => {
    expect(resolve("attachment:missing.pdf")).toBe("");
  });
});

describe("getWrittenAttachmentLink()", () => {
  it("should keep the other links safe", () => {
    const resolve = makeWrittenAttachmentResolver(ATTACHMENTS);
    expect(render("[x](javascript:alert(1))", resolve)).toContain('href=""');
  });

  it("should produce a link that the resolver understands", () => {
    const resolve = makeWrittenAttachmentResolver(ATTACHMENTS);
    for (const attachment of ATTACHMENTS) {
      const html = render(getWrittenAttachmentLink(attachment.name), resolve);
      expect(html).toContain(
        `href="${BASE}api/written/attachment-get?attachmentId=${attachment.id}"`,
      );
      expect(html).toContain(`>${attachment.name}</a>`);
    }
  });

  it("should resolve images too", () => {
    const resolve = makeWrittenAttachmentResolver(ATTACHMENTS);
    const html = render("![map](attachment:Carte.PNG)", resolve);
    expect(html).toContain(`src="${BASE}api/written/attachment-get?attachmentId=9"`);
  });
});
