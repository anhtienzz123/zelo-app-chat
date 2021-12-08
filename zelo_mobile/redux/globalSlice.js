import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {stickerApi} from '../api';

const KEY = 'global';

const initialState = {
  isLoading: false,
  isLogin: false,
  modalVisible: false,
  currentUserId: '',
  keyboardHeight: 280,
  stickers: [],
};

export const fetchStickers = createAsyncThunk(
  `${KEY}/fetchStickers`,
  async (params, thunkApi) => {
    const data = await stickerApi.fetchSticker();
    return data;
  },
);

const globalSlice = createSlice({
  name: KEY,
  initialState,

  reducers: {
    // thay doi state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setModalVisible: (state, action) => {
      state.modalVisible = action.payload;
    },
    setCurrentUserId: (state, action) => {
      state.currentUserId = action.payload;
    },
    setKeyboardHeight: (state, action) => {
      let keyboardHeight = 280;
      const keyboardHeightStr = action.payload;
      if (keyboardHeightStr.length > 0) {
        keyboardHeight = parseFloat(keyboardHeightStr);
      }
      state.keyboardHeight = keyboardHeight;
    },
    resetGlobalSlice: (state, action) => {
      Object.assign(state, initialState);
    },
  },
  // xu ly api roi thay doi state
  extraReducers: {
    // TODO:---------------------- fetchStickers ----------------------
    // Đang xử lý
    [fetchStickers.pending]: (state, action) => {
      // state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchStickers.fulfilled]: (state, action) => {
      // state.isLoading = false;
      state.stickers = action.payload;
    },
    // Xử lý khi bị lỗi
    [fetchStickers.rejected]: (state, action) => {
      // state.isLoading = false;
    },
  },
});

const {reducer, actions} = globalSlice;
export const {
  setLoading,
  setLogin,
  setModalVisible,
  setCurrentUserId,
  setKeyboardHeight,
  resetGlobalSlice,
} = actions;
export default reducer;
