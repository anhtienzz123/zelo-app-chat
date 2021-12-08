import axiosClient from './axiosClient';

const API_URL = '/messages';

const messageApi = {
    fetchListMessages: (conversationId, page, size) => {
        return axiosClient.get(`${API_URL}/${conversationId}`, {
            params: {
                page,
                size,
            },
        });
    },

    sendTextMessage: (message) => {
        return axiosClient.post(`${API_URL}/text`, message);
    },

    sendFileThroughMessage: (file, attachInfo, cb) => {
        const { type, conversationId, channelId } = attachInfo;

        const config = {
            params: {
                type,
                conversationId,
                channelId,
            },
            onUploadProgress: function (progressEvent) {
                let percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                cb(percentCompleted);
            },
        };

        return axiosClient.post(`${API_URL}/files`, file, config);
    },

    redoMessage: (idMessage) => {
        return axiosClient.delete(`${API_URL}/${idMessage}`);
    },
    deleteMessageClientSide: (idMessage) => {
        return axiosClient.delete(`${API_URL}/${idMessage}/only`);
    },

    dropReaction: (idMessage, type) => {
        return axiosClient.post(`${API_URL}/${idMessage}/reacts/${type}`);
    },

    forwardMessage: (messageId, conversationId) => {
        return axiosClient.post(
            `${API_URL}/${messageId}/share/${conversationId}`
        );
    },
};

export default messageApi;
