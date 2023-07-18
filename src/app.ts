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

import { CoffeeBarMenu } from "./data/coffee-bar";
import { Beverage, CoffeeBarEvents } from "./interfaces/coffee-bar";
import { CoffeeBar } from "./modules/coffee-bar";


const coffeeBar = new CoffeeBar();

const pickBeverage = (): Beverage => {
  return CoffeeBarMenu[Math.floor(Math.random() * CoffeeBarMenu.length)]
}

const scheduleOrder = () => {
  const timeToNextOrder = Math.floor(Math.random() * 5000) + 1000; // Random time between 1 and 5 seconds
  setTimeout(() => {
    const order = pickBeverage()
    coffeeBar.emit(CoffeeBarEvents.NEW_ORDER, order);
    scheduleOrder();
  }, timeToNextOrder);
}

coffeeBar.start();
scheduleOrder();

// coffeeBar.on('endOfDay', (profit) => {
//   console.log(`Total profit for the day: $${profit.toFixed(2)}`);
// });
