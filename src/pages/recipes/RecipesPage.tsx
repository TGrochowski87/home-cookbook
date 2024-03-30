import SearchBar from "./SearchBar";
import RecipeList from "./RecipeList";
import CategoryChip from "components/chips/CategoryChip";
import TagChip from "components/chips/TagChip";
import "./styles.less";
import { useEffect, useState } from "react";
import api from "api/api";
import Category from "models/Category";

const RecipeListPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await api.getCategories();
      setCategories(categories);
    };

    fetchCategories();
  }, []);
  return (
    <div className="recipe-list-page page-layout">
      <form className="search-section">
        <SearchBar />
        <div className="category-list">
          {categories.map(category => (
            <CategoryChip key={category.id} name={category.name} activeColor={category.color} />
          ))}
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
