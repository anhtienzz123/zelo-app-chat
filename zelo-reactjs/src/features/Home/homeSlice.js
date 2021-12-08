import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import InfoWebApi from 'api/infoWebApi';

const KEY = 'HOME';

export const fetchInfoWebs = createAsyncThunk(
    `${KEY}/fetchInfoWebApp`,
    async () => {
        const data = await InfoWebApi.getInfoWeb();
        return data;
    }
);

const homeSlice = createSlice({
    name: KEY,
    initialState: {
        developers: [],
        infoApp: {},
        isLoading: false,
        features: [],
        infoWebApps: {},
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },

    extraReducers: {
        [fetchInfoWebs.fulfilled]: (state, action) => {
            const data = action.payload;
            state.infoWebApps = data.find(
                (ele) => ele.name === 'infoweb'
            ).value;
            state.developers = data.find(
                (ele) => ele.name === 'developers'
            ).value;
            state.infoApp = data.find((ele) => ele.name === 'infoapp').value;
            state.features = data.find((ele) => ele.name === 'features').value;
            state.isLoading = false;
        },

        [fetchInfoWebs.pending]: (state, action) => {
            state.isLoading = true;
        },

        [fetchInfoWebs.rejected]: (state, action) => {
            state.isLoading = false;
        },
    },
});

const { reducer, actions } = homeSlice;
export const { setLoading } = actions;

export default reducer;
