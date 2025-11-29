export interface Account {
  accountID: string;
  accountBalance: number;
  withdraw(amount: number): void;
  deposit(amount: number): void;
}

export interface AccountRepository {
  getById(id: string): Promise<Account>; // Promise meamns function eventually will return Account object as value. 
  save(account: Account): Promise<void>; // Promise meamns function eventually will return nothing(void). 
}
