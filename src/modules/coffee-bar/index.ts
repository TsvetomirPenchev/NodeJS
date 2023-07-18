import EventEmitter from 'events';
import { Beverage, CoffeeBarEvents } from '../../interfaces/coffee-bar';

export class CoffeeBar extends EventEmitter {
  private breakDuration: number;
  private breakStartAfter: number;
  private endTimeAfter: number;
  private profit: number;
  
  constructor() {
    super();
    this.breakDuration = 5000;
    this.breakStartAfter = 12000;
    this.endTimeAfter = 45000;
    this.profit = 0;
  }

  public start(): void {
    this.processOrders();
    
    setTimeout(() => {
      this.takeBreak(); // take a break
    }, this.breakStartAfter);

    setTimeout(() => {
      this.stopProcessingOrders(); // end of working day
    }, this.endTimeAfter);
  }

  private getPrepTime(prepTime: number): number {
    const deferTime = Math.ceil(Math.random() * 1000);
    return prepTime + deferTime;
  }

  private processOrders(): void {
    this.on(CoffeeBarEvents.NEW_ORDER, (beverage: Beverage) => {
      console.log(`New order: ${beverage.title}`);
  
      setTimeout(() => {
        // TODO: add execution time
        console.log(`Order processed: ${beverage.title}`);
        this.profit += beverage.price;
        this.emit(CoffeeBarEvents.ORDER_PROCESSED);
      }, this.getPrepTime(beverage.prepTimeMs));
    });
  }

  private stopProcessingOrders() {
    this.removeAllListeners(CoffeeBarEvents.NEW_ORDER);
  }
  
  public takeBreak(): void {
    console.log(`Taking a break for ${this.breakDuration}ms`);

    this.emit(CoffeeBarEvents.BREAK);
    this.stopProcessingOrders();
    
    setTimeout(() => {
      this.processOrders();
    }, this.breakDuration);
  }
}