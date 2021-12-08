import axiosClient from './axiosClient';

const BASE_URL = '/auth';

const loginApi = {
  login: account => {
    const url = `${BASE_URL}/login`;
    return axiosClient.post(url, account);
  },

  refreshToken: refreshToken => {
    const url = `${BASE_URL}/refresh-token`;
    return axiosClient.post(url, {refreshToken});
  },

  register: userAccount => {
    const url = `${BASE_URL}/registry`;
    return axiosClient.post(url, userAccount);
  },

  confirmAccount: account => {
    const url = `${BASE_URL}/confirm-account`;
    return axiosClient.post(url, account);
  },

  changePassword: username => {
    const url = `${BASE_URL}/reset-otp`;
    return axiosClient.post(url, username);
  },

  confirmPassword: account => {
    const url = `${BASE_URL}/confirm-password`;
    return axiosClient.post(url, account);
  },

  fetchUser: username => {
    const url = `${BASE_URL}/users/${username}`;
    return axiosClient.get(url);
  },
};

export default loginApi;
