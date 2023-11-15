import axios from "axios";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

// ----------------------------------------------------------------------

const axiosInstanceWithAuthToken = axios.create({
  baseURL: "http://localhost:8000",
});

axiosInstanceWithAuthToken.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");
    request.headers.Authorization = `Bearer ${token}`;
    return request;
  },
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    );
  }
);

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export default axiosInstance;
export { axiosInstanceWithAuthToken };
