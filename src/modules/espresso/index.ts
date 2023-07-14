import { Beverage } from "src/interfaces/beverage.interface";

export class Espresso implements Beverage {
  name: 'Espresso';
  price: 1;
  prepTimeMs: 500;
} 