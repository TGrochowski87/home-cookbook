import { Amount } from "api/GET/DTOs";

interface QuantifiableItemData {
  readonly key: string | number;
  readonly name: string;
  readonly amount: Amount;
  readonly checked: boolean;
}

export default QuantifiableItemData;
