import Input from "components/Input";
import "./styles.less";
import { CategoryGetDto, TagGetDto } from "api/GET/DTOs";
import { useNavigate } from "react-router-dom";
import Thumbnail from "./thumbnail/Thumbnail";
import TitledSection from "components/TitledSection";
import TagSet, { TagSelection } from "components/tag-set/TagSet";
import Button from "components/buttons/Button";
import { useForm, Controller } from "react-hook-form";
import { RecipeCreateDto } from "api/POST/DTOs";
import axios from "axios";
import { useAlerts } from "components/alert/AlertStack";
import EditableQuantifiableItemsList from "components/quantifiable-items-list/EditableQuantifiableItemsList";
import QuantifiableItemData from "models/QuantifiableItemData";
import RichTextArea from "components/rich-text-area/RichTextArea";
import CategorySelect from "./category-select/CategorySelect";
import mapper from "mapper";
import { useAppDispatch } from "storage/redux/hooks";
import storeActions from "storage/redux/actions";
import { useEffect } from "react";

export interface RecipeData {
  readonly name: string;
  readonly categoryId: number | undefined;
  readonly image: Blob | undefined;
  readonly tags: ReadonlyArray<number | string>;
  readonly ingredients: ReadonlyArray<QuantifiableItemData>;
  readonly description: string;
}

export const EmptyRecipeCreationFormValues: RecipeData = {
  name: "",
  categoryId: undefined,
  image: undefined,
  tags: [],
  ingredients: [],
  description: "",
};

interface RecipeCreationFormProps {
  readonly categories: readonly CategoryGetDto[];
  readonly tags: readonly TagGetDto[];
  readonly onSuccessNavigateTo: string;
  readonly replaceOnNavigate?: boolean;
  readonly onSubmitCallback: (dto: RecipeCreateDto) => Promise<void>;
  readonly initialValues: RecipeData;
}

// TODO: Confirmation on leaving with pending changes
const RecipeCreationForm = ({
  categories,
  tags,
  onSuccessNavigateTo,
  onSubmitCallback,
  initialValues,
  replaceOnNavigate = false,
}: RecipeCreationFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { displayMessage } = useAlerts();
  const { register, handleSubmit, formState, control, setFocus, reset, getValues } = useForm<RecipeData>({
    defaultValues: { ...initialValues, image: undefined }, // Binary data is not serializable.
  });

  const onSubmit = async (data: RecipeData): Promise<void> => {
    try {
      const dto = mapper.map.toRecipeCreateDto(data);
      await onSubmitCallback(dto);
      reset();
      if (dto.newTags.length > 0) {
        dispatch(storeActions.tags.invalidateTags());
      }

      navigate(onSuccessNavigateTo, { replace: replaceOnNavigate });
    } catch (error) {
      if (axios.isAxiosError(error)) {
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
    }
  };

  // Save pending changes to local storage on unmount.
  useEffect(() => {
    return () => {
      if (formState.isDirty && formState.isSubmitted === false) {
        localStorage.setItem("pendingCreate", JSON.stringify(getValues()));
      } else {
        localStorage.removeItem("pendingCreate");
      }
    };
  }, [formState.isDirty, formState.isSubmitted]);

  // Handle saving pending changes on closing the page.
  useEffect(() => {
    const savePendingChanges = () => {
      // Save the pending changes on every case of losing focus by the website.
      if (formState.isDirty && formState.isSubmitted === false && document.visibilityState === "hidden") {
        localStorage.setItem("pendingCreate", JSON.stringify(getValues()));
        return;
      }

      // If the page has not been closed and it regained focus, remove the storage entry.
      localStorage.removeItem("pendingCreate");
    };

    // Check for visibilitychange instead of onbeforeunload as per MDN recommendation.
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon
    document.addEventListener("visibilitychange", savePendingChanges);

    return () => {
      document.removeEventListener("visibilitychange", savePendingChanges);
    };
  }, [formState.isDirty, formState.isSubmitted]);

  return (
    <div className="recipe-creation-form">
      <div className="input-with-error">
        <Input
          {...register("name", {
            required: "Nazwa przepisu jest wymagana",
            maxLength: 100,
            setValueAs: (value: string) => value.trim(),
          })}
          maxLength={100}
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
                initiallySelected: initialValues?.tags.map(tag =>
                  typeof tag === "number" ? tags.find(t => t.id === tag)!.name : tag!
                ),
                onSelectionChange: (selectedTags: TagSelection[]) => {
                  onChange(selectedTags.map(t => (t.id !== undefined ? t.id : t.name)));
                },
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
          console.error(error);
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
