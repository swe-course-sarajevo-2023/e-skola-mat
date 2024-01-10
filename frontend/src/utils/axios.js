import axios from 'axios';

// ----------------------------------------------------------------------
const API_BASE_URL =
	process.env.NODE_ENV === 'production'
		? 'https://sample-zeaqndbcnq-oa.a.run.app'
		: 'http://localhost:8000';

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
});

axiosInstance.interceptors.response.use(
	res => res,
	error =>
		Promise.reject(
			(error.response && error.response.data) || 'Something went wrong'
		)
);

// ----------------------------------------------------------------------

const axiosInstanceWithAuthToken = axios.create({
	baseURL: API_BASE_URL,
});

console.log(API_BASE_URL);

axiosInstanceWithAuthToken.interceptors.request.use(
	request => {
		const token = localStorage.getItem('token');
		request.headers.Authorization = `Bearer ${token}`;
		return request;
	},
	error => {
		if (error?.response?.status === 401) {
			localStorage.removeItem('token');
			window.location.href = '/login';
		}
		return Promise.reject(
			(error.response && error.response.data) || 'Something went wrong'
		);
	}
);

// ----------------------------------------------------------------------

export const fetcher = async args => {
	const [url, config] = Array.isArray(args) ? args : [args];

	const res = await axiosInstance.get(url, { ...config });

	return res.data;
};

// ----------------------------------------------------------------------

export default axiosInstance;
export { axiosInstanceWithAuthToken };
