import { Amount } from "api/GET/DTOs";

interface QuantifiableItemData {
  /**
   * This differs from IngredientGetDto by this union with 'string' type because
   * it must work also for newly created items that do not have an ID.
   */
  readonly key: string | number;
  readonly name: string;
  readonly amount: Amount;
  readonly checked: boolean;
}

export default QuantifiableItemData;
