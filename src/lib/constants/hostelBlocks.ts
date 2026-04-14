export const HOSTEL_BLOCKS = [
  'Block A',
  'Block B',
  'Block C',
  'Block D',
  'Block E',
  'Block F',
  'Block G',
  'Block H',
] as const;

export type HostelBlock = (typeof HOSTEL_BLOCKS)[number];
