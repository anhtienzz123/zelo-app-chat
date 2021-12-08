import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }

        return response;
    },
    async (error) => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (error.response.status !== 401) {
            return Promise.reject(error);
        }
        axios.interceptors.response.eject(axiosClient.interceptors);
        return axios
            .post('/auth/refresh-token', {
                refreshToken,
            })
            .then((token) => {
                localStorage.setItem('token', token);
                error.response.config.headers['Authorization'] =
                    'Bearer ' + token;
                return axios(error.response.config);
            })
            .catch((error) => {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                return Promise.reject(error);
            })
            .finally();
    }
);

export default axiosClient;
