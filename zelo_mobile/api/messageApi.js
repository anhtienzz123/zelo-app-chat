import axiosClient from './axiosClient';

const BASE_URL = '/messages';

const messageApi = {
  fetchMessage: (conversationId, params) => {
    const url = `${BASE_URL}/${conversationId}`;
    return axiosClient.get(url, {params});
  },
  fetchFiles: (conversationId, params) => {
    const url = `${BASE_URL}/${conversationId}/files`;
    return axiosClient.get(url, {params});
  },

  sendMessage: message => {
    const url = `${BASE_URL}/text`;
    return axiosClient.post(url, message);
  },
  deleteMessage: messageId => {
    const url = `${BASE_URL}/${messageId}`;
    return axiosClient.delete(url);
  },
  deleteMessageOnlyMe: messageId => {
    const url = `${BASE_URL}/${messageId}/only`;
    return axiosClient.delete(url);
  },
  addReaction: (messageId, type) => {
    const url = `${BASE_URL}/${messageId}/reacts/${type}`;
    return axiosClient.post(url);
  },

  sendFileBase64Message: (file, params, uploadProgress) => {
    const {type, conversationId, channelId} = params;

    const config = {
      params: {
        type,
        conversationId,
        channelId,
      },

      onUploadProgress: progressEvent => {
        if (typeof uploadProgress === 'function') {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          uploadProgress(percentCompleted);
        }
      },
    };

    return axiosClient.post(`${BASE_URL}/files/base64`, file, config);
  },

  forwardMessage: (messageId, conversationId) => {
    const url = `${BASE_URL}/${messageId}/share/${conversationId}`;
    return axiosClient.post(url);
  },
};

export default messageApi;
