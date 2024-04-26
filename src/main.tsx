import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import MainPageLayout from "pages/MainPageLayout.tsx";
import App from "./App";
import RecipesPage, { loader as recipesPageLoader } from "pages/recipes/RecipesPage";
import ShoppingPage from "pages/shopping/ShoppingPage";
import RecipePage, { loader as recipePageLoader } from "pages/recipe/RecipePage";
import RecipeCreationPage, { loader as recipeCreationPageLoader } from "pages/recipe-creation/RecipeCreationPage";
import * as Tooltip from "@radix-ui/react-tooltip";

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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Tooltip.Provider>
      <RouterProvider router={router} />
    </Tooltip.Provider>
  </React.StrictMode>
);
