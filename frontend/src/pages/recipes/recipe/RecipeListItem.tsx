import "./styles.less";
import CategoryIndicator from "./CategoryIndicator";
import { useNavigate } from "react-router-dom";
import TagSet from "components/tag-set/TagSet";
import { RecipeGetDto } from "api/recipes/DTOs";

interface RecipeListItemProps {
  readonly recipe: RecipeGetDto;
}

const RecipeListItem = ({ recipe }: RecipeListItemProps) => {
  const navigate = useNavigate();

  return (
    <article
      className="recipe-list-item block floating interactive-element"
      onClick={() => navigate(`./${recipe.id}`, { relative: "path" })}>
      <div className="image-wrapper">
        {recipe.imageSrc ? (
          <img src={recipe.imageSrc} />
        ) : (
          <div className="image-placeholder" dangerouslySetInnerHTML={{ __html: recipe.category.symbol }} />
        )}
      </div>
      <h2>{recipe.name}</h2>
      <TagSet tags={recipe.tags} tagSize="small" disableShadow align="start" />
      <CategoryIndicator category={recipe.category} />
    </article>
  );
};

export default RecipeListItem;
