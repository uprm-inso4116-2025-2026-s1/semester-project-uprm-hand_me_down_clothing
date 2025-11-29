import { FundsTransferService } from "../../domain/services/FundsTransferService";

export class MockFundsTransferService implements FundsTransferService {
  public calls: Array<{ from: string; to: string; amount: number }> = []; // List of Objects
  // Example:
//     [
//   { from: "A1", to: "B2", amount: 50 },
//   { from: "C3", to: "D4", amount: 100 },
//   { from: "E5", to: "F6", amount: 75 }
//     ]

// Method 
  async transfer(from: string, to: string, amount: number): Promise<void> { 
    this.calls.push({ from, to, amount });
    console.log("Mock transfer successful: -> [From, To, Amount]", { from, to, amount });
  }
}
