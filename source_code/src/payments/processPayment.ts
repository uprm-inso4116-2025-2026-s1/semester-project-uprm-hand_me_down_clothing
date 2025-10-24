import type { PaymentResult } from './paymentTypes';
import type { PaymentRegistry } from './PaymentRegistry';

export async function processPayment(
  registry: PaymentRegistry,
  methodId: string,
  input: Parameters<ReturnType<PaymentRegistry['get']>['pay']>[0]
): Promise<PaymentResult> {
  const method = registry.get(methodId);
  return method.pay(input);
}
