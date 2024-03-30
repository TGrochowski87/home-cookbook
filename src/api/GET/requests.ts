import axios from "axios";
import Category from "models/Category";

const baseUrl = "http://192.168.1.135:3000";

export const getCategories = async (): Promise<Category[]> => {
  const url = `${baseUrl}/categories`;
  const response = await axios.get<Category[]>(url);
  return response.data;
};
