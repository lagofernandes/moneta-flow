/**
 * Extracts raw text from a PDF buffer using pdfjs-dist (Mozilla PDF.js).
 * Handles CIDFont/ToUnicode/FlateDecode encodings that pdf-parse cannot decode.
 * Uses character position heuristics to avoid inserting bogus spaces between
 * individual glyphs (common in Itaú, Bradesco, and other Brazilian bank PDFs).
 */
export async function extractTextWithPdfJs(pdfBuffer: Buffer): Promise<string> {
  try {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

    const data = new Uint8Array(pdfBuffer);
    const loadingTask = pdfjsLib.getDocument({ data, useSystemFonts: true });
    const pdfDoc = await loadingTask.promise;

    let fullText = '';
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();

      let lastX = -Infinity;
      let lastWidth = 0;
      let lastY = -Infinity;
      let lineText = '';

      for (const item of textContent.items as any[]) {
        if (!('str' in item) || !item.str) continue;

        const x = item.transform?.[4] ?? 0;
        const y = item.transform?.[5] ?? 0;
        const width = item.width ?? 0;

        // If Y position changed significantly, it's a new line
        if (Math.abs(y - lastY) > 2) {
          if (lineText) fullText += lineText + '\n';
          lineText = item.str;
        } else {
          // Same line: check horizontal gap between end of last item and start of this one
          const gap = x - (lastX + lastWidth);
          const fontSize = Math.abs(item.transform?.[0] ?? 12);
          const spaceThreshold = fontSize * 0.25; // ~25% of font size = intentional space

          if (gap > spaceThreshold) {
            lineText += ' ' + item.str;
          } else {
            lineText += item.str;
          }
        }

        lastX = x;
        lastWidth = width;
        lastY = y;
      }

      if (lineText) fullText += lineText + '\n';
    }

    // Post-extraction cleanup: collapse remaining kerning artifacts
    // Pattern: sequences of single characters separated by spaces (e.g. "M E R C A D O" → "MERCADO")
    fullText = fullText.replace(/\b([A-Za-zÀ-ÿ])( [A-Za-zÀ-ÿ]){2,}\b/g, (match) => {
      // Only collapse if ALL segments are single chars (true kerning artifact)
      const parts = match.split(' ');
      if (parts.every(p => p.length === 1)) {
        return parts.join('');
      }
      return match;
    });

    return fullText;
  } catch (err) {
    console.warn('[PDF Parser] pdfjs-dist extraction failed:', err);
    return '';
  }
}

