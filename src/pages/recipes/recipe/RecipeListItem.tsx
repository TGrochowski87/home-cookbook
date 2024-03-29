import BaseBlock from "components/BaseBlock";
import BurgerPlaceHolder from "assets/burger-placeholder.jpg";
import TagChip from "components/chips/TagChip";
import "./styles.less";
import CategoryIndicator from "./CategoryIndicator";

interface RecipeListItemProps {}

const RecipeListItem = ({}: RecipeListItemProps) => {
  return (
    <article>
      <BaseBlock className="recipe-list-item">
        <img src={BurgerPlaceHolder} />
        <h1>Burger jakiśtam</h1>
        <p>Ten przepis jest super, serio!</p>
        <div className="tag-list-info">
          <TagChip disableShadow name="dfgdf" />
          <TagChip disableShadow name="sdgdsfgsdg" />
          <TagChip disableShadow name=" sadf sda" />
          <TagChip disableShadow name="sfsadfasg" />
          <TagChip disableShadow name="sdf" />
          <TagChip disableShadow name="gas asd" />
          <TagChip disableShadow name="asdfsdf" />
          <TagChip disableShadow name="sdfsadfsa " />
          <TagChip disableShadow name="sdfsa" />
          <TagChip disableShadow name="sdf" />
        </div>
        <CategoryIndicator categoryColor="purple" categoryName="Kategoria :DDD" />
      </BaseBlock>
    </article>
  );
};

export default RecipeListItem;
