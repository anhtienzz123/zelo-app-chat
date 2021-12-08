import axios from 'axios';
import queryString from 'query-string';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {AsyncStorage} from 'react-native';
// import config from "../config";
import {REACT_APP_API_URL} from '../constants';
import commonFuc, {logout} from '../utils/commonFuc';
import {disconnect} from '../utils/socketClient';

const axiosClient = axios.create({
  baseURL: REACT_APP_API_URL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  response => {
    if (response && response.data) {
      const {code, auto} = response.data;

      if (code === 401) {
        if (auto === 'yes') {
          return refreshToken().then(async response => {
            const {token} = response.data;
            await AsyncStorage.setItem('token', token);
            axiosClient.setToken(token);

            const config = response.config;
            config.headers['x-access-token'] = token;
            config.baseURL = REACT_APP_API_URL;
            return axiosClient(config);
          });
        }
      }

      return response.data;
    }
    return response;
  },

  error => {
    console.error(error.response);

    if (error.response.status === 401) {
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('refreshToken');
      AsyncStorage.removeItem('userId');
      disconnect();
      commonFuc.notifyMessage('Phiên hết hạn, vui lòng đăng nhập lại');
    }
    throw error;
  },
);

async function refreshToken() {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  return axiosClient.post('/auth/refresh-token', {
    refreshToken,
  });
}

export default axiosClient;
