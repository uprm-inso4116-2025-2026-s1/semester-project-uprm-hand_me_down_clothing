// source_code/src/components/PostingRuleDemoView.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  Account,
  Entry,
  BalanceUpdatePostingRule,
} from '../postingrule/postingRule'; // ⬅️ default correct path

const PostingRuleDemoView: React.FC = () => {
  const [eagerBalance, setEagerBalance] = useState(0);
  const [eagerLog, setEagerLog] = useState<string[]>([]);

  const [deferredBalance, setDeferredBalance] = useState(0);
  const [deferredLog, setDeferredLog] = useState<string[]>([]);
  const [deferredPending, setDeferredPending] = useState(0);

  useEffect(() => {
    const rule = new BalanceUpdatePostingRule();

    // ▶️ EAGER MODE
    const eager = new Account('EAGER', rule, 'EAGER');
    eager.addEntry(new Entry(100, 'Deposit 100'));
    setEagerBalance(eager.balance);
    setEagerLog([...eager.ruleLog]);

    // ▶️ DEFERRED MODE
    const deferred = new Account('DEFERRED', rule, 'DEFERRED');
    deferred.addEntry(new Entry(100, 'Deposit 100'));
    setDeferredBalance(deferred.balance);
    setDeferredPending(deferred.deferredEntries.length);
    setDeferredLog([...deferred.ruleLog]);

    // Now fire deferred rules after a short delay
    setTimeout(() => {
      deferred.runDeferredRules();
      setDeferredBalance(deferred.balance);
      setDeferredPending(deferred.deferredEntries.length);
      setDeferredLog([...deferred.ruleLog]);
    }, 2000);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Posting Rule Demo</h1>

      <section style={{ marginTop: '20px' }}>
        <h2>Eager Mode</h2>
        <p>
          <b>Final Balance:</b> ${eagerBalance}
        </p>

        <h3>Rule Log:</h3>
        <ul>
          {eagerLog.map((log, i) => (
            <li key={i}>{log}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2>Deferred Mode</h2>

        <p>
          <b>Pending Entries:</b> {deferredPending}
        </p>
        <p>
          <b>Final Balance:</b> ${deferredBalance}
        </p>

        <h3>Rule Log:</h3>
        <ul>
          {deferredLog.map((log, i) => (
            <li key={i}>{log}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default PostingRuleDemoView; // ⬅️ IMPORTANT: default export
