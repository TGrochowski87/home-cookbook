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

  // We need to copy state to ref to be able to read it in useEffect's cleanup that will run only once on unmount.
  const shoppingListRef = useRef<ShoppingList>(shoppingList);
  // This prevents needless API calls when nothing has changed. Also blocks calling on initial unmount in development in strict mode.
  const shoppingListChanged = useRef<boolean>(false);

  const updateShoppingList: React.Dispatch<React.SetStateAction<ShoppingList>> = (
    newState: ShoppingList | ((prevState: ShoppingList) => ShoppingList)
  ) => {
    setShoppingList(newState);

    // This is better than useEffect because it actually runs only after performing some action.
    shoppingListChanged.current = true;
  };
  const handle = useShoppingListUpdateManagement(updateShoppingList);

  const saveBeforeUnmount = async () => {
    if (shoppingListChanged.current === false) {
      return;
    }
    console.log("B");

    // No error handling because no errors are expected.
    const updatedShoppingList = await api.put.updateShoppingList(
      shoppingList.id,
      mapper.map.toShoppingListUpdateDto(shoppingListRef.current)
    );
    setShoppingList(mapper.map.toShoppingList(updatedShoppingList));
  };

  useEffect(() => {
    shoppingListRef.current = shoppingList;
  }, [shoppingList]);

  // Call API immediately on unmount.
  useEffect(() => {
    return () => {
      saveBeforeUnmount();
    };
  }, []);

  // Send quick API call before page/browser closing.
  useEffect(() => {
    const saveBeforeUnloadWithBeacon = () => {
      if (shoppingListChanged.current === false || document.visibilityState !== "hidden") {
        return;
      }

      console.log("C");
      const dto = mapper.map.toShoppingListUpdateDto(shoppingList);
      const headers = {
        type: "application/json",
      };
      const blob = new Blob([JSON.stringify(dto)], headers);
      navigator.sendBeacon(`${api.baseUrl}/shopping-lists/${shoppingList.id}`, blob);
    };

    document.addEventListener("visibilitychange", saveBeforeUnloadWithBeacon);

    return () => {
      document.removeEventListener("visibilitychange", saveBeforeUnloadWithBeacon);
    };
  }, [shoppingList, shoppingListChanged]);

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
