// @ts-nocheck
import { AdoptionFee } from "./AdoptionFee";

describe("AdoptionFee Value Object", () => {
  test("Equality test: equal values should be equal", () => {
    const fee1 = new AdoptionFee(50, "usd");
    const fee2 = new AdoptionFee(50, "USD");
    expect(fee1.equals(fee2)).toBe(true);
  });

  test("Inequality test: different values should not be equal", () => {
    const fee1 = new AdoptionFee(50, "USD");
    const fee2 = new AdoptionFee(75, "USD");
    expect(fee1.equals(fee2)).toBe(false);
  });

  test("Immutability test: should throw when attempting modification", () => {
    const fee = new AdoptionFee(30, "USD");
    expect(() => {
      // @ts-ignore
      fee._amount = 99;
    }).toThrow(TypeError);
    expect(fee.amount).toBe(30);
  });

  test("Copy test: copy with different amount should not affect original", () => {
    const fee1 = new AdoptionFee(50, "USD");
    const fee2 = fee1.withAmount(100);

    expect(fee1.amount).toBe(50);
    expect(fee2.amount).toBe(100);
    expect(fee1.equals(fee2)).toBe(false);
  });
});
