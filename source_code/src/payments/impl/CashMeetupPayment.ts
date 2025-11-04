import type { PaymentMethod } from '../paymentMethod';
import type { PaymentInput, PaymentResult } from '../paymentTypes';

export class CashMeetupPayment implements PaymentMethod {
  readonly id = 'cash_meetup' as const;
  readonly label = 'Cash (In-Person)';

  async pay(input: PaymentInput): Promise<PaymentResult> {
    const txId = `cash_${input.orderId}`;
    return { ok: true, txId, provider: this.id };
  }
}
