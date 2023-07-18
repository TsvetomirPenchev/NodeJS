export interface Beverage {
  title: string;
  price: number;
  prepTimeMs: number;
}

export enum CoffeeBarEvents {
  BREAK = 'coffeeBar.takeABreak',
  END_DAY = 'coffeeBar.endOfDay',
  NEW_ORDER = 'coffeeBar.newOrder',
  ORDER_PROCESSED = 'coffeeBar.orderProcessed',
}