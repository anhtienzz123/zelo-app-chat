import axiosClient from './axiosClient';

const BASE_URL = '/users/search/username';

const userApi = {
  fetchUsers: username => {
    return axiosClient.get(`/users/search/username/${username}`);
  },
  fetchUserById: userId => {
    return axiosClient.get(`/users/search/id/${userId}`);
  },
};

export default userApi;
