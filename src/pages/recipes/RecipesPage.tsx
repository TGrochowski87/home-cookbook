import SearchBar from "./search/SearchBar";
import "./styles.less";
import CategoryList from "./search/CategoryList";
import TagList from "./search/TagList";

const RecipeListPage = () => {
  return (
    <div className="recipe-list-page page-layout">
      <form className="search-section">
        <SearchBar />
        <CategoryList />
        <TagList />
      </form>
    </div>
  );
};

export default RecipeListPage;
