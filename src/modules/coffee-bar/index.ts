import EventEmitter from 'events';
import { Beverage, CoffeeBarEvents } from '../../interfaces/coffee-bar';

export class CoffeeBar extends EventEmitter {
  breakDuration: number;
  profit: number;
  
  constructor() {
    super();
    this.profit = 0;
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

  private getPrepTime(prepTime: number): number {
    const deferTime = Math.ceil(Math.random() * 1000);
    return prepTime + deferTime;
  }

  newOrderCallback = (beverage: Beverage) => {        
    setTimeout(() => {
      this.profit += beverage.price;
      this.emit(CoffeeBarEvents.ORDER_PROCESSED, beverage);
    }, this.getPrepTime(beverage.prepTime));
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