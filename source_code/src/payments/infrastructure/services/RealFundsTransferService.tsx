import { FundsTransferService } from "../../domain/services/FundsTransferService";
import { AccountRepository } from "./repositories/AccountRepository";

export class RealFundsTransferService implements FundsTransferService {
  constructor(private accountRepo: AccountRepository) {}

  async transfer(fromId: string, toId: string, amount: number): Promise<void> {
    const from = await this.accountRepo.getById(fromId);
    const to = await this.accountRepo.getById(toId);

    from.withdraw(amount);
    to.deposit(amount);

    await this.accountRepo.save(from);
    await this.accountRepo.save(to);
  }
}
