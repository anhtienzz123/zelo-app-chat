import axiosClient from './axiosClient';

const API_URL = '/friends';

const friendApi = {
    fetchFriends: (name) => {
        return axiosClient.get(`${API_URL}`, {
            params: {
                name,
            },
        });
    },
    acceptRequestFriend: (userId) => {
        return axiosClient.post(`${API_URL}/${userId}`);
    },

    deleteFriend: (userId) => {
        return axiosClient.delete(`${API_URL}/${userId}`);
    },

    fetchListRequestFriend: () => {
        return axiosClient.get(`${API_URL}/invites`);
    },

    deleteRequestFriend: (userId) => {
        return axiosClient.delete(`${API_URL}/invites/${userId}`);
    },

    sendRequestFriend: (userId) => {
        return axiosClient.post(`${API_URL}/invites/me/${userId}`);
    },

    deleteSentRequestFriend: (userId) => {
        return axiosClient.delete(`${API_URL}/invites/me/${userId}`);
    },

    fetchMyRequestFriend: () => {
        return axiosClient.get(`${API_URL}/invites/me`);
    },
    fetchSuggestFriend: (page = 0, size = 12) => {
        return axiosClient.get(`${API_URL}/suggest`, {
            params: {
                page,
                size,
            },
        });
    },
};

export default friendApi;
