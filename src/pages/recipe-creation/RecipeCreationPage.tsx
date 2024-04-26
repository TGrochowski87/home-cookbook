import Input from "components/Input";
import { useState } from "react";
import CategorySelect from "pages/recipe-creation/select/CategorySelect";
import "./styles.less";
import { CategoryGetDto, TagGetDto } from "api/GET/DTOs";
import api from "api/api";
import { useLoaderData } from "react-router-dom";
import Thumbnail from "./thumbnail/Thumbnail";
import TitledSection from "components/TitledSection";
import TagSet from "components/tag-set/TagSet";

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
}

interface RecipeCreationPageProps {}

const RecipeCreationPage = ({}: RecipeCreationPageProps) => {
  const { categories, tags } = useLoaderData() as LoaderResponse;
  const [formData, setFormData] = useState<RecipeData>({
    name: "",
    categoryId: undefined,
    image: undefined,
    tags: [],
  });

  return (
    <div className="page-layout-column recipe-creation-page">
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
          tagCreationEnabled
          selection={{
            disabled: false,
            onSelectionChange: (selectedTagIds: number[]) => setFormData(prev => ({ ...prev, tags: selectedTagIds })),
          }}
        />
      </TitledSection>
    </div>
  );
};

export default RecipeCreationPage;
