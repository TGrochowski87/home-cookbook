import RecipeListItem from "./recipe/RecipeListItem";

interface RecipeListProps {}

const RecipeList = ({}: RecipeListProps) => {
  return (
    <div className="recipe-list">
      <RecipeListItem />
      <RecipeListItem />
      <RecipeListItem />
      <RecipeListItem />
      <RecipeListItem />
      <RecipeListItem />
      <RecipeListItem />
      <RecipeListItem />
      <RecipeListItem />
    </div>
  );
};

export default RecipeList;
