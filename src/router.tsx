import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import MainPageLayout from "pages/MainPageLayout.tsx";
import App from "./App";
import RecipesPage, { loader as recipesPageLoader } from "pages/recipes/RecipesPage";
import ShoppingPage from "pages/shopping/ShoppingPage";
import RecipePage, { loader as recipePageLoader } from "pages/recipe/RecipePage";
import RecipeCreationPage, { loader as recipeCreationPageLoader } from "pages/recipe-creation/RecipeCreationPage";

// TODO: global error boundry
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Navigate replace to="/recipes" />} />
      <Route element={<MainPageLayout />}>
        <Route path="/recipes" element={<RecipesPage />} loader={recipesPageLoader} />
        <Route path="/shopping" element={<ShoppingPage />} />
      </Route>
      <Route path="/recipes/:id" element={<RecipePage />} loader={recipePageLoader} />
      <Route path="/recipes/new" element={<RecipeCreationPage />} loader={recipeCreationPageLoader} />
    </Route>
  )
);

export default router;
