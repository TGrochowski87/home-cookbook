import * as GET from "./GET/requests";
import * as POST from "./POST/requests";
import * as PUT from "./PUT/requests";

export const baseUrl = "http://192.168.0.164:5212";

const api = { get: { ...GET }, post: { ...POST }, put: { ...PUT } };

export default api;
