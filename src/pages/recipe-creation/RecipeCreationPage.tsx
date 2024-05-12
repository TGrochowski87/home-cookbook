import Input from "components/Input";
import { useState } from "react";
import CategorySelect from "pages/recipe-creation/category-select/CategorySelect";
import "./styles.less";
import { CategoryGetDto, TagGetDto } from "api/GET/DTOs";
import api from "api/api";
import { useLoaderData } from "react-router-dom";
import Thumbnail from "./thumbnail/Thumbnail";
import TitledSection from "components/TitledSection";
import TagSet from "components/tag-set/TagSet";
import RichTextArea from "./rich-text-area/RichTextArea";
import IngredientListEdit from "components/ingredient-list/IngredientListEdit";
import Ingredient from "models/Ingredient";

interface LoaderResponse {
  readonly categories: readonly CategoryGetDto[];
  readonly tags: readonly TagGetDto[];
}

export async function loader(): Promise<LoaderResponse> {
  const categories = await api.getCategories();
  const tags = await api.getTags();
  return { categories, tags };
}

interface RecipeData {
  readonly name: string;
  readonly categoryId: number | undefined;
  readonly image: Blob | undefined;
  readonly tags: ReadonlyArray<number | string>;
  readonly ingredients: ReadonlyArray<Ingredient>;
  readonly description: string;
}

interface RecipeCreationPageProps {}

const RecipeCreationPage = ({}: RecipeCreationPageProps) => {
  const { categories, tags } = useLoaderData() as LoaderResponse;
  const [formData, setFormData] = useState<RecipeData>({
    name: "",
    categoryId: undefined,
    image: undefined,
    tags: [],
    ingredients: [
      { key: 1, name: "pierś z kurczaka", amount: { value: "300", unit: "g" } },
      { key: 2, name: "mleko", amount: { value: "500", unit: "ml" } },
      { key: 3, name: "przyprawa do kurczaka", amount: { value: "trochę", unit: null } },
      { key: 4, name: "soplica pigwowa", amount: { value: "1", unit: "L" } },
    ],
    description: "",
  });

  const addIngredient = (ingredient: Ingredient): void => {
    if (formData.ingredients.find(i => i.name === ingredient.name)) {
      return;
    }
    setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, ingredient] }));
  };

  const removeIngredient = (name: string): void => {
    setFormData(prev => ({ ...prev, ingredients: prev.ingredients.filter(i => i.name !== name) }));
  };

  return (
    <div className="page recipe-creation-page">
      <h1>Nowy przepis</h1>
      <Input
        value={formData.name}
        placeholder="Nazwa przepisu..."
        onChange={event => setFormData(prev => ({ ...prev, name: event.target.value }))}
      />

      <CategorySelect
        categories={categories}
        value={formData.categoryId?.toString() ?? ""}
        setValue={(categoryId: string) => setFormData(prev => ({ ...prev, categoryId: +categoryId }))}
      />

      <Thumbnail
        image={formData.image}
        setImage={(image: Blob | undefined) => setFormData(prev => ({ ...prev, image: image }))}
      />

      <TitledSection title="Tagi">
        <TagSet
          tags={tags}
          tagSize="big"
          tagCreationEnabled
          selection={{
            disabled: false,
            onSelectionChange: (selectedTagIds: number[]) => setFormData(prev => ({ ...prev, tags: selectedTagIds })),
          }}
        />
      </TitledSection>

      <TitledSection title="Składniki">
        <IngredientListEdit
          ingredients={formData.ingredients}
          addIngredient={addIngredient}
          removeIngredient={removeIngredient}
        />
      </TitledSection>

      <TitledSection title="Treść">
        <RichTextArea
          value={formData.description}
          onChange={(value: string) => setFormData(prev => ({ ...prev, description: value }))}
        />
      </TitledSection>
    </div>
  );
};

export default RecipeCreationPage;
