import SearchBar from "./search/SearchBar";
import CategoryChip from "pages/recipes/search/CategoryChip";
import TagChip from "pages/recipes/search/TagChip";
import "./styles.less";
import { useRef } from "react";
import api from "api/api";
import { CategoryGetDto, RecipeGetDto, TagGetDto } from "api/GET/DTOs";
import RecipeListItem from "./recipe/RecipeListItem";
import { Form, useLoaderData, useSubmit } from "react-router-dom";

interface LoaderResponse {
  readonly recipes: RecipeGetDto[];
  readonly categories: CategoryGetDto[];
  readonly tags: TagGetDto[];
}

export async function loader(): Promise<LoaderResponse> {
  const categories = await api.getCategories();
  const tags = await api.getTags();
  const recipes = await api.getRecipes();
  return { recipes, categories, tags };
}

const RecipeListPage = () => {
  const { recipes, categories, tags } = useLoaderData() as LoaderResponse;

  const searchTimeoutId = useRef<number>();
  const submit = useSubmit();

  return (
    <div className="recipe-list-page page-layout-column">
      <Form
        className="search-section"
        onChange={event => {
          clearTimeout(searchTimeoutId.current);
          searchTimeoutId.current = setTimeout(() => {
            submit(event.target.form, { replace: true });
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
