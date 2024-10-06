import { ShoppingListDetailsGetDto } from "api/GET/DTOs";
import api from "api/api";
import TitledSection from "components/TitledSection";
import { useLoaderData } from "react-router-dom";
import SublistTitle from "./SublistTitle";
import QuantifiableItemsList from "components/quantifiable-items-list/QuantifiableItemsList";
import { useState } from "react";
import EditableQuantifiableItemsList from "components/quantifiable-items-list/EditableQuantifiableItemsList";
import { ShoppingList, ShoppingListSublist } from "models/ShoppingList";
import mapper from "mapper";
import InfoModal from "./InfoModal";
import "./styles.less";
import { ShoppingListUpdateDto, ShoppingSublistUpdateDto } from "api/PATCH/DTOs";

export async function loader({ params }: any) {
  const shoppingList = await api.get.getShoppingList(params.id);
  return shoppingList;
}

const sublistCountChangeStep = 0.5;

const ShoppingListPage = () => {
  const shoppingListFromLoader = useLoaderData() as ShoppingListDetailsGetDto;
  const [shoppingList, setShoppingList] = useState<ShoppingList>(prepareShoppingList(shoppingListFromLoader));
  // This array is not nullable for code simplicity. It gets dropped before the API call if empty.
  const [updateObject, setUpdateObject] = useState<WithRequired<ShoppingListUpdateDto, "sublists">>({ sublists: [] });

  const handleNameUpdate = (newName: string) => {
    setUpdateObject(prev => ({ ...prev, name: shoppingList.name != newName ? newName : undefined }));
  };

  const handleSublistIncrementCount = (sublistId: number) => {
    const currentSublistUpdate = updateObject.sublists.find(sl => sl.id === sublistId);
    const currentSublistCountUpdate = currentSublistUpdate?.state?.count;
    const currentCount = shoppingList.sublists.find(sl => sl.id === sublistId)!.count;

    switch (true) {
      case currentSublistCountUpdate !== undefined &&
        currentSublistCountUpdate + sublistCountChangeStep == currentCount: {
        // If the update matches the current DB state, there is nothing to update.
        setUpdateObject(prev => ({
          ...prev,
          sublists: prev.sublists.filter(sl => sl.id != sublistId),
        }));

        break;
      }
      case currentSublistCountUpdate !== undefined: {
        setUpdateObject(prev => ({
          ...prev,
          sublists: prev.sublists.map(sl =>
            sl.id === sublistId
              ? { ...sl, state: { ...sl.state, count: currentSublistCountUpdate + sublistCountChangeStep } }
              : sl
          ),
        }));

        break;
      }
      case currentSublistUpdate !== undefined: {
        setUpdateObject(prev => ({
          ...prev,
          sublists: prev.sublists.map(sl =>
            sl.id === sublistId ? { ...sl, state: { ...sl.state, count: currentCount + sublistCountChangeStep } } : sl
          ),
        }));

        break;
      }
      default: {
        var newSublistUpdate: ShoppingSublistUpdateDto = {
          id: sublistId,
          state: {
            count: currentCount + sublistCountChangeStep,
          },
        };
        setUpdateObject(prev => ({ ...prev, sublists: [...prev.sublists, newSublistUpdate] }));
      }
    }
  };

  const manualSublist: ShoppingListSublist = shoppingList.sublists.find(s => s.recipeId === null)!;

  return (
    <div className="page shopping-list-page">
      <span className="header">
        <h1>{shoppingList.name}</h1>
        <InfoModal shoppingListInfo={shoppingList} renameHandler={handleNameUpdate} />
      </span>

      {shoppingList.sublists
        .filter(sublist => sublist.recipeId)
        .map(sublist => (
          <TitledSection
            key={sublist.id}
            title={
              <SublistTitle sublist={sublist} onIncrement={onIncrementHandler} onDecrement={onDecrementHandler} />
            }>
            <QuantifiableItemsList
              items={sublist.items}
              rightSideAction={{ type: "check", callback: checkboxClickHandler(sublist.id) }}
            />
          </TitledSection>
        ))}

      <TitledSection title={"Manualnie dodane"}>
        <EditableQuantifiableItemsList
          items={manualSublist.items}
          setItems={items => setManualSublistItems(items)}
          leftSideAction={{ type: "remove", callback: removeItemHandler }}
          rightSideAction={{ type: "check", callback: checkboxClickHandler(manualSublist.id) }}
        />
      </TitledSection>
    </div>
  );
};

const prepareShoppingList = (shoppingListDto: ShoppingListDetailsGetDto): ShoppingList => {
  const shoppingList: ShoppingList = mapper.map.toShoppingList(shoppingListDto);
  const sortedShoppingList: ShoppingList = {
    ...shoppingList,
    sublists: shoppingList.sublists.toSorted((a, b) => a.id - b.id),
  };
  return sortedShoppingList;
};

export default ShoppingListPage;

// const checkboxClickHandler = (sublistId: number): ((item: QuantifiableItemData) => void) => {
//   return (item: QuantifiableItemData) => {
//     setShoppingList(prev => ({
//       ...prev,
//       sublists: prev.sublists!.map(sub =>
//         sub.id === sublistId
//           ? { ...sub, items: sub.items.map(i => (i.key === item.key ? { ...i, checked: !i.checked } : i)) }
//           : sub
//       ),
//     }));
//   };
// };

// // Currently there can only be one manual sublist
// const removeItemHandler = (item: QuantifiableItemData): void => {
//   setShoppingList(prev => ({
//     ...prev,
//     sublists: prev.sublists!.map(sub =>
//       sub.recipeId === null ? { ...sub, items: sub.items.filter(i => i.key !== item.key) } : sub
//     ),
//   }));
// };

// const onIncrementHandler = async (sublist: ShoppingListSublist) => {
//   await api.patch.updateShoppingSublistCount(sublist.id, sublist.count + 0.5);
//   const updatedShoppingList = await api.get.getShoppingList(shoppingList.id);
//   setShoppingList(prepareShoppingList(updatedShoppingList));
// };

// const onDecrementHandler = async (sublist: ShoppingListSublist) => {
//   if (sublist.count === 0.5) {
//     await api.delete.deleteShoppingListSublist(sublist.id);
//   } else {
//     await api.patch.updateShoppingSublistCount(sublist.id, sublist.count - 0.5);
//   }

//   const updatedShoppingList = await api.get.getShoppingList(shoppingList.id);
//   setShoppingList(prepareShoppingList(updatedShoppingList));
// };

// const setManualSublistItems = (items: readonly QuantifiableItemData[]): void => {
//   setShoppingList(prev => ({
//     ...prev,
//     sublists: prev.sublists!.map(sub => (sub.recipeId === null ? { ...sub, items } : sub)),
//   }));
// };
