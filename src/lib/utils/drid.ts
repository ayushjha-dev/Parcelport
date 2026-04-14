import { format } from 'date-fns';

export function generateDRID(date: Date, sequence: number): string {
  const datePart = format(date, 'yyyyMMdd');
  const seqPart = sequence.toString().padStart(4, '0');
  return `DRID-${datePart}-${seqPart}`;
}

export function parseDRID(drid: string): { date: Date; sequence: number } | null {
  const match = drid.match(/^DRID-(\d{8})-(\d{4})$/);
  if (!match) return null;

  const [, dateStr, seqStr] = match;
  const year = parseInt(dateStr.slice(0, 4));
  const month = parseInt(dateStr.slice(4, 6)) - 1;
  const day = parseInt(dateStr.slice(6, 8));
  const date = new Date(year, month, day);
  const sequence = parseInt(seqStr);

  return { date, sequence };
}

export function validateDRID(drid: string): boolean {
  return /^DRID-\d{8}-\d{4}$/.test(drid);
}
