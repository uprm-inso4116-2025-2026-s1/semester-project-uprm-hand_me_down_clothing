import type { PaymentResult } from './paymentTypes';
import type { PaymentRegistry } from './PaymentRegistry';
import type { Logger } from '../generic/logging/loggingModule'; // ⬅️ new

export async function processPayment(
  registry: PaymentRegistry,
  methodId: string,
  input: Parameters<ReturnType<PaymentRegistry['get']>['pay']>[0],
  logger?: Logger, // ⬅️ optional logger, so old callers still work
): Promise<PaymentResult> {
  const method = registry.get(methodId);

  logger?.info(
    `Starting payment using method "${methodId}" with input: ${JSON.stringify(input)}`,
    'payment',
  );

  try {
    const result = await method.pay(input);

    if ((result as any).success === false) {
      logger?.warn(
        `Payment completed but reported failure for method "${methodId}". Result: ${JSON.stringify(
          result,
        )}`,
        'payment',
      );
    } else {
      logger?.info(
        `Payment completed successfully with method "${methodId}". Result: ${JSON.stringify(
          result,
        )}`,
        'payment',
      );
    }

    return result;
  } catch (err) {
    logger?.error(
      `Payment threw exception for method "${methodId}": ${(err as Error).message}`,
      'payment',
    );
    throw err;
  }
}
