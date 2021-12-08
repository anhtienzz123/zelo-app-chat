import axiosClient from './axiosClient';

const BASE_URL = '/channels';

const channelApi = {
  fetchChannels: conversationId => {
    const url = `${BASE_URL}/${conversationId}`;
    return axiosClient.get(url);
  },

  fetchMessages: (channelId, params) => {
    const url = `/messages/channel/${channelId}`;
    return axiosClient.get(url, {params});
  },

  createChannel: (name, conversationId) => {
    return axiosClient.post(BASE_URL, {name, conversationId});
  },

  updateChannel: (name, _id) => {
    return axiosClient.put(BASE_URL, {name, _id});
  },

  deleteChannel: channelId => {
    const url = `${BASE_URL}/${channelId}`;
    return axiosClient.delete(url);
  },

  fetchLastView: channelId => {
    const url = `${BASE_URL}/${channelId}/last-view`;
    return axiosClient.get(url);
  },
};

export default channelApi;
