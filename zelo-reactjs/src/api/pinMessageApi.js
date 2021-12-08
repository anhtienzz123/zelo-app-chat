import axiosClient from './axiosClient';

const API_URL = '/pin-messages';

const pinMessageApi = {
    getPinMessages: (conversationId) => {
        return axiosClient.get(`${API_URL}/${conversationId}`);
    },

    pinMessage: (messageId) => {
        return axiosClient.post(`${API_URL}/${messageId}`);
    },

    removePinMessage: (messageId) => {
        return axiosClient.delete(`${API_URL}/${messageId}`);
    },
};

export default pinMessageApi;
