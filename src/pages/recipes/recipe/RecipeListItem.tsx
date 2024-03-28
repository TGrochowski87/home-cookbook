import BaseBlock from "components/BaseBlock";
import BurgerPlaceHolder from "assets/burger-placeholder.jpg";
import "./styles.less";
import TagList from "../search/TagList";

interface RecipeListItemProps {}

const RecipeListItem = ({}: RecipeListItemProps) => {
  return (
    <article>
      <BaseBlock className="recipe-list-item">
        <img src={BurgerPlaceHolder} />
        <h3>Burger jakiśtam</h3>
        <TagList />
      </BaseBlock>
    </article>
  );
};

export default RecipeListItem;
