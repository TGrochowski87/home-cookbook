import Input from "components/Input";
import "./styles.less";
import { CategoryGetDto, RecipeDetailsGetDto, TagGetDto } from "api/GET/DTOs";
import { useNavigate } from "react-router-dom";
import Thumbnail from "./thumbnail/Thumbnail";
import TitledSection from "components/TitledSection";
import TagSet from "components/tag-set/TagSet";
import Button from "components/Button";
import { useForm, Controller } from "react-hook-form";
import { RecipeCreateDto } from "api/POST/DTOs";
import axios from "axios";
import { useAlerts } from "components/alert/AlertStack";
import EditableQuantifiableItemsList from "components/quantifiable-items-list/EditableQuantifiableItemsList";
import QuantifiableItemData from "models/QuantifiableItemData";
import RichTextArea from "components/rich-text-area/RichTextArea";
import CategorySelect from "./category-select/CategorySelect";
import mapper from "mapper";

export interface RecipeData {
  readonly name: string;
  readonly categoryId: number | undefined;
  readonly image: Blob | undefined;
  readonly tags: ReadonlyArray<number | string>;
  readonly ingredients: ReadonlyArray<QuantifiableItemData>;
  readonly description: string;
}

interface RecipeCreationFormProps {
  readonly recipe?: RecipeDetailsGetDto;
  readonly categories: readonly CategoryGetDto[];
  readonly tags: readonly TagGetDto[];
  readonly onSuccessNavigateTo: string;
  readonly replaceOnNavigate?: boolean;
  readonly onSubmitCallback: (dto: RecipeCreateDto) => Promise<void>;
}

const getDefaultFormValues = (recipe?: RecipeDetailsGetDto): RecipeData => {
  return {
    name: recipe?.name ?? "",
    categoryId: recipe?.category.id ?? undefined,
    image: undefined,
    tags: recipe?.tags.map(t => t.id) ?? [],
    ingredients: recipe?.ingredients.map(i => ({ ...i, key: i.id, checked: false })) ?? [],
    description: recipe?.description ?? "",
  };
};

// TODO: Confirmation on leaving with pending changes
const RecipeCreationForm = ({
  recipe,
  categories,
  tags,
  onSuccessNavigateTo,
  onSubmitCallback,
  replaceOnNavigate = false,
}: RecipeCreationFormProps) => {
  const navigate = useNavigate();
  const { displayMessage } = useAlerts();
  const { register, handleSubmit, formState, control, setFocus, reset } = useForm<RecipeData>({
    defaultValues: getDefaultFormValues(recipe),
  });

  const onSubmit = async (data: RecipeData): Promise<void> => {
    try {
      await onSubmitCallback(mapper.map.toRecipeCreateDto(data));
      reset();
      navigate(onSuccessNavigateTo, { replace: replaceOnNavigate });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // TODO: Consider some helper for handling different status codes.
        switch (error.response?.status) {
          case 400:
            displayMessage({ type: "error", message: "Podano niepoprawne dane.", fadeOutAfter: 5000 });
            break;
          case 412:
            displayMessage({
              type: "error",
              message: "Zmiany nie mogły zostać zapisane.\nPrzepis został w międzyczasie zmodyfikowany.",
              fadeOutAfter: 5000,
            });
            break;
          default:
            throw error;
        }
      } else {
        throw error;
      }

      // TODO: ErrorBoundry for unexpected errors.
    }
  };

  return (
    <div className="recipe-creation-form">
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
                initiallySelected: recipe?.tags.map(t => t.id),
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
          render={({ field: { value, onChange } }) => <RichTextArea value={value} editable onChange={onChange} />}
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
  );
};

export default RecipeCreationForm;
