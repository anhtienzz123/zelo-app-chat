import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import friendApi from 'api/friendApi';
import conversationApi from 'api/conversationApi';
import phoneBookApi from 'api/phoneBookApi';
const KEY = 'friend';

export const fetchListRequestFriend = createAsyncThunk(
    `${KEY}/fetchListRequestFriend`,
    async (params, thunkApi) => {
        const data = await friendApi.fetchListRequestFriend();
        return data;
    }
);

export const fetchListMyRequestFriend = createAsyncThunk(
    `${KEY}/fetchListMyRequestFriend`,
    async (params, thunkApi) => {
        const data = await friendApi.fetchMyRequestFriend();
        return data;
    }
);

export const fetchFriends = createAsyncThunk(
    `${KEY}/fetchFriends`,
    async (params, thunkApi) => {
        const { name } = params;
        const data = await friendApi.fetchFriends(name);
        return data;
    }
);
export const fetchListGroup = createAsyncThunk(
    `${KEY}/fetchListGroup`,
    async (param, thunkApi) => {
        const { name, type } = param;
        const data = await conversationApi.fetchListConversations(name, type);
        return data;
    }
);

export const fetchPhoneBook = createAsyncThunk(
    `${KEY}/fetchPhoneBook`,
    async (param, thunkApi) => {
        const data = await phoneBookApi.fetchPhoneBook();
        return data;
    }
);

export const fetchSuggestFriend = createAsyncThunk(
    `${KEY}/fetchSuggestFriend`,
    async (params, thunkApi) => {
        const data = await friendApi.fetchSuggestFriend();
        return data;
    }
);

const friendSlice = createSlice({
    name: KEY,
    initialState: {
        isLoading: false,
        requestFriends: [],
        myRequestFriend: [],
        friends: [],
        groups: [],
        amountNotify: 0,
        phoneBook: [],
        suggestFriends: [],
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setNewFriend: (state, action) => {
            const newFriend = action.payload;
            state.friends = [newFriend, ...state.friends];
        },
        setNewRequestFriend: (state, action) => {
            const newRequestFriend = action.payload;
            state.requestFriends = [newRequestFriend, ...state.requestFriends];
        },

        setGroup: (state, action) => {
            const conversationId = action.payload;
            const newGroup = state.groups.filter(
                (ele) => ele._id !== conversationId
            );
            state.groups = newGroup;
        },
        setMyRequestFriend: (state, action) => {
            state.myRequestFriend = state.myRequestFriend.filter(
                (ele) => ele._id !== action.payload
            );
        },
        setAmountNotify: (state, action) => {
            state.amountNotify = action.payload;
        },
        updateSuggestFriend: (state, action) => {
            state.suggestFriends = action.payload;
        },
        updateFriend: (state, action) => {
            const id = action.payload;
            state.friends = state.friends.filter((ele) => ele._id !== id);
        },

        updateRequestFriends: (state, action) => {
            const id = action.payload;
            state.requestFriends = state.requestFriends.filter(
                (ele) => ele._id !== id
            );
        },
        updateMyRequestFriend: (state, action) => {
            const id = action.payload;
            state.myRequestFriend = state.myRequestFriend.filter(
                (ele) => ele._id !== id
            );
        },
    },
    extraReducers: {
        [fetchListRequestFriend.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.requestFriends = action.payload;
            state.amountNotify = action.payload.length;
        },
        [fetchListRequestFriend.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchListRequestFriend.rejected]: (state, action) => {
            state.isLoading = false;
        },

        [fetchListMyRequestFriend.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.myRequestFriend = action.payload;
        },

        [fetchListMyRequestFriend.pending]: (state, action) => {
            state.isLoading = true;
        },

        [fetchListMyRequestFriend.rejected]: (state, action) => {
            state.isLoading = false;
        },

        [fetchFriends.fulfilled]: (state, action) => {
            state.friends = action.payload;
            state.isLoading = false;
        },

        [fetchFriends.rejected]: (state, action) => {
            state.isLoading = false;
        },

        [fetchFriends.pending]: (state, action) => {
            state.isLoading = true;
        },

        [fetchListGroup.fulfilled]: (state, action) => {
            state.groups = action.payload;
            state.isLoading = false;
        },

        [fetchListGroup.rejected]: (state, action) => {
            state.isLoading = false;
        },

        [fetchListGroup.pending]: (state, action) => {
            state.isLoading = true;
        },

        [fetchPhoneBook.fulfilled]: (state, action) => {
            state.phoneBook = action.payload;
            state.isLoading = false;
        },

        [fetchPhoneBook.rejected]: (state, action) => {
            state.isLoading = false;
        },

        [fetchPhoneBook.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchSuggestFriend.fulfilled]: (state, action) => {
            state.suggestFriends = action.payload;
            state.isLoading = false;
        },

        [fetchSuggestFriend.rejected]: (state, action) => {
            state.isLoading = false;
        },

        [fetchSuggestFriend.pending]: (state, action) => {
            state.isLoading = true;
        },
    },
});

const { reducer, actions } = friendSlice;
export const {
    setLoading,
    setNewFriend,
    setNewRequestFriend,
    setGroup,
    setMyRequestFriend,
    setAmountNotify,
    updateSuggestFriend,
    updateFriend,
    updateMyRequestFriend,
    updateRequestFriends,
} = actions;

export default reducer;
