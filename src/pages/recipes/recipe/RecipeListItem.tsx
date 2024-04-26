import BurgerPlaceHolder from "assets/burger-placeholder.jpg";
import "./styles.less";
import CategoryIndicator from "./CategoryIndicator";
import { RecipeGetDto } from "api/GET/DTOs";
import { useNavigate } from "react-router-dom";
import TagSet from "components/tag-set/TagSet";

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
      <TagSet tags={recipe.tags} tagSize="small" disableShadow align="start" />
      <CategoryIndicator categoryColor={recipe.category.color} categoryName={recipe.category.name} />
    </article>
  );
};

export default RecipeListItem;
