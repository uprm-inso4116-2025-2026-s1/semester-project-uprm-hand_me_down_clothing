import { PaymentRegistry } from './PaymentRegistry';
import { CreditCardPayment } from './impl/CreditCardPayment';
import { PayPalPayment } from './impl/PayPalPayment';
import { CashMeetupPayment } from './impl/CashMeetupPayment';

export const paymentRegistry = new PaymentRegistry();

paymentRegistry.register(new CreditCardPayment());
paymentRegistry.register(new PayPalPayment());
paymentRegistry.register(new CashMeetupPayment()); 
