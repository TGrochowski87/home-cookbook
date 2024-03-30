import SearchBar from "./SearchBar";
import RecipeList from "./RecipeList";
import CategoryChip from "components/chips/CategoryChip";
import TagChip from "components/chips/TagChip";
import "./styles.less";

const RecipeListPage = () => {
  return (
    <div className="recipe-list-page page-layout">
      <form className="search-section">
        <SearchBar />
        <div className="category-list">
          <CategoryChip name="dsf" activeColor="purple" />
          <CategoryChip name="Teasdgagst" activeColor="red" />
          <CategoryChip name=" asd f" activeColor="blue" />
          <CategoryChip name=" sdfas" activeColor="orange" />
          <CategoryChip name="sadfsag" activeColor="lightblue" />
        </div>
        <div className="tag-list">
          <TagChip name="dfgdf" />
          <TagChip name="sdgdsfgsdg" />
          <TagChip name=" sadf sda" />
          <TagChip name="sfsadfasg" />
          <TagChip name="sdf" />
          <TagChip name="gas asd" />
          <TagChip name="asdfsdf" />
          <TagChip name="sdfsadfsa " />
          <TagChip name="sdfsa" />
          <TagChip name="sdf" />
        </div>
      </form>
      <RecipeList />
      <div className="shadow"></div>
    </div>
  );
};

export default RecipeListPage;
