import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {friendApi, userApi} from '../api';
import {friendType} from '../constants';

const KEY = 'friend';

const initialState = {
  isLoading: false,
  listFriends: [],
  searchFriend: {},
  friendRequests: [],
  myFriendRequests: [],
  friendSuggests: [],
};

export const fetchFriends = createAsyncThunk(
  `${KEY}/fetchFriends`,
  async (params, thunkApi) => {
    const data = await friendApi.fetchFriends(params);
    return data;
  },
);
export const fetchFriendRequests = createAsyncThunk(
  `${KEY}/fetchFriendRequest`,
  async (params, thunkApi) => {
    const data = await friendApi.fetchFriendRequests();
    return data;
  },
);
export const fetchMyFriendRequests = createAsyncThunk(
  `${KEY}/fetchMyFriendRequest`,
  async (params, thunkApi) => {
    const data = await friendApi.fetchMyFriendRequests();
    return data;
  },
);
export const fetchFriendById = createAsyncThunk(
  `${KEY}/fetchFriendById`,
  async (params, thunkApi) => {
    const {userId} = params;
    const data = await userApi.fetchUserById(userId);
    return data;
  },
);
export const fetchFriendSuggests = createAsyncThunk(
  `${KEY}/fetchFriendSuggests`,
  async (params, thunkApi) => {
    const data = await friendApi.fetchFriendSuggests(params);
    return data;
  },
);

const friendSlice = createSlice({
  name: KEY,
  initialState,

  reducers: {
    // thay doi state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSearchFriend: (state, action) => {
      state.searchFriend = action.payload;
    },
    updateFriendStatus: (state, action) => {
      const oldSearchFriend = state.searchFriend;
      const status = action.payload;
      const newSearchFriend = {...oldSearchFriend, status};
      state.searchFriend = newSearchFriend;
    },

    addNewFriendRequest: (state, action) => {
      const myOldFriendRequests = state.myFriendRequests;
      const newFriendRequest = state.searchFriend;
      const myNewFriendRequests = [...myOldFriendRequests, newFriendRequest];
      state.myFriendRequests = myNewFriendRequests;
    },

    cancelMyFriendRequest: (state, action) => {
      const {userId, type} = action.payload;
      const myOldFriendRequests = state.myFriendRequests;
      // delete request from list
      const myNewFriendRequests = myOldFriendRequests.filter(
        requestEle => requestEle._id !== userId,
      );
      state.myFriendRequests = myNewFriendRequests;
      state.searchFriend.status = type
        ? friendType.FRIEND
        : friendType.NOT_FRIEND;
    },

    deleteFriendRequest: (state, action) => {
      const userId = action.payload;
      const oldFriendRequests = state.friendRequests;
      // delete request from list
      const newFriendRequests = oldFriendRequests.filter(
        requestEle => requestEle._id !== userId,
      );
      state.friendRequests = newFriendRequests;
      state.searchFriend.status = friendType.NOT_FRIEND;
    },

    inviteFriendRequest: (state, action) => {
      const details = action.payload;
      const oldFriendRequests = state.friendRequests;
      state.friendRequests = [...oldFriendRequests, details];
      state.searchFriend.status = friendType.FOLLOWER;
    },

    resetFriendSlice: (state, action) => {
      Object.assign(state, initialState);
    },

    deleteFriend: (state, action) => {
      const userId = action.payload;
      const oldFriends = state.listFriends;
      // delete from list
      const newFriends = oldFriends.filter(
        requestEle => requestEle._id !== userId,
      );
      state.listFriends = newFriends;
      state.searchFriend.status = friendType.NOT_FRIEND;
    },
  },
  // xu ly api roi thay doi state
  extraReducers: {
    // TODO:========================== fetchFriends ==========================
    // Đang xử lý
    [fetchFriends.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchFriends.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.listFriends = action.payload;
    },
    // Xử lý khi bị lỗi
    [fetchFriends.rejected]: (state, action) => {
      state.isLoading = false;
    },

    // TODO:========================== fetchFriendRequests ==========================
    // Đang xử lý
    [fetchFriendRequests.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchFriendRequests.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.friendRequests = action.payload;
    },
    // Xử lý khi bị lỗi
    [fetchFriendRequests.rejected]: (state, action) => {
      state.isLoading = false;
    },

    // TODO:========================== fetchMyFriendRequests ==========================
    // Đang xử lý
    [fetchMyFriendRequests.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchMyFriendRequests.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.myFriendRequests = action.payload;
    },
    // Xử lý khi bị lỗi
    [fetchMyFriendRequests.rejected]: (state, action) => {
      state.isLoading = false;
    },

    // TODO:========================== fetchFriendById ==========================
    // Đang xử lý
    [fetchFriendById.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchFriendById.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.searchFriend = action.payload;
    },
    // Xử lý khi bị lỗi
    [fetchFriendById.rejected]: (state, action) => {
      state.isLoading = false;
    },

    // TODO:========================== fetchFriendSuggests ==========================
    // Đang xử lý
    [fetchFriendSuggests.pending]: (state, action) => {
      state.isLoading = true;
    },
    // Xử lý khi thành công
    [fetchFriendSuggests.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.friendSuggests = action.payload;
    },
    // Xử lý khi bị lỗi
    [fetchFriendSuggests.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});

const {reducer, actions} = friendSlice;
export const {
  setLoading,
  setSearchFriend,
  updateFriendStatus,
  addNewFriendRequest,
  cancelMyFriendRequest,
  deleteFriendRequest,
  inviteFriendRequest,
  resetFriendSlice,
  deleteFriend,
} = actions;
export default reducer;
