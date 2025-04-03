import { BaseUrl } from "api/api";
import axios from "axios";
import { TagGetDto } from "./DTOs";

export const getTags = async (): Promise<TagGetDto[]> => {
  const url = `${BaseUrl}/tags`;
  const response = await axios.get<TagGetDto[]>(url);
  return response.data;
};
