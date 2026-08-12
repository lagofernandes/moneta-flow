/**
 * Extracts raw text from a PDF buffer using pdfjs-dist (Mozilla PDF.js).
 * Handles CIDFont/ToUnicode/FlateDecode encodings that pdf-parse cannot decode.
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
      const pageText = textContent.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (err) {
    console.warn('[PDF Parser] pdfjs-dist extraction failed:', err);
    return '';
  }
}
