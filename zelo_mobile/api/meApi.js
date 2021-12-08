import axiosClient from './axiosClient';

const BASE_URL = '/me';

const meApi = {
  fetchProfile: () => {
    return axiosClient.get(`${BASE_URL}/profile`);
  },

  updateProfile: profile => {
    const url = `${BASE_URL}/profile`;
    return axiosClient.put(url, profile);
  },

  updateAvatar: image => {
    const url = `${BASE_URL}/avatar`;
    return axiosClient.patch(url, image);
  },

  updateCoverImage: image => {
    const url = `${BASE_URL}/cover-image`;
    return axiosClient.patch(url, image);
  },

  fetchSyncContacts: () => {
    return axiosClient.get(`${BASE_URL}/phone-books`);
  },

  syncContacts: phones => {
    const url = `${BASE_URL}/phone-books`;
    return axiosClient.post(url, {phones});
  },

  changePassword: (oldPassword, newPassword) => {
    const url = `${BASE_URL}/password`;
    return axiosClient.patch(url, {oldPassword, newPassword});
  },

  logoutAllDevice: (password, key) => {
    const url = `${BASE_URL}/revoke-token`;
    return axiosClient.delete(url, {data: {password, key}});
  },

  updateAvatarBase64: (image, uploadProgress) => {
    const url = `${BASE_URL}/avatar/base64`;

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

  updateCoverImageBase64: (image, uploadProgress) => {
    const url = `${BASE_URL}/cover-image/base64`;

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
};

export default meApi;
