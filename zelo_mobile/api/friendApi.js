import axiosClient from './axiosClient';

const BASE_URL = '/friends';

const friendApi = {
  fetchFriends: params => {
    return axiosClient.get(BASE_URL, {params});
  },

  acceptFriend: userId => {
    const url = `${BASE_URL}/${userId}`;
    return axiosClient.post(url);
  },

  deleteFriend: userId => {
    const url = `${BASE_URL}/${userId}`;
    return axiosClient.delete(url);
  },

  fetchFriendRequests: () => {
    const url = `${BASE_URL}/invites`;
    return axiosClient.get(url);
  },

  deleteFriendRequest: userId => {
    const url = `${BASE_URL}/invites/${userId}`;
    return axiosClient.delete(url);
  },

  fetchMyFriendRequests: () => {
    const url = `${BASE_URL}/invites/me`;
    return axiosClient.get(url);
  },

  addFriendRequest: userId => {
    const url = `${BASE_URL}/invites/me/${userId}`;
    return axiosClient.post(url);
  },

  deleteMyFriendRequest: userId => {
    const url = `${BASE_URL}/invites/me/${userId}`;
    return axiosClient.delete(url);
  },

  fetchFriendSuggests: params => {
    return axiosClient.get(`${BASE_URL}/suggest`, {params});
  },
};

export default friendApi;
