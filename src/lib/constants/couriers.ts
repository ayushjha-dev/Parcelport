export const COURIERS = [
  'Amazon',
  'Flipkart',
  'BlueDart',
  'DTDC',
  'Delhivery',
  'FedEx',
  'DHL',
  'India Post',
  'Ecom Express',
  'Ekart',
  'Other',
] as const;

export type Courier = (typeof COURIERS)[number];
