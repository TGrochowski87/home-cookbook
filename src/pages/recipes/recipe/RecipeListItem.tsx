import BurgerPlaceHolder from "assets/burger-placeholder.jpg";
import "./styles.less";
import CategoryIndicator from "./CategoryIndicator";
import { RecipeGetDto } from "api/GET/DTOs";
import SmallTagChip from "./SmallTagChip";
import { useNavigate } from "react-router-dom";

interface RecipeListItemProps {
  readonly recipe: RecipeGetDto;
}

const RecipeListItem = ({ recipe }: RecipeListItemProps) => {
  const navigate = useNavigate();

  return (
    <article
      className="recipe-list-item block floating"
      onClick={() => navigate(`./${recipe.id}`, { relative: "path" })}>
      <img src={BurgerPlaceHolder} />
      <h1>{recipe.title}</h1>
      <p>{recipe.description}</p>
      <div className="tag-list-info">
        {recipe.tags.map(tag => (
          <SmallTagChip key={tag.id} tag={tag} />
        ))}
      </div>
      <CategoryIndicator categoryColor={recipe.category.color} categoryName={recipe.category.name} />
    </article>
  );
};

export default RecipeListItem;
