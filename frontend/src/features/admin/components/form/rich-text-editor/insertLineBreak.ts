// Enter w edytorze wstawia <br> zamiast nowego <div>, żeby HTML był prosty jak w danych strony
export function insertLineBreak(editor: HTMLElement) {
  const sel = window.getSelection();
  if (!sel) return;

  // On first focus the range may live outside the editor — anchor it inside
  let range: Range;
  if (
    sel.rangeCount > 0 &&
    editor.contains(sel.getRangeAt(0).commonAncestorContainer)
  ) {
    range = sel.getRangeAt(0);
  } else {
    range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  range.deleteContents();

  const br = document.createElement("br");
  range.insertNode(br);

  // insertNode splits the text node and may leave an empty TextNode after <br>;
  // that empty node is rendered on the same visual line, making the cursor appear
  // stuck — remove it so the phantom logic below always applies at end of content
  const afterBr = br.nextSibling;
  if (afterBr?.nodeType === Node.TEXT_NODE && afterBr.textContent === "") {
    afterBr.parentNode?.removeChild(afterBr);
  }

  range.setStartAfter(br);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);

  // Without a node after the <br> the cursor stays invisible at end of content
  if (br.parentNode === editor && !br.nextSibling) {
    editor.appendChild(document.createElement("br"));
  }
}
