import SearchBar from "./search/SearchBar";
import CategoryChip from "pages/recipes/search/CategoryChip";
import "./styles.less";
import { useRef, useState } from "react";
import api from "api/api";
import { CategoryGetDto, GetRecipesResponseDto, RecipeGetDto, TagGetDto } from "api/GET/DTOs";
import RecipeListItem from "./recipe/RecipeListItem";
import { Form, useLoaderData, useNavigate, useSubmit } from "react-router-dom";
import AddButton from "components/AddButton";
import TagSet from "components/tag-set/TagSet";
import BottomPageFadeout from "components/BottomPageFadeout";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingIndicator from "components/LoadingIndicator";

interface LoaderResponse {
  readonly getRecipesResponse: GetRecipesResponseDto;
  readonly categories: readonly CategoryGetDto[];
  readonly tags: TagGetDto[];
}

export async function loader(): Promise<LoaderResponse> {
  const categories = await api.get.getCategories();
  const tags = await api.get.getTags();
  const getRecipesResponse = await api.get.getRecipes();
  return { getRecipesResponse, categories, tags };
}

const RecipeListPage = () => {
  const { getRecipesResponse, categories, tags } = useLoaderData() as LoaderResponse;
  const [recipes, setRecipes] = useState<readonly RecipeGetDto[]>(getRecipesResponse.recipes);
  const nextRecipesPage = useRef<string | null>(getRecipesResponse.nextPage);

  const searchTimeoutId = useRef<number>();
  const navigate = useNavigate();
  const submit = useSubmit();

  const fetchMoreRecipes = async () => {
    if (nextRecipesPage.current === null) {
      return;
    }

    const nextPage = await api.get.getRecipes(nextRecipesPage.current);
    nextRecipesPage.current = nextPage.nextPage;
    setRecipes(prev => prev.concat(nextPage.recipes));
  };

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

      <InfiniteScroll
        className="recipe-list"
        dataLength={recipes.length}
        next={fetchMoreRecipes}
        hasMore={nextRecipesPage.current !== null}
        loader={<LoadingIndicator className="loading" />}>
        {recipes.map(recipe => (
          <RecipeListItem key={recipe.id} recipe={recipe} />
        ))}
      </InfiniteScroll>

      <BottomPageFadeout />
      <AddButton onClick={() => navigate(`./new`, { relative: "path" })} />
    </div>
  );
};

export default RecipeListPage;
