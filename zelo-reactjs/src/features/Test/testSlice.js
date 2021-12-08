import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import conversationApi from 'api/conversationApi';
import messageApi from 'api/messageApi';

const KEY = 'chat';

export const fetchListConversations = createAsyncThunk(
    `${KEY}/fetchListConversations`,
    async (params, thunkApi) => {
        const conversations = await conversationApi.fetchListConversations();
        return conversations;
    }
);

export const fetchListMessages = createAsyncThunk(
    `${KEY}/fetchListMessages`,
    async (params, thunkApi) => {
        const { conversationId } = params;
        const messages = await messageApi.fetchListMessages(conversationId);

        return messages;
    }
);

const chatSlice = createSlice({
    name: KEY,
    initialState: {
        isLoading: false,
        conversations: [],
        messages: [],
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
    },
    extraReducers: {
        [fetchListConversations.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchListConversations.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.conversations = action.payload;
        },
        [fetchListMessages.pending]: (state, action) => {
            state.isLoading = true;
        },
        [fetchListMessages.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.messages = action.payload;
        },
    },
});

const { reducer, actions } = chatSlice;
export const { addMessage } = actions;

export default reducer;
