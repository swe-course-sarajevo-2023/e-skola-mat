import axiosInstance, { axiosInstanceWithAuthToken } from "@/utils/axios";
import {redirect} from "next/navigation";

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
  const {data} = await axiosInstanceWithAuthToken.get("/groups/class", {
    params: {
      class_id: id,
    }
  });
  return data;
}

export const getProfessorHomeworksForSpecificGroup = async (id) => {
  const {data} = await axiosInstanceWithAuthToken.get('/homeworks/homeworks', {
    params: {
      class_id: id,
    }
  });
  const openHomeworks = [];
  const forReviewHomeworks = [];
  const finishedHomeworks = [];
  if(data){
    data.forEach((obj) => {
      switch (obj.status) {
        case 'finished':
          finishedHomeworks.push(obj);
          break;
        case 'in progress':
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
}

export const getProfessorAllSubmitedHomeworks = async (id) => {
  const { data } = await axiosInstanceWithAuthToken.get(`/professors/get_homeworks/${id}`);
  return data;
}

export const getHomeworkDataForReview = async (id) => {
  const { data } = await axiosInstanceWithAuthToken.get(`/homeworks/get_homework_data/${id}`);
  return data;
}

export const getAllStudentsForSpecificGroup = async (id) => {
  const { data } = await axiosInstanceWithAuthToken.get(`/professors/list_students/${id}`);
  return data;
}

export const deleteStudent = async (data) => {
  await axiosInstanceWithAuthToken.delete('/professors/delete_student', {data});
};

export const addStudent = async (data) => {
  const { group_id, new_student } = data;
  await axiosInstanceWithAuthToken.post(`/professors/register_student`, 
  data.new_student,  
  {
    params: {
      group_id: data.group_id,
    },
  });
};

export const gradeStudent = async (data) => {
  console.log("BITNO")
  console.log(data)

  const { homework_id, user_id, grade, note } = data;
  await axiosInstanceWithAuthToken.post(`/professors/grade_homework`, data)
};

export const commentTask = async (data) => {
  const { id, comment } = data;
  await axiosInstanceWithAuthToken.post(`/professors/comment_homework`,
      data)
};

export const ResetPassword = async (data) => {
  await axiosInstanceWithAuthToken.post("/users/reset-password", data);
};
