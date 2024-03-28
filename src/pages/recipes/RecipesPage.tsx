import SearchBar from "./search/SearchBar";
import "./styles.less";
import CategoryList from "./search/CategoryList";
import TagList from "./search/TagList";
import RecipeList from "./RecipeList";

const RecipeListPage = () => {
  return (
    <div className="recipe-list-page page-layout">
      <form className="search-section">
        <SearchBar />
        <CategoryList />
        <TagList />
      </form>
      <RecipeList />
    </div>
  );
};

export default RecipeListPage;
