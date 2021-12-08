import axiosClient from './axiosClient';

const API_URL = '/conversations';

const conversationApi = {
    fetchListConversations: (name, type) => {
        return axiosClient.get(API_URL, {
            params: {
                name,
                type,
            },
        });
    },

    // [POST] /individuals/:userId

    createConversationIndividual: (userId) => {
        return axiosClient.post(`${API_URL}/individuals/${userId}`);
    },

    createGroup: (name, userIds) => {
        return axiosClient.post(`${API_URL}/groups`, {
            name,
            userIds,
        });
    },

    getConversationById: (id) => {
        return axiosClient.get(`${API_URL}/${id}`);
    },

    deleteConversation: (id) => {
        return axiosClient.delete(`${API_URL}/${id}`);
    },

    getMemberInConversation: (id) => {
        return axiosClient.get(`${API_URL}/${id}/members`);
    },

    addMembersToConver: (userIds, coversationIds) => {
        return axiosClient.post(`${API_URL}/${coversationIds}/members`, {
            userIds,
        });
    },

    leaveGroup: (conversationId) => {
        return axiosClient.delete(`${API_URL}/${conversationId}/members/leave`);
    },

    deleteMember: (conversationId, userId) => {
        return axiosClient.delete(
            `${API_URL}/${conversationId}/members/${userId}`
        );
    },
    changeNameConversation: (conversationId, name) => {
        return axiosClient.patch(`${API_URL}/${conversationId}/name`, {
            name,
        });
    },
    getLastViewOfMembers: (conversationId) => {
        return axiosClient.get(`${API_URL}/${conversationId}/last-view`);
    },

    getSummaryInfoGroup: (conversationId) => {
        return axiosClient.get(`${API_URL}/${conversationId}/summary`);
    },
    joinGroupFromLink: (conversationId) => {
        return axiosClient.post(
            `${API_URL}/${conversationId}/members/join-from-link`
        );
    },
    changeStatusForGroup: (conversationId, isStatus) => {
        return axiosClient.patch(
            `${API_URL}/${conversationId}/join-from-link/${isStatus}`
        );
    },

    changAvatarGroup: (conversationId, file) => {
        return axiosClient.patch(`${API_URL}/${conversationId}/avatar`, file);
    },
    addManagerGroup: (converId, userIds) => {
        return axiosClient.post(`${API_URL}/${converId}/managers`, {
            managerIds: userIds,
        });
    },

    deleteManager: (converId, userIds) => {
        return axiosClient.delete(`${API_URL}/${converId}/managers`, {
            data: {
                managerIds: userIds,
            },
        });
    },
};

export default conversationApi;
