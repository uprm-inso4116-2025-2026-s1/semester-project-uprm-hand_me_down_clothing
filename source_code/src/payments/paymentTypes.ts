export type PaymentInput = {
  amountCents: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'MXN' | 'Other';
  orderId: string;
  meta?: Record<string, unknown>;
};

export type PaymentResult =
  | { ok: true; txId: string; provider: string }
  | { ok: false; error: string; code?: string; provider: string };
