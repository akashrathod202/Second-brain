import api from "./api";

export const getcontent = async () => {
  const response = await api.get("/content/getContent");

  return response.data.content;
};