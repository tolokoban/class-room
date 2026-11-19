/** Maximum time to wait for the stylesheets and images before printing. */
const LOADING_TIMEOUT = 5000;

/**
 * Open the print dialog of the browser for a copy of `content`,
 * so that it can be saved as a PDF file named after `title`.
 * The copy is put in a hidden iframe, with the stylesheets and the theme of the page.
 * @param className Class of the iframe's body, to style the copy for print.
 */
export async function printAsPdf(title: string, content: HTMLElement, className: string) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
  document.body.append(iframe);
  const win = iframe.contentWindow;
  const doc = iframe.contentDocument;
  if (!win || !doc) {
    iframe.remove();
    return;
  }

  fillDocument(doc, title, content, className);
  await waitForResources(doc);
  win.addEventListener("afterprint", () => iframe.remove());
  win.focus();
  win.print();
}

/**
 * Fill the empty document `doc` with the stylesheets and the theme of the page,
 * a heading with `title`, and a copy of `content`.
 * The section of the current exercise is not highlighted in the copy.
 * Linked stylesheets are only cloned: they may not be loaded yet when it returns
 * (see `waitForResources()`).
 */
function fillDocument(doc: Document, title: string, content: HTMLElement, className: string) {
  doc.documentElement.lang = document.documentElement.lang;
  doc.title = title;
  const base = doc.createElement("base");
  base.href = document.baseURI;
  doc.head.append(base);
  for (const style of document.querySelectorAll('style, link[rel="stylesheet"]')) {
    doc.head.append(style.cloneNode(true));
  }
  // The theme variables are defined in the style of the body.
  doc.body.setAttribute("style", document.body.getAttribute("style") ?? "");
  doc.body.className = className;
  const heading = doc.createElement("h1");
  heading.textContent = title;
  const copy = content.cloneNode(true) as HTMLElement;
  for (const section of copy.querySelectorAll("[data-current]")) {
    section.setAttribute("data-current", "false");
  }
  doc.body.append(heading, copy);
}

/**
 * Wait for the stylesheets and the images of `doc` to be loaded.
 * It never rejects: a resource that fails to load is ignored,
 * and it resolves anyway after `LOADING_TIMEOUT` milliseconds.
 */
function waitForResources(doc: Document): Promise<unknown> {
  const pending: Promise<void>[] = [];
  for (const link of doc.querySelectorAll("link")) pending.push(loaded(link));
  for (const img of doc.querySelectorAll("img")) {
    if (!img.complete) pending.push(loaded(img));
  }
  return Promise.race([
    Promise.all(pending),
    new Promise((resolve) => globalThis.setTimeout(resolve, LOADING_TIMEOUT)),
  ]);
}

/**
 * @returns A promise resolved as soon as `element` has been loaded, or has failed to load.
 * Beware: if it has already been loaded, the promise is never resolved.
 */
function loaded(element: HTMLElement): Promise<void> {
  return new Promise((resolve) => {
    element.addEventListener("load", () => resolve(), { once: true });
    element.addEventListener("error", () => resolve(), { once: true });
  });
}
