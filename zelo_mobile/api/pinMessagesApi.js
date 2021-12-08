import axiosClient from './axiosClient';

const BASE_URL = '/pin-messages';

const pinMessagesApi = {
  fetchPinMessages: conversationId => {
    const url = `${BASE_URL}/${conversationId}`;
    return axiosClient.get(url);
  },

  addPinMessage: messageId => {
    const url = `${BASE_URL}/${messageId}`;
    return axiosClient.post(url);
  },

  deletePinMessage: messageId => {
    const url = `${BASE_URL}/${messageId}`;
    return axiosClient.delete(url);
  },
};

export default pinMessagesApi;
