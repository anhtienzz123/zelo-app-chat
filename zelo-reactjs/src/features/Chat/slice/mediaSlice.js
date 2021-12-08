import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import mediaApi from 'api/mediaApi';
const KEY = 'MEDIA';

export const fetchAllMedia = createAsyncThunk(
    `${KEY}/fetchAllMedia`,
    async (params, thunkApi) => {
        const { conversationId } = params;
        const media = await mediaApi.fetchAllMedia(conversationId);
        return media;
    }
);

export const fetchMediaByType = createAsyncThunk(
    `${KEY}/fetchMediaByType`,
    async (params, thunkApi) => {}
);

const mediaSlice = createSlice({
    name: KEY,
    initialState: {
        media: {},
        isLoading: false,
    },
    reducers: {},
    extraReducers: {
        [fetchAllMedia.fulfilled]: (state, action) => {
            state.media = action.payload;
        },
    },
});

const { reducer, actions } = mediaSlice;
//export const { setLoading } = actions;

export default reducer;
