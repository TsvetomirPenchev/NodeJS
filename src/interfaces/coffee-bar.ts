export interface Beverage {
  title: string;
  price: number;
  prepTime: number;
}

export enum CoffeeBarEvents {
  START = 'start',
  STOP = 'stop',
  BREAK = 'takeABreak',
  END_DAY = 'endOfDay',
  NEW_ORDER = 'newOrder',
  ORDER_PROCESSED = 'orderProcessed',
  START_ORDER_PROCESS = 'startProcessingOrders',
  STOP_ORDER_PROCESS = 'stopProcessingOrders',
}