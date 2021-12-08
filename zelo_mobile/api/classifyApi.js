import axiosClient from './axiosClient';

const BASE_URL = '/classifies';

const classifyApi = {
  fetchColors: () => {
    const url = `${BASE_URL}/colors`;
    return axiosClient.get(url);
  },

  fetchClassifies: () => {
    return axiosClient.get(BASE_URL);
  },

  addClassify: classify => {
    return axiosClient.post(BASE_URL, classify);
  },

  updateClassify: (classifyId, classify) => {
    const url = `${BASE_URL}/${classifyId}`;
    return axiosClient.put(url, classify);
  },

  deleteClassify: classifyId => {
    const url = `${BASE_URL}/${classifyId}`;
    return axiosClient.delete(url);
  },

  addConversation: (classifyId, conversationId) => {
    const url = `${BASE_URL}/${classifyId}/conversations/${conversationId}`;
    return axiosClient.post(url);
  },

  deleteOwnFriendRequest: (classifyId, conversationId) => {
    const url = `${BASE_URL}/${classifyId}/conversations/${conversationId}`;
    return axiosClient.delete(url);
  },
};

export default classifyApi;
