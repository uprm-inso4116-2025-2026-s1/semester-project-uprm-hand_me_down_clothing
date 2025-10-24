'use client';
import React, { useMemo, useState } from 'react';
import { paymentRegistry } from '../../payments/registry.bootstrap';
import { processPayment } from '../../payments/processPayment';


export default function Checkout() {
  const methods = useMemo(() => paymentRegistry.list(), []);
  const [methodId, setMethodId] = useState(methods[0]?.id ?? 'credit_card');
  const [status, setStatus] = useState('');

  async function onPay() {
    setStatus('Processing...');
    const meta =
      methodId === 'credit_card'
        ? { token: 'tok_demo' }
        : methodId === 'paypal'
        ? { approvalId: 'APPROVAL_DEMO' }
        : {};

    const res = await processPayment(paymentRegistry, methodId, {
      amountCents: 2599,
      currency: 'USD',
      orderId: 'ORDER-123',
      meta,
    });

    setStatus(res.ok ? `Success: ${res.txId} via ${res.provider}` : `Failed: ${res.error}`);
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-3">
      <h2 className="text-xl font-semibold">Checkout</h2>

      <label className="block text-sm">Payment method</label>
      <select
        className="w-full border rounded p-2"
        value={methodId}
        onChange={(e) => setMethodId(e.target.value)}
      >
        {methods.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label}
          </option>
        ))}
      </select>

      <button onClick={onPay} className="w-full rounded-xl p-3 border shadow">
        Pay $25.99
      </button>

      {status && <p className="text-sm">{status}</p>}
    </div>
  );
}
