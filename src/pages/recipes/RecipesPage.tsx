import SearchBar from "./SearchBar";
import CategoryChip from "components/chips/CategoryChip";
import TagChip from "components/chips/TagChip";
import "./styles.less";
import { useEffect, useState } from "react";
import api from "api/api";
import { CategoryGetDto, RecipeGetDto, TagGetDto } from "api/GET/DTOs";
import RecipeListItem from "./recipe/RecipeListItem";

const RecipeListPage = () => {
  const [categories, setCategories] = useState<CategoryGetDto[]>([]);
  const [tags, setTags] = useState<TagGetDto[]>([]);
  const [recipes, setRecipes] = useState<RecipeGetDto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const categories = await api.getCategories();
      const tags = await api.getTags();
      const recipes = await api.getRecipes();

      setCategories(categories);
      setTags(tags);
      setRecipes(recipes);
    };

    fetchData();
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
          {tags.map(tag => (
            <TagChip key={tag.id} name={tag.name} />
          ))}
        </div>
      </form>
      <div className="recipe-list">
        {recipes.map(recipe => (
          <RecipeListItem key={recipe.id} recipe={recipe} />
        ))}
      </div>
      <div className="shadow"></div>
    </div>
  );
};

export default RecipeListPage;
