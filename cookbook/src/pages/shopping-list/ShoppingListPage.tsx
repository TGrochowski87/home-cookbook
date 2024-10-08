import { ShoppingListDetailsGetDto } from "api/GET/DTOs";
import api from "api/api";
import TitledSection from "components/TitledSection";
import { useLoaderData } from "react-router-dom";
import SublistTitle from "./SublistTitle";
import QuantifiableItemsList from "components/quantifiable-items-list/QuantifiableItemsList";
import { useEffect, useRef, useState } from "react";
import EditableQuantifiableItemsList from "components/quantifiable-items-list/EditableQuantifiableItemsList";
import { ShoppingList, ShoppingListSublist } from "models/ShoppingList";
import mapper from "mapper";
import InfoModal from "./InfoModal";
import useShoppingListUpdateManagement from "./useShoppingListUpdateManagement";
import "./styles.less";

export async function loader({ params }: any) {
  const shoppingList = await api.get.getShoppingList(params.id);
  return shoppingList;
}

const ShoppingListPage = () => {
  const shoppingListFromLoader = useLoaderData() as ShoppingListDetailsGetDto;
  const [shoppingList, setShoppingList] = useState<ShoppingList>(mapper.map.toShoppingList(shoppingListFromLoader));

  const updateShoppingList: React.Dispatch<React.SetStateAction<ShoppingList>> = (
    newState: ShoppingList | ((prevState: ShoppingList) => ShoppingList)
  ) => {
    setShoppingList(newState);

    if (apiCallTimeoutId.current === undefined) {
      apiCallTimeoutId.current = setTimeout(async () => await saveBeforeUnmount(), 5000);
    }
  };

  const handle = useShoppingListUpdateManagement(updateShoppingList);

  // Fields related to delayed saving.
  const apiCallTimeoutId = useRef<number>();

  const saveBeforeUnmount = async () => {
    // No error handling because no errors are expected.
    const updatedShoppingList = await api.put.updateShoppingList(
      shoppingList.id,
      mapper.map.toShoppingListUpdateDto(shoppingList)
    );
    setShoppingList(mapper.map.toShoppingList(updatedShoppingList));
    apiCallTimeoutId.current = undefined;
  };

  // Call API immediately on unmount.
  useEffect(() => {
    return () => {
      saveBeforeUnmount();
    };
  }, []);

  // Send quick API call before page/browser closing.
  useEffect(() => {
    const saveBeforeUnloadWithBeacon = () => {
      if (apiCallTimeoutId.current === undefined) {
        return;
      }

      const dto = mapper.map.toShoppingListUpdateDto(shoppingList);
      navigator.sendBeacon(`/api/shopping-lists/${shoppingList.id}`, JSON.stringify(dto));
    };

    window.addEventListener("beforeunload", saveBeforeUnloadWithBeacon);

    return () => {
      window.removeEventListener("beforeunload", saveBeforeUnloadWithBeacon);
    };
  }, [shoppingList]);

  const manualSublist: ShoppingListSublist = shoppingList.sublists.find(s => s.recipeId === null)!;

  return (
    <div className="page shopping-list-page">
      <span className="header">
        <h1>{shoppingList.name}</h1>
        <InfoModal shoppingListInfo={shoppingList} renameHandler={handle.nameUpdate} />
      </span>

      {shoppingList.sublists
        .filter(sublist => sublist.recipeId)
        .map(sublist => (
          <TitledSection
            key={sublist.id}
            title={
              <SublistTitle
                sublist={sublist}
                onIncrement={handle.sublistIncrementCount}
                onDecrement={handle.sublistDecrementCount}
              />
            }>
            <QuantifiableItemsList
              items={sublist.items}
              rightSideAction={{ type: "check", callback: handle.checkboxClick(sublist.id) }}
            />
          </TitledSection>
        ))}

      <TitledSection title={"Manualnie dodane"}>
        <EditableQuantifiableItemsList
          items={manualSublist.items}
          setItems={items => handle.manualSublistItemsUpdate(items)}
          leftSideAction={{ type: "remove", callback: handle.listItemDelete }}
          rightSideAction={{ type: "check", callback: handle.checkboxClick(manualSublist.id) }}
        />
      </TitledSection>
    </div>
  );
};

export default ShoppingListPage;
