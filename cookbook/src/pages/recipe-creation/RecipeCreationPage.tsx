import Input from "components/Input";
import CategorySelect from "pages/recipe-creation/category-select/CategorySelect";
import "./styles.less";
import { CategoryGetDto, TagGetDto } from "api/GET/DTOs";
import api from "api/api";
import { useLoaderData, useNavigate } from "react-router-dom";
import Thumbnail from "./thumbnail/Thumbnail";
import TitledSection from "components/TitledSection";
import TagSet from "components/tag-set/TagSet";
import RichTextArea from "./rich-text-area/RichTextArea";
import Button from "components/Button";
import { useForm, Controller } from "react-hook-form";
import { RecipeCreateDto } from "api/POST/DTOs";
import axios, { AxiosError } from "axios";
import { useAlerts } from "components/alert/AlertStack";
import EditableQuantifiableItemsList from "components/quantifiable-items-list/EditableQuantifiableItemsList";
import QuantifiableItemData from "models/QuantifiableItemData";

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
  readonly ingredients: ReadonlyArray<QuantifiableItemData>;
  readonly description: string;
}

const RecipeCreationPage = () => {
  const { categories, tags } = useLoaderData() as LoaderResponse;
  const navigate = useNavigate();
  const { displayMessage } = useAlerts();
  const { register, handleSubmit, formState, control, setFocus, reset } = useForm<RecipeData>({
    defaultValues: {
      name: "",
      categoryId: undefined,
      image: undefined,
      tags: [],
      ingredients: [],
      description: "",
    },
  });

  const onSubmit = async (data: RecipeData): Promise<void> => {
    console.log(data);

    const dto: RecipeCreateDto = {
      name: data.name,
      categoryId: data.categoryId!,
      image: data.image,
      tagIds: data.tags.filter(t => typeof t === "number") as number[],
      newTags: data.tags.filter(t => typeof t === "string").map(tagName => ({ name: tagName as string })),
      ingredients: data.ingredients,
      description: data.description,
    };

    // TODO: Consider some helper for handling different status codes.
    try {
      await api.post.createRecipe(dto);
      displayMessage({ type: "success", message: "Przepis został utworzony.", fadeOutAfter: 5000 });
      reset();
      navigate("/recipes");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.request || (axiosError.response && axiosError.response?.status >= 500)) {
          displayMessage({ type: "error", message: "Wystąpił nieoczekiwany błąd.", fadeOutAfter: 5000 });
          return;
        }

        if (axiosError.response?.status === 400) {
          displayMessage({ type: "error", message: "Podano niepoprawne dane.", fadeOutAfter: 5000 });
          return;
        }
      }
    }
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
                  onSelectionChange: (selectedTagIds: (number | string)[]) => onChange(selectedTagIds),
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
              <EditableQuantifiableItemsList
                items={value.map(i => ({ ...i, checked: false }))}
                setItems={(items: readonly QuantifiableItemData[]) => onChange(items)}
                rightSideAction={{
                  type: "remove",
                  callback: (item: QuantifiableItemData) => {
                    onChange(value.filter(i => i.key !== item.key));
                  },
                }}
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
