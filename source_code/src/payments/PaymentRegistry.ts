import type { PaymentMethod } from './paymentMethod';

export class PaymentRegistry {
  private map = new Map<string, PaymentMethod>();

  register(method: PaymentMethod) {
    if (this.map.has(method.id)) {
      throw new Error(`Payment method already registered: ${method.id}`);
    }
    this.map.set(method.id, method);
  }

  get(id: string): PaymentMethod {
    const impl = this.map.get(id);
    if (!impl) throw new Error(`Unknown payment method: ${id}`);
    return impl;
  }

  list(): readonly PaymentMethod[] {
    return [...this.map.values()];
  }
}
