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
  const { data } = await axiosInstanceWithAuthToken.get("/groups/groups");
  return data;
};

export const getGroup = async (id) => {
  const { data } = await axiosInstanceWithAuthToken.get("/groups/class", {
    params: {
      class_id: id,
    },
  });
  return data;
};

export const getProfessorHomeworksForSpecificGroup = async (id) => {
  const { data } = await axiosInstanceWithAuthToken.get(
    "/homeworks/homeworks",
    {
      params: {
        class_id: id,
      },
    }
  );
  const openHomeworks = [];
  const forReviewHomeworks = [];
  const finishedHomeworks = [];
  if (data) {
    data.forEach((obj) => {
      switch (obj.status) {
        case "finished":
          finishedHomeworks.push(obj);
          break;
        case "in progress":
          forReviewHomeworks.push(obj);
          break;
        default:
          openHomeworks.push(obj);
          break;
      }
    });
  }
  let data2 = [];
  data2.push(openHomeworks);
  data2.push(forReviewHomeworks);
  data2.push(finishedHomeworks);

  return data2;
};

export const getProfessorAllSubmitedHomeworks = async (id) => {
  const { data } = await axiosInstanceWithAuthToken.get(
    `/homeworks/get_homeworks/${id}`
  );
  return data;
};

export const getHomeworkDataForReview = async (id) => {
  const { data } = await axiosInstanceWithAuthToken.get(
    `/homeworks/get_homework_data/${id}`
  );
  console.log(data);
  return data;
};

export const getHomeworkDataForStudent = async (id) => {
  const { data } = await axiosInstanceWithAuthToken.get(
    `/homeworks/get_homework_data/${id}`
  );
  console.log(data);
  return data;
};

export const getAllStudentsSubmittedHomeworks = async (id) => {
  const { data } = await axiosInstanceWithAuthToken.get(
    `/homeworks/get_student_homework_data/${id}`
  );
  console.log(data);
  return data;
};
