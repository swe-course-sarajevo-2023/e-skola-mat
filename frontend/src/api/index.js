import axiosInstance from "@/utils/axios";

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
