import { RecipeDetailsGetDto } from "api/GET/DTOs";
import api from "api/api";
import { Form, useLoaderData } from "react-router-dom";
import BurgerPlaceHolder from "assets/burger-placeholder.jpg";
import "./styles.less";
import TitledSection from "components/TitledSection";
import Ingredient from "components/Ingredient";
import Button from "components/Button";
import TagSet from "components/tag-set/TagSet";

export async function loader({ params }: any) {
  const recipe = await api.getRecipe(params.id);
  return recipe;
}

const RecipePage = () => {
  const recipe = useLoaderData() as RecipeDetailsGetDto;

  return (
    <div className="page-layout-column recipe-page">
      <div>
        <h1>{recipe.title}</h1>
        {/* @ts-ignore */}
        <div style={{ "--color": recipe.category.color }} className="category-indicator">
          <h3>{recipe.category.name}</h3>
        </div>
      </div>

      <div className="image-space floating">
        <img src={BurgerPlaceHolder} />
      </div>

      <TagSet tags={recipe.tags} />

      <TitledSection title="Składniki">
        <ol>
          {recipe.ingredients.map(i => (
            <Ingredient ingredient={i} />
          ))}
        </ol>
        <Form className="add-to-shopping-list-button-space">
          <button type="submit">Dodaj niezaznaczone do listy zakupów</button>
        </Form>
      </TitledSection>

      <TitledSection title="Treść">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus imperdiet scelerisque rutrum. Praesent feugiat
        mi eget varius suscipit. Etiam in nulla eros.
      </TitledSection>

      <Form className="bottom-button-space">
        <Button>edytuj</Button>
        <Button>stwórz wariant</Button>
      </Form>
    </div>
  );
};

export default RecipePage;
