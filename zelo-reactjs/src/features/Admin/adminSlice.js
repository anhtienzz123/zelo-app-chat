import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import adminApi from 'api/adminApi';

const KEY = 'ADMIN';

const adminSlice = createSlice({
    name: KEY,
    initialState: {
        isLoading: false,
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
    extraReducers: {},
});

const { reducer, actions } = adminSlice;
export const { setLoading } = actions;

export default reducer;
