import axiosClient from './axiosClient';

const API_URL = '/channels';

const channelApi = {
    fetchChannel: (conversationId) => {
        return axiosClient.get(`${API_URL}/${conversationId}`);
    },

    addChannel: (name, conversationId) => {
        return axiosClient.post(`${API_URL}`, {
            name,
            conversationId,
        });
    },

    renameChannel: (name, _id) => {
        return axiosClient.put(`${API_URL}`, {
            _id,
            name,
        });
    },

    deleteChannel: (channelId) => {
        return axiosClient.delete(`${API_URL}/${channelId}`);
    },

    getMessageInChannel: (channelId, page, size) => {
        return axiosClient.get(`/messages/channel/${channelId}`, {
            params: {
                page,
                size,
            },
        });
    },

    getLastViewChannel: (channelId) => {
        return axiosClient.get(`${API_URL}/${channelId}/last-view`);
    },
};

export default channelApi;
