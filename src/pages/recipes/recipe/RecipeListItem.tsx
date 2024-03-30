import BaseBlock from "components/BaseBlock";
import BurgerPlaceHolder from "assets/burger-placeholder.jpg";
import TagChip from "components/chips/TagChip";
import "./styles.less";
import CategoryIndicator from "./CategoryIndicator";
import { RecipeGetDto } from "api/GET/DTOs";

interface RecipeListItemProps {
  readonly recipe: RecipeGetDto;
}

const RecipeListItem = ({ recipe }: RecipeListItemProps) => {
  return (
    <article>
      <BaseBlock className="recipe-list-item">
        <img src={BurgerPlaceHolder} />
        <h1>{recipe.title}</h1>
        <p>{recipe.description}</p>
        <div className="tag-list-info">
          {recipe.tags.map(tag => (
            <TagChip key={tag.id} disableShadow name={tag.name} />
          ))}
        </div>
        <CategoryIndicator categoryColor={recipe.category.color} categoryName={recipe.category.name} />
      </BaseBlock>
    </article>
  );
};

export default RecipeListItem;
