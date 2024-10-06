export interface ShoppingListUpdateDto {
  readonly name?: string;
  readonly sublists?: readonly ShoppingSublistUpdateDto[];
}

export interface ShoppingSublistUpdateDto {
  readonly id: number;
  readonly state?: {
    readonly count?: number;
    readonly items?: readonly ListItemUpdateDto[];
  };
}

export interface ListItemUpdateDto {
  readonly id?: number;
  readonly state?: {
    readonly name?: string;
    readonly amount?: {
      readonly value: string;
      readonly unit?: string;
    };
    readonly checked?: boolean;
  };
}
