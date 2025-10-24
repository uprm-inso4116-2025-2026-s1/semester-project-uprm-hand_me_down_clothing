import type { PaymentMethod } from '../paymentMethod';
import type { PaymentInput, PaymentResult } from '../paymentTypes';

export class CreditCardPayment implements PaymentMethod {
  readonly id = 'credit_card' as const;
  readonly label = 'Credit Card';

  async pay(input: PaymentInput): Promise<PaymentResult> {
    if (!input.meta || typeof (input.meta as any).token !== 'string') {
      return { ok: false, error: 'Missing card token', provider: this.id };
    }
    const txId = `cc_${input.orderId}_${Date.now()}`;
    return { ok: true, txId, provider: this.id };
  }
}
