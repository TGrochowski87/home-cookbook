import SearchBar from "./search/SearchBar";
import CategoryChip from "pages/recipes/search/CategoryChip";
import "./styles.less";
import { useRef } from "react";
import api from "api/api";
import { CategoryGetDto, RecipeGetDto, TagGetDto } from "api/GET/DTOs";
import RecipeListItem from "./recipe/RecipeListItem";
import { Form, useLoaderData, useNavigate, useSubmit } from "react-router-dom";
import AddButton from "components/buttons/AddButton";
import TagSet from "components/tag-set/TagSet";
import BottomPageFadeout from "components/BottomPageFadeout";

interface LoaderResponse {
  readonly recipes: readonly RecipeGetDto[];
  readonly categories: readonly CategoryGetDto[];
  readonly tags: TagGetDto[];
}

export async function loader(): Promise<LoaderResponse> {
  const categories = await api.get.getCategories();
  const tags = await api.get.getTags();
  const recipes = await api.get.getRecipes();
  return { recipes, categories, tags };
}

const RecipeListPage = () => {
  const { recipes, categories, tags } = useLoaderData() as LoaderResponse;

  const searchTimeoutId = useRef<number>();
  const navigate = useNavigate();
  const submit = useSubmit();

  return (
    <div className="recipe-list-page">
      <Form
        className="search-section"
        onChange={event => {
          clearTimeout(searchTimeoutId.current);
          searchTimeoutId.current = window.setTimeout(() => {
            submit(event.target.form, { replace: true });
          }, 1000);
        }}>
        <SearchBar />

        <div className="category-list">
          {categories.map(category => (
            <CategoryChip key={category.id} category={category} />
          ))}
        </div>

        <TagSet tags={tags} tagSize="big" selection={{ disabled: false }} />
      </Form>
      <div className="recipe-list">
        {recipes.map(recipe => (
          <RecipeListItem key={recipe.id} recipe={recipe} />
        ))}
      </div>
      <BottomPageFadeout />
      <AddButton onClick={() => navigate(`./new`, { relative: "path" })} />
    </div>
  );
};

export default RecipeListPage;
