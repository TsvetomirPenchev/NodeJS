/* Coffee Bar

Create an **Event-Driven** (using the EventEmitter), asynchronous model of a coffee bar. 
On a random interval (between 1 and 5 seconds), a new client comes in and orders one or 
more coffees (1 to 5 on random). The type of the coffee is also random.  Each coffee 
takes some time to prepare and it has a price. 

- “Espresso” takes ~500ms to prepare, costs 1$
- “Cappuccino” takes ~1 second, costs 3.50$
- “Latte” takes ~1.5 seconds, costs 4.30$ 
- “Americano” takes ~700ms, costs 1.50$

Let your program work for 45 seconds. Create a **break** after 12 seconds that lasts 
for 5 seconds. No orders should be requested, accepted or processed at this interval. 
At the end of the day (45sec), your program should stop receiving new orders, but the 
existing ones should be fulfilled. Calculate the total profit for the day and print it 
before the program exits.

**Bonus requirement**: 
Throughout the day there is a small (10%)  chance for a VIP client 
to show up. Their orders should be processed with a priority (coffee preparation time
  stays the same). They leave a 30% tip for the coffee.** */

import { coffeeBarMenu } from "../../data/coffee-bar";
import { Beverage, CoffeeBarEvents } from "../../interfaces/coffee-bar";
import { CoffeeBar } from "../coffee-bar";

export class CoffeeClientSimulator {
  coffeeBar: CoffeeBar;
  orderTimer: NodeJS.Timeout;
  breakTimeAfter: number;
  endTimeAfter: number;
  breakDuration: number;

  constructor() {
    this.coffeeBar = new CoffeeBar();
    this.breakDuration = 5000;
    this.breakTimeAfter = 12000;
    this.endTimeAfter = 45000;

    this.attachEventListeners();
  }

  attachEventListeners() {
    this.coffeeBar.on(CoffeeBarEvents.START, () => {  
      console.log(`=== CoffeeBar opened for ${this.endTimeAfter/1000} sec ===`);
    });

    this.coffeeBar.on(CoffeeBarEvents.START_ORDER_PROCESS, () => {  
      console.log(`Processing orders listener started`);
      this.scheduleOrders();
    });

    this.coffeeBar.on(CoffeeBarEvents.STOP_ORDER_PROCESS, () => {  
      console.log(`Processing orders listener removed`);
      clearTimeout(this.orderTimer);
    });

    this.coffeeBar.on(CoffeeBarEvents.NEW_ORDER, (beverage: Beverage) => {  
      console.log(`New order: ${beverage.title}`)
    });

    this.coffeeBar.on(CoffeeBarEvents.ORDER_PROCESSED, (beverage: Beverage) => {  
      console.log(`Order processed: ${beverage.title}`)
    });

    this.coffeeBar.on(CoffeeBarEvents.BREAK, () => {  
      console.log(`=== Taking a break for ${this.breakDuration/1000} sec ===`);
      clearTimeout(this.orderTimer);
    });

    this.coffeeBar.on(CoffeeBarEvents.STOP, () => {  
      console.log(`=== End of working day ===`);
      clearTimeout(this.orderTimer);
    });
  }

  public run(): void {
    this.coffeeBar.start(); // open the CoffeeBar

    setTimeout(() => { // take a break after 12 sec
      this.coffeeBar.takeBreak(this.breakDuration);
    }, this.breakTimeAfter);

    setTimeout(() => { // end of working day after 45 sec
      this.coffeeBar.stop();
    }, this.endTimeAfter);
  }

  private pickBeverage = (): Beverage => {
    return coffeeBarMenu[Math.floor(Math.random() * coffeeBarMenu.length)]
  }

  public scheduleOrders = () => {
    const timeToNextOrder = Math.floor(Math.random() * 5000) + 1000; // Random time between 1 and 5 seconds

    this.orderTimer = setTimeout(() => {
      const order = this.pickBeverage();
      this.coffeeBar.emit(CoffeeBarEvents.NEW_ORDER, order);
      this.scheduleOrders();
    }, timeToNextOrder);
  }
}