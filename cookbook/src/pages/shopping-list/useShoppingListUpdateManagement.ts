import { ShoppingListUpdateDto, ShoppingSublistUpdateDto } from "api/PATCH/DTOs";
import { ShoppingList } from "models/ShoppingList";
import { useState } from "react";

const sublistCountChangeStep = 0.5;

interface UpdateHandler {
  nameUpdate: (newName: string) => void;
  sublistIncrementCount: (sublistId: number) => void;
  sublistDecrementCount: (sublistId: number) => void;
  removeSublist: (sublistId: number) => void;
}

/**
 * This is a dedicated hook for ShoppingListPage.tsx.
 * It gathers all the logic related to tracking updates to the shopping list.
 */
const useShoppingListUpdateManagement = (shoppingList: ShoppingList): UpdateHandler => {
  // This array is not nullable for code simplicity. It gets dropped before the API call if empty.
  const [updateObject, setUpdateObject] = useState<WithRequired<ShoppingListUpdateDto, "sublists">>({ sublists: [] });

  const nameUpdate = (newName: string) => {
    setUpdateObject(prev => ({ ...prev, name: shoppingList.name != newName ? newName : undefined }));
  };

  const checkboxClick = (listItemKey: string | number) => {
    const sublistWithItem = shoppingList.sublists.find(sublist =>
      sublist.items.find(item => item.key === listItemKey)
    )!;

    if (sublistWithItem.recipeId) {
      const itemIsOnListOfUpdates = updateObject.sublists
        .find(sublist => sublist.id === sublistWithItem.id)
        ?.state?.items?.find(item => item.id === listItemKey);

      if (itemIsOnListOfUpdates) {
        setUpdateObject(prev => ({
          ...prev,
          sublists: prev.sublists.map(sl =>
            sl.id === sublistWithItem.id
              ? { ...sl, state: { ...sl.state, items: sl.state!.items!.filter(i => i.id !== listItemKey) } }
              : sl
          ),
        }));

        return;
      }

      setUpdateObject(prev => ({
        ...prev,
        sublists: prev.sublists.map(sl =>
          sl.id === sublistWithItem.id
            ? {
                ...sl,
                state: {
                  ...sl.state,
                  items: [...sl.state!.items!, { id: listItemKey as number, state: { checked: true } }],
                },
              }
            : sl
        ),
      }));

      return;
    }

    const itemIsOnListOfUpdates = updateObject.sublists
      .find(sublist => sublist.id === sublistWithItem.id)
      ?.state?.items?.find(item => item.state?.name === listItemKey);

    if (itemIsOnListOfUpdates) {
      setUpdateObject(prev => ({
        ...prev,
        sublists: prev.sublists.map(sl =>
          sl.id === sublistWithItem.id
            ? { ...sl, state: { ...sl.state, items: sl.state!.items!.filter(i => i.id !== listItemKey) } }
            : sl
        ),
      }));

      return;
    }
  };

  const removeSublist = (sublistId: number) => {
    const listOfSublistUpdates: ShoppingSublistUpdateDto[] = [];

    // Adjust the already existent update to the sublist.
    let previousUpdateAdjusted = false;
    for (const sublistUpdate of updateObject.sublists) {
      if (sublistUpdate.id === sublistId) {
        listOfSublistUpdates.push({ id: sublistId, state: undefined });
        previousUpdateAdjusted = true;
        continue;
      }

      listOfSublistUpdates.push(sublistUpdate);
    }

    // If there was no previous update, add one.
    if (previousUpdateAdjusted === false) {
      listOfSublistUpdates.push({ id: sublistId, state: undefined });
    }

    setUpdateObject(prev => ({ ...prev, sublists: listOfSublistUpdates }));
  };

  const sublistDecrementCount = (sublistId: number) => changeSublistCount(sublistId, "decrement");
  const sublistIncrementCount = (sublistId: number) => changeSublistCount(sublistId, "increment");

  const changeSublistCount = (sublistId: number, direction: "increment" | "decrement") => {
    const currentSublistUpdate = updateObject.sublists.find(sl => sl.id === sublistId);
    const currentSublistCountUpdate = currentSublistUpdate?.state?.count;
    const currentCount = shoppingList.sublists.find(sl => sl.id === sublistId)!.count;

    switch (true) {
      // The count was already changed by this change made it equal to the DB state.
      case currentSublistCountUpdate !== undefined &&
        ((direction === "increment" && currentSublistCountUpdate + sublistCountChangeStep == currentCount) ||
          (direction === "decrement" && currentSublistCountUpdate - sublistCountChangeStep == currentCount)): {
        // If the update matches the current DB state, there is nothing to update.
        setUpdateObject(prev => ({
          ...prev,
          sublists: prev.sublists.filter(sl => sl.id != sublistId),
        }));

        break;
      }
      // The count was already changed.
      case currentSublistCountUpdate !== undefined: {
        const newCount =
          direction === "increment"
            ? currentSublistCountUpdate + sublistCountChangeStep
            : currentSublistCountUpdate - sublistCountChangeStep;
        setUpdateObject(prev => ({
          ...prev,
          sublists: prev.sublists.map(sl =>
            sl.id === sublistId ? { ...sl, state: { ...sl.state, count: newCount } } : sl
          ),
        }));

        break;
      }
      // The sublist's state was already changed, but not its count.
      case currentSublistUpdate !== undefined: {
        const newCount =
          direction === "increment" ? currentCount + sublistCountChangeStep : currentCount - sublistCountChangeStep;

        setUpdateObject(prev => ({
          ...prev,
          sublists: prev.sublists.map(sl =>
            sl.id === sublistId ? { ...sl, state: { ...sl.state, count: newCount } } : sl
          ),
        }));

        break;
      }
      // This is a first change to the sublist.
      default: {
        const newCount =
          direction === "increment" ? currentCount + sublistCountChangeStep : currentCount - sublistCountChangeStep;

        const newSublistUpdate: ShoppingSublistUpdateDto = {
          id: sublistId,
          state: {
            count: newCount,
          },
        };
        setUpdateObject(prev => ({ ...prev, sublists: [...prev.sublists, newSublistUpdate] }));
      }
    }
  };

  return {
    nameUpdate,
    sublistIncrementCount,
    sublistDecrementCount,
    removeSublist,
  };
};

export default useShoppingListUpdateManagement;
