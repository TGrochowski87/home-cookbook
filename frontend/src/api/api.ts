import * as GET from "./GET/requests";
import * as POST from "./POST/requests";
import * as PUT from "./PUT/requests";
import * as DELETE from "./DELETE/requests";

const baseApiUrl = window.__APP_CONFIG__?.API_BASE_URL;
if (baseApiUrl === undefined) {
  throw new Error("API_BASE_URL is not defined in the configuration file.");
}

export const BaseUrl = baseApiUrl;

const api = {
  BaseUrl,
  get: { ...GET },
  post: { ...POST },
  put: { ...PUT },
  delete: { ...DELETE },
};

export default api;
