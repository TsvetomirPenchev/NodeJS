import { CoffeeBar } from "./modules/coffee-bar";
import { CoffeeClientSimulator } from "./modules/coffee-client-simulator";

const coffeeBar = new CoffeeBar();
new CoffeeClientSimulator(coffeeBar);
coffeeBar.run();
