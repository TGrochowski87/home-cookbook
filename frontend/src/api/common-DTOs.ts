export type QuantifiableItemGetDto = {
  readonly id: number;
  readonly name: string;
  readonly amount: Amount;
  readonly checked: boolean;
};

export interface Amount {
  readonly value: string | null;
  readonly unit: string | null;
}
