import { ShoppingListGetDto } from "api/GET/DTOs";
import { TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { calculateTimeUntilDeletion, OneWeekInMilliseconds } from "utilities/shoppingListUtilities";

interface ShoppingListProps {
  readonly listData: ShoppingListGetDto;
}

const ShoppingList = ({ listData }: ShoppingListProps) => {
  const navigate = useNavigate();

  const soonToBeDeleted: boolean = calculateTimeUntilDeletion(listData.creationDate) < OneWeekInMilliseconds;

  return (
    <article
      className={`shopping-list block floating interactive-element ${listData.autoDelete ? "" : "persistent"}`}
      onClick={() => navigate(`/shopping-lists/${listData.id}`)}>
      {listData.autoDelete && soonToBeDeleted && <TriangleAlert />}
      <h2>{listData.name}</h2>
      <div className="dates-row">
        <p>{`Utworzono: ${new Date(listData.creationDate).toLocaleDateString("pl-PL")}`}</p>
        <p>{`Zaktualizowano: ${new Date(listData.updateDate).toLocaleDateString("pl-PL")}`}</p>
      </div>
    </article>
  );
};

export default ShoppingList;
