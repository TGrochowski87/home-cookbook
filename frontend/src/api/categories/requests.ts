import { BaseUrl } from "api/api";
import axios from "axios";
import { CategoryGetDto } from "./DTOs";

export const getCategories = async (): Promise<CategoryGetDto[]> => {
  const url = `${BaseUrl}/categories`;
  const response = await axios.get<CategoryGetDto[]>(url);
  return response.data;
};
