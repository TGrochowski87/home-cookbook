import { ShoppingListGetDto } from "api/GET/DTOs";
import { useNavigate } from "react-router-dom";
import formatDate from "utilities/formatDate";

interface ShoppingListProps {
  readonly listData: ShoppingListGetDto;
}

const ShoppingList = ({ listData }: ShoppingListProps) => {
  const navigate = useNavigate();

  return (
    <article
      className="shopping-list block floating interactive-element"
      onClick={() => navigate(`/shopping-lists/${listData.id}`)}>
      <h2>{listData.name}</h2>
      <div className="dates-row">
        <p>{`Utworzono: ${formatDate(listData.creationDate)}`}</p>
        <p>{`Zaktualizowano: ${formatDate(listData.updateDate)}`}</p>
      </div>
    </article>
  );
};

export default ShoppingList;
