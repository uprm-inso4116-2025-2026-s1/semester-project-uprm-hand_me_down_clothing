import type { PaymentInput, PaymentResult } from './paymentTypes';

export interface PaymentMethod {
  readonly id: string;
  readonly label: string;
  pay(input: PaymentInput): Promise<PaymentResult>;
}
