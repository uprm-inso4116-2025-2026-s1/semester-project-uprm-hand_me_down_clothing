export class AdoptionFee {
    private readonly _amount: number;
    private readonly _currency: string;
  
    constructor(amount: number, currency: string) {
      if (amount < 0) throw new Error("Amount must be non-negative");
      this._amount = amount;
      this._currency = currency.toUpperCase();
  
      // Freeze the instance so no property can be changed
      Object.freeze(this);
    }
  
    // Read-only accessors
    get amount(): number {
      return this._amount;
    }
  
    get currency(): string {
      return this._currency;
    }
  
    // Value equality based on attributes
    equals(other: AdoptionFee): boolean {
      return (
        this._amount === other._amount &&
        this._currency === other._currency
      );
    }
  
    //Copy semantics — create a modified copy safely
    withAmount(newAmount: number): AdoptionFee {
      return new AdoptionFee(newAmount, this._currency);
    }
  
    withCurrency(newCurrency: string): AdoptionFee {
      return new AdoptionFee(this._amount, newCurrency);
    }
  
    toString(): string {
      return `${this._currency} ${this._amount.toFixed(2)}`;
    }
  }
  