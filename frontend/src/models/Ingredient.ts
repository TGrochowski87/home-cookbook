import { Amount } from "api/GET/DTOs";

interface Ingredient {
  readonly key: string | number;
  readonly name: string;
  readonly amount: Amount;
}

export default Ingredient;
