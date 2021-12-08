import axiosClient from './axiosClient';
const BASE_URL = 'users';

const userApi = {
    fetchUser: (username) => {
        return axiosClient.get(`${BASE_URL}/search/username/${username}`);
    },
};

export default userApi;
