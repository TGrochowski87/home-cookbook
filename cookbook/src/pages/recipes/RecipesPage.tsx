import SearchBar from "./search/SearchBar";
import CategoryChip from "pages/recipes/search/CategoryChip";
import "./styles.less";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import api from "api/api";
import { CategoryGetDto, GetRecipesResponseDto, RecipeGetDto, TagGetDto } from "api/GET/DTOs";
import RecipeListItem from "./recipe/RecipeListItem";
import { Form, useLoaderData, useLocation, useNavigate, useSearchParams, useSubmit } from "react-router-dom";
import AddButton from "components/buttons/AddButton";
import TagSet, { TagSelection } from "components/tag-set/TagSet";
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

interface QueryParams {
  readonly name: string;
  readonly category: string;
  //
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

  const [query, setQuery] = useState<QueryParams>({
    name: "",
    category: "",
  });
  const initialTags = useRef<string[]>(searchParams.getAll("tags"));

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
    setQuery({
      name: searchParams.get("name") ?? "",
      category: searchParams.get("category") ?? "",
    });
  }, []);

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
        <SearchBar
          value={query.name}
          setValue={(newValue: string) => setQuery(prev => ({ ...prev, name: newValue }))}
        />

        <div className="category-list">
          {categories.map(category => (
            <CategoryChip
              key={category.id}
              category={category}
              checked={query.category === category.name}
              onChange={value => setQuery(prev => ({ ...prev, category: value }))}
            />
          ))}
        </div>

        <TagSet
          tags={tags}
          tagSize="big"
          selection={{
            disabled: false,
            initiallySelected: tags.filter(t => initialTags.current.includes(t.name)).map(t => t.id),
            onSelectionChange: (selectedTags: TagSelection[]) =>
              setQuery(prev => ({ ...prev, tags: selectedTags.map(t => t.name) })),
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
