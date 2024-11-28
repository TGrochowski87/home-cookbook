import * as GET from "./GET/requests";
import * as POST from "./POST/requests";
import * as PUT from "./PUT/requests";
import * as DELETE from "./DELETE/requests";

export const baseUrl = import.meta.env.VITE_API_BASE_URL;

const api = {
  baseUrl,
  get: { ...GET },
  post: { ...POST },
  put: { ...PUT },
  delete: { ...DELETE },
};

export default api;
