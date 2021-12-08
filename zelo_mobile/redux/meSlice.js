import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {meApi} from '../api';

const KEY = 'me';

const initialState = {
  isLoading: false,
  userProfile: {},
  phoneBooks: [],
};

export const fetchProfile = createAsyncThunk(
  `${KEY}/fetchProfile`,
  async () => {
    const data = await meApi.fetchProfile();
    return data;
  },
);

export const fetchSyncContacts = createAsyncThunk(
  `${KEY}/fetchSyncContacts`,
  async () => {
    const data = await meApi.fetchSyncContacts();
    return data;
  },
);

// export const fetchProfile = createAsyncThunk(
// 	`${KEY}/fetchProfile`,
// 	async (params, thunkApi) => {
// 		const data = await meApi.fetchProfile();
// 		return data;
// 	}
// );

const meSlice = createSlice({
  name: KEY,
  initialState,

  reducers: {
    // thay doi state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    resetMeSlice: (state, action) => {
      Object.assign(state, initialState);
    },
    updateImage: (state, action) => {
      const {isCoverImage, uri} = action.payload;
      const oldProfile = state.userProfile;
      let newProfile;
      if (isCoverImage) {
        newProfile = {...oldProfile, coverImage: uri};
      } else {
        newProfile = {...oldProfile, avatar: uri};
      }
      state.userProfile = newProfile;
    },
  },
  // xu ly api roi thay doi state
  extraReducers: {
    // TODO:<=========================== fetchProfile ===========================>
    // Đang xử lý
    [fetchProfile.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchProfile.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.userProfile = action.payload;
    },
    // Xử lý khi bị lỗi
    [fetchProfile.rejected]: (state, action) => {
      state.isLoading = false;
    },

    // TODO:<=========================== fetchSyncContacts ===========================>
    // Đang xử lý
    [fetchSyncContacts.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchSyncContacts.fulfilled]: (state, action) => {
      state.isLoading = false;

      const phoneBooks = [...action.payload].sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      state.phoneBooks = phoneBooks;
    },
    // Xử lý khi bị lỗi
    [fetchSyncContacts.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});

const {reducer, actions} = meSlice;
export const {setLoading, resetMeSlice, updateImage} = actions;
export default reducer;
