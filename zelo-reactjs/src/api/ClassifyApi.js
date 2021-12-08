import axiosClient from './axiosClient';

const API_URL = '/classifies';

const classifiesApi = {
    getColors: () => {
        return axiosClient.get(`${API_URL}/colors`);
    },
    getClassifies: () => {
        return axiosClient.get(`${API_URL}`);
    },

    addClassify: (name, colorId) => {
        return axiosClient.post(`${API_URL}`, {
            name,
            colorId,
        });
    },

    deleteClassify: (id) => {
        return axiosClient.delete(`${API_URL}/${id}`);
    },

    addClassifyForConversation: (idClassify, idConversation) => {
        return axiosClient.post(
            `${API_URL}/${idClassify}/conversations/${idConversation}`
        );
    },

    removeClassifyFromConversation: (idClassify, idConversation) => {
        return axiosClient.delete(
            `${API_URL}/${idClassify}/conversations/${idConversation}`
        );
    },

    updateClassify: (classifyId, name, colorId) => {
        return axiosClient.put(`${API_URL}/${classifyId}`, {
            name,
            colorId,
        });
    },
};

export default classifiesApi;
