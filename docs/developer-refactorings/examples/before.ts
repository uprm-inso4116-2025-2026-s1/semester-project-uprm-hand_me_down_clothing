export type Item = { id: string, price: number, quantity: number }

export class OrderWorker {
  items: Item[]
  discount: number

  constructor(items: Item[], discount = 0) {
    this.items = items
    this.discount = discount
  }

  // vague: process what?
  process() {
    let total = 0
    for (const it of this.items) {
      total += it.price * it.quantity
    }
    total = total - (total * this.discount)
    return total
  }

  // vague: handle what?
  handle() {
    return this.items.filter(i => i.quantity > 0)
  }

  // vague: doTask
  doTask() {
    // pretend this notifies an external system
    console.log('notifying about order')
  }
}
