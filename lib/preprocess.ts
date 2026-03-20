export interface ParsedTransaction {
  date: string;
  description: string;
  debit: string | null;
  credit: string | null;
  balance: string | null;
}

export interface StatementHeader {
  accountHolder: string | null;
  accountNumber: string | null;
  currency: string | null;
  statementPeriod: string | null;
}

export interface StatementSummary {
  openingBalance: string | null;
  closingBalance: string | null;
  totalDebit: string | null;
  totalCredit: string | null;
}

export interface ParsedStatement {
  header: StatementHeader;
  summary: StatementSummary;
  transactions: ParsedTransaction[];
  rawTransactionRowCount: number;
}

const MONEY_RE = /\$[\d,]+\.\d{2}/g;
const DATE_RE =
  /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s+\d{4}/;

function extractMoney(text: string): string | null {
  const match = text.match(/\$([\d,]+\.\d{2})/);
  return match ? match[1].replace(/,/g, "") : null;
}

function firstPageOnly(text: string): string {
  const pageBreak = text.indexOf("\n1 of ");
  if (pageBreak !== -1) return text.substring(0, pageBreak);
  return text;
}

function extractHeader(text: string): StatementHeader {
  const holderMatch = text.match(
    /^([A-Z][A-Z\s.&,]+(?:PTE\.|LTD\.|INC\.|LLC|CORP)\.?)/m
  );
  const accountHolder = holderMatch?.[1]?.trim() ?? null;
  const accountNumber = text.match(/Account\s*Number\s*(\d+)/i)?.[1] ?? null;
  const currency = text.match(/Account\s*Currency\s*([A-Z]{3})/i)?.[1] ?? null;
  const statementPeriod =
    text.match(/(\d{1,2}\s+\w+\s+\d{4}\s+to\s+\d{1,2}\s+\w+\s+\d{4})/i)?.[1] ??
    null;
  return { accountHolder, accountNumber, currency, statementPeriod };
}

function extractSummary(text: string): StatementSummary {
  const openingBalance = extractMoney(
    text.match(/Opening\s*Balance\s*(\$[\d,]+\.\d{2})/i)?.[0] ?? ""
  );
  const closingBalance = extractMoney(
    text.match(/Closing\s*Balance\s*(\$[\d,]+\.\d{2})/i)?.[0] ?? ""
  );
  const totalDebit = extractMoney(
    text.match(/Debit\s*\(-?\)\s*(\$[\d,]+\.\d{2})/i)?.[0] ?? ""
  );
  const totalCredit = extractMoney(
    text.match(/Credit\s*\(\+?\)\s*(\$[\d,]+\.\d{2})/i)?.[0] ?? ""
  );
  return { openingBalance, closingBalance, totalDebit, totalCredit };
}

function extractRawRows(text: string): string[] {
  const lines = text.split("\n");

  let txStart = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/Transaction\s*Date\s*Description/i.test(lines[i])) {
      txStart = i + 1;
      break;
    }
  }
  if (txStart === -1) return [];

  const rows: string[] = [];
  let currentRow = "";

  for (let i = txStart; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (/^(The balance|Closing Balance|\d+ of \d+)/i.test(line)) break;

    if (DATE_RE.test(line)) {
      if (currentRow) rows.push(currentRow);
      currentRow = line;
    } else {
      currentRow += " " + line;
    }
  }
  if (currentRow) rows.push(currentRow);

  return rows;
}

function parseRow(row: string): ParsedTransaction {
  const amounts = row.match(MONEY_RE) ?? [];
  const dateMatch = row.match(DATE_RE);
  const date = dateMatch ? dateMatch[0] : "???";

  const descEnd = row.indexOf("$");
  const description =
    descEnd > 0
      ? row.substring(date.length, descEnd).trim()
      : row.substring(date.length).trim();

  const toValue = (s: string) => s.replace("$", "").replace(/,/g, "");

  if (amounts.length === 2) {
    const isDebit = /outgoing|transfer to|payment to/i.test(description);
    const [amount, balance] = amounts;
    return isDebit
      ? { date, description, debit: toValue(amount), credit: null, balance: toValue(balance) }
      : { date, description, debit: null, credit: toValue(amount), balance: toValue(balance) };
  }

  if (amounts.length === 3) {
    const [debit, credit, balance] = amounts;
    return {
      date,
      description,
      debit: toValue(debit),
      credit: toValue(credit),
      balance: toValue(balance),
    };
  }

  return { date, description, debit: null, credit: null, balance: null };
}

export function parseStatement(rawText: string): ParsedStatement {
  const text = firstPageOnly(rawText);
  const header = extractHeader(text);
  const summary = extractSummary(text);
  const rawRows = extractRawRows(text);
  const transactions = rawRows.map(parseRow);

  return {
    header,
    summary,
    transactions,
    rawTransactionRowCount: rawRows.length,
  };
}
