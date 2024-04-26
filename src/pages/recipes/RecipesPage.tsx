import SearchBar from "./search/SearchBar";
import CategoryChip from "pages/recipes/search/CategoryChip";
import "./styles.less";
import { useRef } from "react";
import api from "api/api";
import { CategoryGetDto, RecipeGetDto, TagGetDto } from "api/GET/DTOs";
import RecipeListItem from "./recipe/RecipeListItem";
import { Form, useLoaderData, useNavigate, useSubmit } from "react-router-dom";
import AddButton from "./AddButton";
import TagSet from "components/tag-set/TagSet";

interface LoaderResponse {
  readonly recipes: readonly RecipeGetDto[];
  readonly categories: readonly CategoryGetDto[];
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
  const navigate = useNavigate();
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

        <TagSet tags={tags} smallTags selection={{ disabled: false }} />
      </Form>
      <div className="recipe-list">
        {recipes.map(recipe => (
          <RecipeListItem key={recipe.id} recipe={recipe} />
        ))}
      </div>
      <div className="shadow"></div>
      <AddButton onClick={() => navigate(`./new`, { relative: "path" })} />
    </div>
  );
};

export default RecipeListPage;
