import axiosClient from './axiosClient';

const BASE_URL = '/votes';

const voteApi = {
  addVote: vote => {
    return axiosClient.post(BASE_URL, vote);
  },

  addVoteOption: (messageId, option) => {
    const url = `${BASE_URL}/${messageId}`;
    return axiosClient.post(url, option);
  },

  deleteVoteOption: (messageId, option) => {
    const url = `${BASE_URL}/${messageId}`;
    return axiosClient.delete(url, option);
  },

  selectOption: (messageId, options) => {
    const url = `${BASE_URL}/${messageId}/choices`;
    return axiosClient.post(url, options);
  },

  deleteSelectOption: (messageId, options) => {
    const url = `${BASE_URL}/${messageId}/choices`;
    return axiosClient.delete(url, {data: options});
  },
};

export default voteApi;
