import type { PaymentMethod } from '../paymentMethod';
import type { PaymentInput, PaymentResult } from '../paymentTypes';

export class PayPalPayment implements PaymentMethod {
  readonly id = 'paypal' as const;
  readonly label = 'PayPal';

  async pay(input: PaymentInput): Promise<PaymentResult> {
    if (!input.meta || typeof (input.meta as any).approvalId !== 'string') {
      return { ok: false, error: 'Missing PayPal approvalId', provider: this.id };
    }
    const txId = `pp_${input.orderId}_${Date.now()}`;
    return { ok: true, txId, provider: this.id };
  }
}
