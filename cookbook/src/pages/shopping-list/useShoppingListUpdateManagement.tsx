import QuantifiableItemData from "models/QuantifiableItemData";
import { ShoppingList, ShoppingListSublist } from "models/ShoppingList";

const sublistCountChangeStep = 0.5;

interface UpdateHandler {
  nameUpdate: (newName: string) => void;
  sublistIncrementCount: (sublist: ShoppingListSublist) => void;
  sublistDecrementCount: (sublist: ShoppingListSublist) => void;
  listItemDelete: (item: QuantifiableItemData) => void;
  checkboxClick: (sublistId: number) => (item: QuantifiableItemData) => void;
  manualSublistItemsUpdate: (items: readonly QuantifiableItemData[]) => void;
}

/**
 * This is a dedicated hook for ShoppingListPage.tsx.
 * It gathers all the logic related to tracking updates to the shopping list.
 */
const useShoppingListUpdateManagement = (
  updateShoppingList: React.Dispatch<React.SetStateAction<ShoppingList>>
): UpdateHandler => {
  const nameUpdate = (newName: string) => {
    updateShoppingList(prev => ({ ...prev, name: newName }));
  };

  const checkboxClick = (sublistId: number): ((item: QuantifiableItemData) => void) => {
    return (item: QuantifiableItemData) => {
      updateShoppingList(prev => ({
        ...prev,
        sublists: prev.sublists.map(sub =>
          sub.id === sublistId
            ? { ...sub, items: sub.items.map(i => (i.key === item.key ? { ...i, checked: !i.checked } : i)) }
            : sub
        ),
      }));
    };
  };

  const sublistIncrementCount = (sublist: ShoppingListSublist) => {
    updateShoppingList(prev => ({
      ...prev,
      sublists: prev.sublists.map(s => (s.id === sublist.id ? { ...s, count: s.count + sublistCountChangeStep } : s)),
    }));
  };

  const sublistDecrementCount = async (sublist: ShoppingListSublist) => {
    // Dropping the count to 0 means removing the sublist.
    if (sublist.count === sublistCountChangeStep) {
      updateShoppingList(prev => ({ ...prev, sublists: prev.sublists.filter(s => s.id !== sublist.id) }));
      return;
    }

    updateShoppingList(prev => ({
      ...prev,
      sublists: prev.sublists.map(s => (s.id === sublist.id ? { ...s, count: s.count - sublistCountChangeStep } : s)),
    }));
  };

  const listItemDelete = (item: QuantifiableItemData): void => {
    updateShoppingList(prev => ({
      ...prev,
      sublists: prev.sublists.map(sub =>
        sub.recipeId === null ? { ...sub, items: sub.items.filter(i => i.key !== item.key) } : sub
      ),
    }));
  };

  const manualSublistItemsUpdate = (items: readonly QuantifiableItemData[]): void => {
    updateShoppingList(prev => ({
      ...prev,
      sublists: prev.sublists.map(sub => (sub.recipeId === null ? { ...sub, items } : sub)),
    }));
  };

  return {
    nameUpdate,
    sublistIncrementCount,
    sublistDecrementCount,
    listItemDelete,
    checkboxClick,
    manualSublistItemsUpdate,
  };
};

export default useShoppingListUpdateManagement;
