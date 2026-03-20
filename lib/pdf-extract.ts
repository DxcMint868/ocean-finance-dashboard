interface TextItem {
  str: string;
  transform: number[];
}

const Y_TOLERANCE = 3;

function groupItemsIntoLines(items: TextItem[]): string[] {
  if (items.length === 0) return [];

  const sorted = [...items].sort((a, b) => {
    const yDiff = b.transform[5] - a.transform[5];
    if (Math.abs(yDiff) > Y_TOLERANCE) return yDiff;
    return a.transform[4] - b.transform[4];
  });

  const lines: string[] = [];
  let currentY: number | null = null;
  let currentLine = "";

  for (const item of sorted) {
    const y = item.transform[5];
    if (currentY === null || Math.abs(y - currentY) > Y_TOLERANCE) {
      if (currentLine.trim()) lines.push(currentLine.trim());
      currentLine = item.str;
      currentY = y;
    } else {
      currentLine += (item.str.startsWith(" ") ? "" : " ") + item.str;
    }
  }
  if (currentLine.trim()) lines.push(currentLine.trim());

  return lines;
}

let workerConfigured = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadPdfjs(): Promise<any> {
  // @ts-expect-error -- native browser import from public/, bypasses webpack
  // to avoid MetaMask's Object.defineProperty conflict with webpack modules.
  const pdfjsLib = await import(/* webpackIgnore: true */ "/pdf.min.mjs");

  if (!workerConfigured) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    workerConfigured = true;
  }

  return pdfjsLib;
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjsLib = await loadPdfjs();

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const allLines: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const textItems = (content.items as TextItem[]).filter(
      (item) => typeof item.str === "string"
    );
    const lines = groupItemsIntoLines(textItems);
    allLines.push(...lines);
    if (i < pdf.numPages) allLines.push(`\n${i} of ${pdf.numPages}`);
  }

  return allLines.join("\n");
}
