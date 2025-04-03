import { Amount } from "api/common-DTOs";

interface Ingredient {
  readonly key: string | number;
  readonly name: string;
  readonly amount: Amount;
}

export default Ingredient;
