import { ShoppingListDetailsGetDto } from "api/GET/DTOs";
import api from "api/api";
import TitledSection from "components/TitledSection";
import { useParams } from "react-router-dom";
import SublistTitle from "./SublistTitle";
import QuantifiableItemsList from "components/quantifiable-items-list/QuantifiableItemsList";
import { useEffect, useRef, useState } from "react";
import EditableQuantifiableItemsList from "components/quantifiable-items-list/EditableQuantifiableItemsList";
import { ShoppingList, ShoppingListSublist } from "models/ShoppingList";
import mapper from "mapper";
import InfoModal from "./InfoModal";
import useShoppingListUpdateManagement from "./useShoppingListUpdateManagement";
import "./styles.less";
import axios from "axios";
import { useAlerts } from "components/alert/AlertStack";
import HomeButton from "components/buttons/HomeButton";
import { useAppDispatch, useAppSelector } from "storage/redux/hooks";
import store from "storage/redux/store";
import storeActions from "storage/redux/actions";

export async function loader(args: unknown): Promise<null> {
  const { params } = args as { params: { id: string } };

  // If this page is opened directly, i.e. not from shopping page, just get all shopping lists now to simplify the process.
  await store.dispatch(storeActions.shoppingLists.async.fetchShoppingLists()).unwrap();
  await store.dispatch(storeActions.shoppingLists.async.fetchShoppingListDetails(+params.id)).unwrap();
  return null;
}

const ShoppingListPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { shoppingLists: shoppingListsFromCache } = useAppSelector(state => state.shoppingLists);
  const shoppingListFromCache = shoppingListsFromCache.find(sl => sl.id === +id!) as ShoppingListDetailsGetDto;
  const [shoppingList, setShoppingList] = useState<ShoppingList>(mapper.map.toShoppingList(shoppingListFromCache));

  // We need to copy state to ref to be able to read it in useEffect's cleanup that will run only once on unmount.
  const shoppingListRef = useRef<ShoppingList>(shoppingList);
  // This prevents needless API calls when nothing has changed. Also blocks calling on initial unmount in development in strict mode.
  const shoppingListChanged = useRef<boolean>(false);
  const { displayMessage } = useAlerts();

  const updateShoppingListState: React.Dispatch<React.SetStateAction<ShoppingList>> = (
    newState: ShoppingList | ((prevState: ShoppingList) => ShoppingList)
  ) => {
    setShoppingList(newState);

    // This is better than useEffect because it actually runs only after performing some action.
    shoppingListChanged.current = true;
  };
  const handle = useShoppingListUpdateManagement(updateShoppingListState);

  useEffect(() => {
    shoppingListRef.current = shoppingList;
  }, [shoppingList]);

  // Call API immediately on unmount.
  useEffect(() => {
    const saveBeforeUnmount = async () => {
      if (shoppingListChanged.current === false) {
        return;
      }

      try {
        const updatedShoppingList = await api.put.updateShoppingList(
          shoppingList.id,
          shoppingList.updateDate,
          mapper.map.toShoppingListUpdateDto(shoppingListRef.current)
        );
        setShoppingList(mapper.map.toShoppingList(updatedShoppingList));
        dispatch(storeActions.shoppingLists.updateCachedShoppingList(updatedShoppingList));
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 412) {
          displayMessage({
            type: "error",
            message: "The changes could not be saved.\nThe list has been modified in the meantime.",
            fadeOutAfter: 5000,
          });
        } else {
          throw error;
        }
      }
    };

    return () => {
      saveBeforeUnmount();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Send quick API call before page/browser closes.
  useEffect(() => {
    const saveBeforeUnloadWithBeacon = async () => {
      if (shoppingListChanged.current === false || document.visibilityState !== "hidden") {
        return;
      }

      const updatedShoppingList = await api.put.updateShoppingListWithFetch(
        shoppingList.id,
        shoppingList.updateDate,
        mapper.map.toShoppingListUpdateDto(shoppingList)
      );

      // If the website has not been closed, update the store.
      dispatch(storeActions.shoppingLists.updateCachedShoppingList(updatedShoppingList));
    };

    // Check for visibilitychange instead of onbeforeunload as per MDN recommendation.
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon
    document.addEventListener("visibilitychange", saveBeforeUnloadWithBeacon);

    return () => {
      document.removeEventListener("visibilitychange", saveBeforeUnloadWithBeacon);
    };
  }, [shoppingList, shoppingListChanged, dispatch]);

  const manualSublist: ShoppingListSublist = shoppingList.sublists.find(s => s.recipeId === null)!;

  return (
    <div className="page shopping-list-page">
      <HomeButton homeTab="shopping-lists" />

      <header>
        <h1>{shoppingList.name}</h1>
        <InfoModal
          shoppingListInfo={shoppingList}
          renameHandler={handle.nameUpdate}
          autoDeleteToggleHandler={handle.autoDeleteToggle}
        />
      </header>

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

      <TitledSection title={"Manual sublist"}>
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
