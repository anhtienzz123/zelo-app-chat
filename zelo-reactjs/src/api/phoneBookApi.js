import axiosClient from './axiosClient';

const BASE_URL = '/me/phone-books';

const phoneBookApi = {
    fetchPhoneBook: () => {
        return axiosClient.get(`${BASE_URL}`);
    },
};

export default phoneBookApi;
