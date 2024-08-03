import * as GET from "./GET/requests";
import * as POST from "./POST/requests";

export const baseUrl = "http://192.168.0.164:3000";

const api = { get: { ...GET }, post: { ...POST } };

export default api;
