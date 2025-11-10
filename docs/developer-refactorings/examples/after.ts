export type Item = { id: string, price: number, quantity: number }

export class OrderCalculator {
  items: Item[]
  discountRate: number

  constructor(items: Item[], discountRate = 0) {
    this.items = items
    this.discountRate = discountRate
  }

  // explicit: calculates the order total including discount
  calculateOrderTotal(): number {
    const subtotal = this.calculateSubtotal()
    return this.applyDiscount(subtotal)
  }

  // explicit small helper with a single responsibility
  calculateSubtotal(): number {
    return this.items.reduce((s, it) => s + it.price * it.quantity, 0)
  }

  // explicit helper for discount application
  applyDiscount(amount: number): number {
    return amount - amount * this.discountRate
  }

  // explicit: return only valid items
  filterValidItems() {
    return this.items.filter(i => i.quantity > 0)
  }

  // explicit: side-effect named clearly
  notifyOrderExternalSystem() {
    console.log('notifying about order')
  }
}
