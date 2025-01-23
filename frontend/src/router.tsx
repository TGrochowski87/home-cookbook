import { Navigate, Route, createHashRouter, createRoutesFromElements } from "react-router-dom";
import MainPageLayout from "pages/MainPageLayout.tsx";
import App from "./App";
import RecipesPage, { loader as recipesPageLoader } from "pages/recipes/RecipesPage";
import RecipePage, { loader as recipePageLoader } from "pages/recipe/RecipePage";
import RecipeCreationPage, { loader as recipeCreationPageLoader } from "pages/recipe-creation/RecipeCreationPage";
import RecipeEditionPage, { loader as recipeEditionPageLoader } from "pages/recipe-edition/RecipeEditionPage";
import ShoppingListPage, { loader as shoppingListPageLoader } from "pages/shopping-list/ShoppingListPage";
import ShoppingPage, { loader as shoppingPageLoader } from "pages/shopping-lists/ShoppingPage";
import ErrorHandler from "./ErrorHandler";

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<ErrorHandler />}>
      <Route index element={<Navigate replace to="/recipes" />} />
      <Route element={<MainPageLayout />}>
        <Route path="/recipes" element={<RecipesPage />} loader={recipesPageLoader} />
        <Route path="/shopping-lists" element={<ShoppingPage />} loader={shoppingPageLoader} />
      </Route>
      <Route path="/recipes/:id" element={<RecipePage />} loader={recipePageLoader} />
      <Route path="/recipes/new" element={<RecipeCreationPage />} loader={recipeCreationPageLoader} />
      <Route path="/recipes/:id/edit" element={<RecipeEditionPage />} loader={recipeEditionPageLoader} />
      <Route path="/shopping-lists/:id" element={<ShoppingListPage />} loader={shoppingListPageLoader} />
    </Route>
  )
);

export default router;
