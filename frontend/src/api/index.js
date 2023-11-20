import axiosInstance, { axiosInstanceWithAuthToken } from "@/utils/axios";

export const loginUser = async ({ username, password }) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  const { data } = await axiosInstance.post("/auth/access-token", formData);
  return data;
};

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get("/users");

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addUser = async () => {
  try {
    const response = await axiosInstance.post("/user", {});

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeUser = async () => {
  try {
    const reponse = await axiosInstance.delete("/user", {});

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfessorHomeworks = async () => {
  const { data } = await axiosInstanceWithAuthToken.get("/homeworks");
  return data;
};

export const createProfessorHomework = async (data) => {
  await axiosInstanceWithAuthToken.post("/homeworks", data);
};

export const deleteProfessorHomework = async (id) => {
  await axiosInstanceWithAuthToken.delete(`/homeworks/${id}`);
};

export const getGroups = async () => {
  const { data } = await axiosInstanceWithAuthToken.get("/groups/classes");
  return data;
};
