import EventEmitter from 'events';
import { CoffeeBarEvents, Order } from '../../interfaces/coffee-bar';

export class CoffeeBar extends EventEmitter {
  breakDuration: number;
  profit: number;
  breakTimeAfter: number;
  endTimeAfter: number;

  constructor() {
    super();
    
    this.breakDuration = 5000;
    this.breakTimeAfter = 12000;
    this.endTimeAfter = 45000;
    this.profit = 0;
  }
  
  run(): void {
    this.start(); // open the CoffeeBar

    setTimeout(() => { // take a break after 12 sec
      this.takeBreak(this.breakDuration);
    }, this.breakTimeAfter);

    setTimeout(() => { // end of working day after 45 sec
      this.stop();
    }, this.endTimeAfter);
  }

  start(): void {
    this.emit(CoffeeBarEvents.START);
    this.processOrderListener();
  }

  stop(): void {
    this.emit(CoffeeBarEvents.STOP);
    this.stopProcessOrderListener();
  }
  
  takeBreak(duration: number): void {
    this.emit(CoffeeBarEvents.BREAK);
    this.stopProcessOrderListener();
    
    setTimeout(() => {
      this.processOrderListener();
    }, duration);
  }

  orderPrepared (order: Order) {
    this.profit += order.beverage.price;
    this.emit(CoffeeBarEvents.ORDER_PROCESSED, order);
  }

  newOrderCallback = (order: Order) => {
    setTimeout(() => {
      if(order.isVip) {
        process.nextTick(() => this.orderPrepared(order));
      } else {
        setImmediate(() => this.orderPrepared(order))
      }
    }, order.prepTime);
  };

  private processOrderListener(): void {
    this.emit(CoffeeBarEvents.START_ORDER_PROCESS);
    this.on(CoffeeBarEvents.NEW_ORDER, this.newOrderCallback);
  }

  private stopProcessOrderListener() {
    this.emit(CoffeeBarEvents.STOP_ORDER_PROCESS);
    this.removeListener(CoffeeBarEvents.NEW_ORDER, this.newOrderCallback);
  }
}