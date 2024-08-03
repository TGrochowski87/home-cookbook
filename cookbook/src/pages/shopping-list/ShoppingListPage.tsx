import { ShoppingListGetDto } from "api/GET/DTOs";
import api from "api/api";
import TitledSection from "components/TitledSection";
import { useLoaderData } from "react-router-dom";
import SublistTitle from "./SublistTitle";
import QuantifiableItemsList from "components/quantifiable-items-list/QuantifiableItemsList";
import QuantifiableItemData from "models/QuantifiableItemData";
import { useState } from "react";
import EditableQuantifiableItemsList from "components/quantifiable-items-list/EditableQuantifiableItemsList";
import { ShoppingList, ShoppingListSublist } from "models/ShoppingList";
import mapper from "mapper";
import InfoModal from "./InfoModal";
import "./styles.less";

export async function loader({ params }: any) {
  const shoppingList = await api.get.getShoppingList(params.id);
  return shoppingList;
}

const prepareShoppingList = (shoppingListDto: ShoppingListGetDto): ShoppingList => {
  const shoppingList: ShoppingList = mapper.map.toShoppingList(shoppingListDto);
  const sortedShoppingList: ShoppingList = {
    ...shoppingList,
    sublists: shoppingList.sublists!.toSorted((a, b) => a.id - b.id),
  };
  return sortedShoppingList;
};

const ShoppingListPage = () => {
  const shoppingListFromLoader = useLoaderData() as ShoppingListGetDto;
  const [shoppingList, setShoppingList] = useState<ShoppingList>(prepareShoppingList(shoppingListFromLoader));

  const checkboxClickHandler = (sublistId: number): ((item: QuantifiableItemData) => void) => {
    return (item: QuantifiableItemData) => {
      setShoppingList(prev => ({
        ...prev,
        sublists: prev.sublists!.map(sub =>
          sub.id === sublistId
            ? { ...sub, items: sub.items.map(i => (i.key === item.key ? { ...i, checked: !i.checked } : i)) }
            : sub
        ),
      }));
    };
  };

  // Currently there can only be one manual sublist
  const removeItemHandler = (item: QuantifiableItemData): void => {
    setShoppingList(prev => ({
      ...prev,
      sublists: prev.sublists!.map(sub =>
        sub.id === 1 ? { ...sub, items: sub.items.filter(i => i.key !== item.key) } : sub
      ),
    }));
  };

  const setManualSublistItems = (items: readonly QuantifiableItemData[]): void => {
    setShoppingList(prev => ({
      ...prev,
      sublists: prev.sublists!.map(sub => (sub.id === 1 ? { ...sub, items } : sub)),
    }));
  };

  const manualSublist: ShoppingListSublist = shoppingList.sublists!.find(s => s.id === 1)!;

  return (
    <div className="page shopping-list-page">
      <span className="header">
        <h1>{shoppingList.name}</h1>
        <InfoModal shoppingListInfo={shoppingList} renameHandler={name => setShoppingList({ ...shoppingList, name })} />
      </span>

      {shoppingList
        .sublists!.filter(sublist => sublist.recipeId)
        .map(sublist => (
          <TitledSection
            key={sublist.id}
            title={
              <SublistTitle
                title={sublist.name}
                recipeId={sublist.recipeId}
                count={sublist.count}
                // TODO: implement onIncrement and onDecrement
                onIncrement={() => {}}
                onDecrement={() => {}}
              />
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

export default ShoppingListPage;
