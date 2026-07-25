import API from "./api";

export const getMembers = async () => {
  const response = await API.get("/users/members");

  return response.data;
};