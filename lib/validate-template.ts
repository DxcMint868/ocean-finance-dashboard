import type { ParsedStatement } from "./preprocess";

export interface TemplateValidationResult {
  valid: boolean;
  reason?: string;
}

export function validateTemplate(
  statement: ParsedStatement
): TemplateValidationResult {
  const { header, summary, rawTransactionRowCount } = statement;

  if (header.accountHolder === null && header.accountNumber === null) {
    return {
      valid: false,
      reason:
        "Could not identify account holder or account number. The file does not match the expected statement template.",
    };
  }

  if (summary.openingBalance === null && summary.closingBalance === null) {
    return {
      valid: false,
      reason:
        "Could not find balance information. The file does not match the expected statement template.",
    };
  }

  if (rawTransactionRowCount === 0) {
    return {
      valid: false,
      reason:
        "No transactions found in the file. The file does not match the expected statement template.",
    };
  }

  return { valid: true };
}
