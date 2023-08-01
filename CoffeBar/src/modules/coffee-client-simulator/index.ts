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
  stays the same). They leave a 30% tip for the coffee.** 
*/

import { coffeeBarMenu } from "../../data/coffee-bar";
import { CoffeeBarEvents, Order } from "../../interfaces/coffee-bar";
import { CoffeeBar } from "../coffee-bar";
import { randomNumber } from "../utils/numbers";

export class CoffeeClientSimulator {
  coffeeBar: CoffeeBar;
  orderTimer: NodeJS.Timeout;
  orderId: number = 0;

  constructor(coffeeBar: CoffeeBar) {
    this.coffeeBar = coffeeBar;
    this.attachEventListeners();
  }

  attachEventListeners() {
    this.coffeeBar.on(CoffeeBarEvents.START, () => {
      console.log(`=== CoffeeBar opened ===`);
    });

    this.coffeeBar.on(CoffeeBarEvents.START_ORDER_PROCESS, () => {
      console.log(`Processing orders listener started`);
      this.scheduleOrders();
    });

    this.coffeeBar.on(CoffeeBarEvents.STOP_ORDER_PROCESS, () => {
      console.log(`Processing orders listener removed`);
      clearTimeout(this.orderTimer);
    });

    this.coffeeBar.on(CoffeeBarEvents.NEW_ORDER, (order: Order) => {
      console.log(
        `New ${order.isVip ? "VIP " : ""}order #${order.id}: ${
          order.beverage.title
        }`
      );
    });

    this.coffeeBar.on(CoffeeBarEvents.ORDER_PROCESSED, (order: Order) => {
      console.log(
        `${order.isVip ? "VIP " : ""}Order #${order.id} processed(${(
          order.prepTime / 1000
        ).toFixed(2)} s): ${order.beverage.title}`
      );
    });

    this.coffeeBar.on(CoffeeBarEvents.BREAK, () => {
      console.log(`=== Taking a break ===`);
      clearTimeout(this.orderTimer);
    });

    this.coffeeBar.on(CoffeeBarEvents.STOP, () => {
      console.log(
        `=== End of working day. Profit: $${this.coffeeBar.profit.toFixed(
          2
        )} ===`
      );
      clearTimeout(this.orderTimer);
    });
  }

  private sendOrder = (qty: number, isVip: boolean = false) => {
    if (qty <= 0) {
      return;
    }

    const beverage = coffeeBarMenu[randomNumber(0, coffeeBarMenu.length - 1)];
    if (isVip) beverage.price *= 1.3; // 30% tip

    const order: Order = {
      id: ++this.orderId,
      beverage,
      isVip,
      prepTime: beverage.prepTime + randomNumber(-500, 500),
    };

    this.coffeeBar.emit(CoffeeBarEvents.NEW_ORDER, order);
    this.sendOrder(qty - 1, isVip);
  };

  getQty(): number {
    return randomNumber(1, 5);
  }

  public scheduleOrders = () => {
    this.orderTimer = setTimeout(() => {
      // 10% chance for a VIP client to show up
      if (Math.random() <= 0.1) {
        this.sendOrder(this.getQty(), true);
      }

      this.sendOrder(this.getQty());
      this.scheduleOrders();
    }, randomNumber(1000, 5000)); // Random time between 1 and 5 seconds
  };
}
