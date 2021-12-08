import axiosClient from './axiosClient';

const loginApi = {
    login: (username, password) => {
        const url = '/auth/login';
        return axiosClient.post(url, { username, password });
    },
    registry: (name, username, password) => {
        const url = '/auth/registry';

        return axiosClient.post(url, { name, username, password });
    },
    forgot: (username) => {
        const url = '/auth/reset-otp';

        return axiosClient.post(url, { username });
    },
    confirmAccount: (username, otp) => {
        const url = '/auth/confirm-account';
        return axiosClient.post(url, { username, otp });
    },
    confirmPassword: (username, otp, password) => {
        const url = '/auth/confirm-password';
        return axiosClient.post(url, { username, otp, password });
    },
    fetchUser: (username) => {
        const url = `/auth/users/${username}`;
        return axiosClient.get(url);
    },
};

export default loginApi;
