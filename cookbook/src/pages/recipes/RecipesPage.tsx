import SearchBar from "./search/SearchBar";
import CategoryChip from "pages/recipes/search/CategoryChip";
import "./styles.less";
import { useEffect, useRef, useState } from "react";
import api from "api/api";
import { CategoryGetDto, GetRecipesResponseDto, RecipeGetDto, TagGetDto } from "api/GET/DTOs";
import RecipeListItem from "./recipe/RecipeListItem";
import { Form, useLoaderData, useNavigate, useSearchParams, useSubmit } from "react-router-dom";
import AddButton from "components/buttons/AddButton";
import TagSet from "components/tag-set/TagSet";
import BottomPageFadeout from "components/BottomPageFadeout";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingIndicator from "components/LoadingIndicator";
import ScrollUpButton from "./ScrollUpButton";

interface LoaderResponse {
  readonly getRecipesResponse: GetRecipesResponseDto;
  readonly categories: readonly CategoryGetDto[];
  readonly tags: TagGetDto[];
}

export async function loader({ request }: any): Promise<LoaderResponse> {
  const url = new URL(request.url);
  const categories = await api.get.getCategories();
  const tags = await api.get.getTags();
  const getRecipesResponse = await api.get.getRecipes({ type: "Query", query: url.search });
  return { getRecipesResponse, categories, tags };
}

const RecipeListPage = () => {
  const { getRecipesResponse, categories, tags } = useLoaderData() as LoaderResponse;
  const [recipes, setRecipes] = useState<readonly RecipeGetDto[]>(getRecipesResponse.recipes);
  const nextRecipesPage = useRef<string | null>(getRecipesResponse.nextPage);
  const [showScrollUpButton, setShowScrollUpButton] = useState<boolean>(false);

  const searchTimeoutId = useRef<number>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();

  // Radio button group needs a higher level state.
  const [categorySelection, setCategorySelection] = useState<string>(searchParams.get("category") || "");

  const fetchMoreRecipes = async () => {
    if (nextRecipesPage.current === null) {
      return;
    }

    // await new Promise(resolve => {
    //   setTimeout(resolve, 3000);
    // });

    const nextPage = await api.get.getRecipes({ type: "Whole", url: nextRecipesPage.current });
    nextRecipesPage.current = nextPage.nextPage;
    setRecipes(prev => prev.concat(nextPage.recipes));
  };

  useEffect(() => {
    setRecipes(getRecipesResponse.recipes);
    nextRecipesPage.current = getRecipesResponse.nextPage;
  }, [getRecipesResponse]);

  // Setup events
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollUpButton(window.scrollY > 1000);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
        <SearchBar initialValue={searchParams.get("name") || ""} />

        <div className="category-list">
          {categories.map(category => (
            <CategoryChip
              key={category.id}
              category={category}
              checked={categorySelection === category.name}
              onChange={setCategorySelection}
            />
          ))}
        </div>

        <TagSet
          tags={tags}
          tagSize="big"
          selection={{
            disabled: false,
            initiallySelected: tags.filter(t => searchParams.getAll("tags").includes(t.name)).map(t => t.id),
          }}
        />
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
      <ScrollUpButton hidden={showScrollUpButton == false} />
    </div>
  );
};

export default RecipeListPage;
