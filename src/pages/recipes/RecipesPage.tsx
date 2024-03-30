import SearchBar from "./search/SearchBar";
import CategoryChip from "pages/recipes/search/CategoryChip";
import TagChip from "pages/recipes/search/TagChip";
import "./styles.less";
import { useEffect, useRef, useState } from "react";
import api from "api/api";
import { CategoryGetDto, RecipeGetDto, TagGetDto } from "api/GET/DTOs";
import RecipeListItem from "./recipe/RecipeListItem";
import { Form, useSubmit } from "react-router-dom";

const RecipeListPage = () => {
  const [categories, setCategories] = useState<CategoryGetDto[]>([]);
  const [tags, setTags] = useState<TagGetDto[]>([]);
  const [recipes, setRecipes] = useState<RecipeGetDto[]>([]);

  const searchTimeoutId = useRef<number>();
  const submit = useSubmit();

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
      <Form
        className="search-section"
        onChange={event => {
          clearTimeout(searchTimeoutId.current);
          searchTimeoutId.current = setTimeout(() => {
            submit(event.target.form);
          }, 1000);
        }}>
        <SearchBar />
        <div className="category-list">
          {categories.map(category => (
            <CategoryChip key={category.id} category={category} />
          ))}
        </div>
        <div className="tag-list">
          {tags.map(tag => (
            <TagChip key={tag.id} tag={tag} />
          ))}
        </div>
      </Form>
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
