export interface FundsTransferService {
  transfer(fromAccountId: string, toAccountId: string, amount: number): Promise<void>;
}
