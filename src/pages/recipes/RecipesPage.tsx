import CategoryChip from "components/CategoryChip";
import SearchBar from "./SearchBar";
import "./styles.less";

const RecipeListPage = () => {
  return (
    <div className="recipe-list-page centered-column-layout">
      <SearchBar />
      <CategoryChip name="Test" />
    </div>
  );
};

export default RecipeListPage;
