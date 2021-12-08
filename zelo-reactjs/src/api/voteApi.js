import axiosClient from './axiosClient';

const API_URL = '/votes';

const voteApi = {
    createVote: (content, options, conversationId) => {
        return axiosClient.post(`${API_URL}`, {
            content,
            options,
            conversationId,
        });
    },

    addVote: (messageId, options) => {
        return axiosClient.post(`${API_URL}/${messageId}`, {
            options,
        });
    },

    deleteVote: (messageId, options) => {
        return axiosClient.delete(`${API_URL}/${messageId}`, {
            options,
        });
    },

    selectVote: (messageId, options) => {
        return axiosClient.post(`${API_URL}/${messageId}/choices`, {
            options,
        });
    },

    deleteSelect: (messageId, options) => {
        return axiosClient.delete(`${API_URL}/${messageId}/choices`, {
            data: {
                options,
            },
        });
    },
    getVotes: (conversationId, page, size) => {
        return axiosClient.get(`${API_URL}/${conversationId}/`, {
            params: {
                page,
                size,
            },
        });
    },
};

export default voteApi;
