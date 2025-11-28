// source_code/src/postingrule/postingRule.ts

export type FiringMode = 'EAGER' | 'DEFERRED';

// ENTRY
export class Entry {
  readonly amount: number;
  readonly description: string;
  readonly timestamp: Date;

  constructor(amount: number, description: string) {
    this.amount = amount;
    this.description = description;
    this.timestamp = new Date();
  }
}

// POSTING RULE INTERFACE
export interface PostingRule {
  apply(account: Account, entry: Entry): void;
}

// EXAMPLE RULE
export class BalanceUpdatePostingRule implements PostingRule {
  apply(account: Account, entry: Entry): void {
    const newBalance = account.balance + entry.amount;
    account.balance = newBalance;

    account.addToRuleLog(
      `Rule applied to "${entry.description}" | amount=${entry.amount} | new balance=${newBalance}`,
    );
  }
}

// ACCOUNT
export class Account {
  readonly id: string;

  balance = 0;
  firingMode: FiringMode;
  postingRule?: PostingRule;

  entries: Entry[] = [];
  deferredEntries: Entry[] = [];
  ruleLog: string[] = [];

  constructor(id: string, postingRule?: PostingRule, firingMode: FiringMode = 'EAGER') {
    this.id = id;
    this.postingRule = postingRule;
    this.firingMode = firingMode;
  }

  addToRuleLog(msg: string) {
    this.ruleLog.push(msg);
  }

  addEntry(entry: Entry) {
    this.entries.push(entry);

    if (!this.postingRule) return;

    if (this.firingMode === 'EAGER') {
      this.postingRule.apply(this, entry);
    } else {
      this.deferredEntries.push(entry);
    }
  }

  runDeferredRules() {
    if (!this.postingRule) return;

    for (const entry of this.deferredEntries) {
      this.postingRule.apply(this, entry);
    }

    this.deferredEntries = [];
  }
}

// Optional demo, fine to keep
export function runEagerVsDeferredDemo() {
  const rule = new BalanceUpdatePostingRule();

  const eager = new Account('EAGER-ACC', rule, 'EAGER');
  eager.addEntry(new Entry(100, 'Deposit 100'));

  console.log('=== EAGER MODE ===');
  console.log('Balance:', eager.balance);
  console.log('Rule log:', eager.ruleLog);

  const deferred = new Account('DEFER-ACC', rule, 'DEFERRED');
  deferred.addEntry(new Entry(100, 'Deposit 100'));

  console.log('=== DEFERRED (before running rules) ===');
  console.log('Balance:', deferred.balance);
  console.log('Deferred entries:', deferred.deferredEntries.length);

  deferred.runDeferredRules();

  console.log('=== DEFERRED (after running rules) ===');
  console.log('Balance:', deferred.balance);
  console.log('Rule log:', deferred.ruleLog);
}
