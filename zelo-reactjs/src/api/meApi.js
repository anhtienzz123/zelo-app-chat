import axiosClient from './axiosClient';

const API_URL = '/me';

const meApi = {
    fetchProfile: () => {
        return axiosClient.get(`${API_URL}/profile`);
    },

    updateProfile: (name, dateOfBirth, gender) => {
        return axiosClient.put(`${API_URL}/profile`, {
            name,
            dateOfBirth,
            gender,
        });
    },

    updateAvatar: (file) => {
        return axiosClient.patch(`${API_URL}/avatar`, file);
    },

    updateCoverImage: (file) => {
        return axiosClient.patch(`${API_URL}/cover-image`, file);
    },
    changePasswod: (oldPassword, newPassword) => {
        return axiosClient.patch(`${API_URL}/password`, {
            oldPassword,
            newPassword,
        });
    },
    revokeToken: (password, key) => {
        return axiosClient.delete(`${API_URL}/revoke-token`, {
            data: {
                password,
                key,
            },
        });
    },
};

export default meApi;
