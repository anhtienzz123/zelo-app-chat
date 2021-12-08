import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const KEY = 'CALL-VIDEO';

const callVideoSlice = createSlice({
    name: KEY,
    initialState: {},
    reducers: {},
    extraReducers: {},
});

const { reducer, actions } = callVideoSlice;

export default reducer;
