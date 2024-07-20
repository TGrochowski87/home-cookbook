import Input from "components/Input";
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
import Button from "components/Button";
import { useForm, Controller } from "react-hook-form";

interface LoaderResponse {
  readonly categories: readonly CategoryGetDto[];
  readonly tags: readonly TagGetDto[];
}

export async function loader(): Promise<LoaderResponse> {
  const categories = await api.get.getCategories();
  const tags = await api.get.getTags();
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
  const { register, handleSubmit, formState, control, setFocus, getValues, trigger } = useForm<RecipeData>({
    defaultValues: {
      name: "",
      categoryId: undefined,
      image: undefined,
      tags: [],
      ingredients: [],
      description: "",
    },
  });

  const onSubmit = (data: RecipeData) => {
    console.log(data);
  };

  return (
    <div className="page recipe-creation-page">
      <h1>Nowy przepis</h1>
      {/* Cannot be form, because this would cause form nesting. */}
      <div className="main-form">
        <div className="input-with-error">
          <Input
            {...register("name", {
              required: "Nazwa przepisu jest wymagana",
              maxLength: 50,
              setValueAs: (value: string) => value.trim(),
            })}
            maxLength={50}
            placeholder="Nazwa przepisu..."
          />
          {formState.errors.name && <p className="under-input-error-message">{formState.errors.name.message}</p>}
        </div>

        <Controller
          control={control}
          name="categoryId"
          rules={{ required: "Kategoria jest wymagana" }}
          render={({ field: { value, onChange, ref } }) => (
            <div className="input-with-error">
              <CategorySelect
                ref={ref}
                categories={categories}
                value={value?.toString() ?? ""}
                setValue={(categoryId: string) => onChange(+categoryId)}
              />
              {formState.errors.categoryId && (
                <p className="under-input-error-message">{formState.errors.categoryId.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="image"
          render={({ field: { value, onChange } }) => (
            <Thumbnail image={value} setImage={(image: Blob | undefined) => onChange(image)} />
          )}
        />

        <TitledSection title="Tagi">
          <Controller
            control={control}
            name="tags"
            render={({ field: { onChange } }) => (
              <TagSet
                tags={tags}
                tagSize="big"
                tagCreationEnabled
                selection={{
                  disabled: false,
                  onSelectionChange: (selectedTagIds: number[]) => onChange(selectedTagIds),
                }}
              />
            )}
          />
        </TitledSection>

        <TitledSection title="Składniki">
          <Controller
            control={control}
            name="ingredients"
            render={({ field: { value, onChange } }) => (
              <IngredientListEdit
                ingredients={value}
                setIngredients={(ingredients: Ingredient[]) => onChange(ingredients)}
              />
            )}
          />
        </TitledSection>

        <TitledSection title="Treść">
          <Controller
            control={control}
            name="description"
            render={({ field: { value, onChange } }) => <RichTextArea value={value} onChange={onChange} />}
          />
        </TitledSection>

        <Button
          // onClick={async () => {
          //   const val = getValues();
          //   var isValid = await trigger(undefined, { shouldFocus: true });
          //   console.log(isValid);
          //   if (isValid) {
          //     onSubmit(val);
          //   } else {
          //     console.log(formState.errors);
          //     // if (formState.error.name?.type !== "required" && formState.errors.categoryId?.type === "required") {
          //     //   setFocus("categoryId");
          //     // }
          //   }
          // }}
          onClick={handleSubmit(onSubmit, error => {
            console.log(error);
            if (error.name?.type !== "required" && error.categoryId?.type === "required") {
              setFocus("categoryId");
            }
          })}
          className="save-button">
          zapisz
        </Button>
      </div>
    </div>
  );
};

export default RecipeCreationPage;
