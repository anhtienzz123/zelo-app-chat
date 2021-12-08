import axiosClient from './axiosClient';

const API_URL = '/messages';

const mediaApi = {
    fetchAllMedia: (
        conversationId,
        type = 'ALL',
        senderId,
        startTime,
        endTime
    ) => {
        return axiosClient.get(`${API_URL}/${conversationId}/files`, {
            params: {
                type,
                senderId,
                startTime,
                endTime,
            },
        });
    },
};

export default mediaApi;
