import { ShoppingListGetDto } from "api/GET/DTOs";
import api from "api/api";
import TitledSection from "components/TitledSection";
import { useLoaderData } from "react-router-dom";
import formatDate from "utilities/formatDate";
import SublistTitle from "./SublistTitle";
import "./styles.less";

export async function loader({ params }: any) {
  const shoppingList = await api.get.getShoppingList(params.id);
  return shoppingList;
}

const ShoppingListPage = () => {
  const shoppingList = useLoaderData() as ShoppingListGetDto;

  return (
    <div className="page shopping-list-page">
      <h1>{shoppingList.name}</h1>

      <div className="dates-row">
        <p>{`Utworzono: ${formatDate(shoppingList.creationDate)}`}</p>
        <p>{`Zaktualizowano: ${formatDate(shoppingList.updateDate)}`}</p>
      </div>

      {shoppingList.sublists!.map(sublist => (
        <TitledSection
          key={sublist.id}
          title={
            <SublistTitle title={sublist.name} recipeId={sublist.recipeId} count={sublist.count} onDelete={() => {}} />
          }></TitledSection>
      ))}
    </div>
  );
};

export default ShoppingListPage;
