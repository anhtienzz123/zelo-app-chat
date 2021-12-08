import axiosClient from './axiosClient';

const BASE_URL = '/conversations';

const conversationApi = {
  fetchConversations: params => {
    return axiosClient.get(BASE_URL, {params});
  },

  fetchConversation: conversationId => {
    const url = `${BASE_URL}/${conversationId}`;
    return axiosClient.get(url);
  },

  fetchClassifies: classifyId => {
    const url = `${BASE_URL}/classifies/${classifyId}`;
    return axiosClient.get(url);
  },

  addConversation: userId => {
    const url = `${BASE_URL}/individuals/${userId}`;
    return axiosClient.post(url);
  },

  createGroup: (name, userIds) => {
    const url = `${BASE_URL}/groups`;
    return axiosClient.post(url, {name, userIds});
  },

  updateName: (id, name) => {
    const url = `${BASE_URL}/${id}/name`;
    return axiosClient.patch(url, name);
  },

  updateAvatar: (groupId, avatar) => {
    const url = `${BASE_URL}/${groupId}/avatar`;
    return axiosClient.patch(url, avatar);
  },

  updateNotify: (conversationId, isNotify) => {
    const url = `${BASE_URL}/${conversationId}/notify/${isNotify}`;
    return axiosClient.patch(url);
  },

  deleteAllMessage: conversationId => {
    return axiosClient.delete(`${BASE_URL}/${conversationId}/messages`);
  },

  fetchMembers: conversationId => {
    return axiosClient.get(`${BASE_URL}/${conversationId}/members`);
  },

  addMembers: (conversationId, userIds) => {
    return axiosClient.post(`${BASE_URL}/${conversationId}/members`, {userIds});
  },

  deleteMember: (conversationId, userId) => {
    return axiosClient.delete(
      `${BASE_URL}/${conversationId}/members/${userId}`,
    );
  },

  leaveGroup: conversationId => {
    return axiosClient.delete(`${BASE_URL}/${conversationId}/members/leave`);
  },

  deleteGroup: conversationId => {
    return axiosClient.delete(`${BASE_URL}/${conversationId}`);
  },

  updateJoinFromLink: (conversationId, isStatus) => {
    return axiosClient.patch(
      `${BASE_URL}/${conversationId}/join-from-link/${isStatus}`,
    );
  },

  fetchSummary: (conversationId, isStatus) => {
    return axiosClient.get(`${BASE_URL}/${conversationId}/summary`);
  },

  fetchListLastViewer: conversationId => {
    return axiosClient.get(`${BASE_URL}/${conversationId}/last-view`);
  },

  updateAvatarBase64: (groupId, image, uploadProgress) => {
    const url = `${BASE_URL}/${groupId}/avatar/base64`;
    const config = {
      onUploadProgress: progressEvent => {
        if (typeof uploadProgress === 'function') {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          uploadProgress(percentCompleted);
        }
      },
    };
    return axiosClient.patch(url, image, config);
  },

  addManager: (conversationId, managerIds) => {
    return axiosClient.post(`${BASE_URL}/${conversationId}/managers`, {
      managerIds,
    });
  },

  deleteManager: (conversationId, managerIds) => {
    return axiosClient.delete(`${BASE_URL}/${conversationId}/managers`, {
      data: {managerIds},
    });
  },
};

export default conversationApi;
