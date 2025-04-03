import * as recipes from "./recipes/requests";
import * as categories from "./categories/requests";
import * as tags from "./tags/requests";
import * as shoppingLists from "./shopping-lists/requests";

const baseApiUrl = window.__APP_CONFIG__?.API_BASE_URL;
if (baseApiUrl === undefined) {
  throw new Error("API_BASE_URL is not defined in the configuration file.");
}

export const BaseUrl = baseApiUrl;

const api = {
  BaseUrl,
  recipes: { ...recipes },
  categories: { ...categories },
  tags: { ...tags },
  shoppingLists: { ...shoppingLists },
};

export default api;
