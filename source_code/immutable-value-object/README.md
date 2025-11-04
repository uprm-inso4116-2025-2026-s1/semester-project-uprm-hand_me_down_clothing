Introduction:
    In Software Design, a Value Object represents a small descriptive entity whose equality is based
    on its attributes rather than its identity. It is immutable, meaning it can’t change after creation.
    This implementation models the cost of adopting or purchasing an item. Its purpose is to ensure
    data consistency, prevent unintended mutations, and maintain reliable equality behavior within
    the domain.

    In the Hand Me Down domain, AdoptionFee models the price associated with an item listing or
    adoption post. Since fees should remain constant once defined, immutability prevents
    inconsistent pricing. The Value Object ensures that identical fees compare as equal can be reused
    safely across transactions.

Conclusion:
    This project successfully implemented an immutable Value Object in TypeScript to model the
    AdoptionFee concept from the Hand Me Down domain. The design enforces immutability,
    guarantees equality based solely on attribute values, and enables controlled object copying. The
    results confirm that this approach supports data integrity, predictable behavior, and maintainable
    software design aligned with Domain-Driven Design principles.


Class: AdoptionFee
File AdoptionFee.ts

Key Features
    Value semantics:** Two `AdoptionFee` objects are equal if their `amount` and `currency` are equal.  
    Immutability:** No setters; internal state cannot be changed after construction.  
    Copy semantics:** Methods `withAmount()` and `withCurrency()` return new modified copies safely.

Example
const fee1 = new AdoptionFee(25, "USD");
const fee2 = new AdoptionFee(25, "usd");
fee1.equals(fee2); // true

const fee3 = fee1.withAmount(40);
fee3.equals(fee1); // false


