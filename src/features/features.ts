import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatSelectedProduct: null
};

export const featuresSlice = createSlice({
    name: "features",
    initialState,
    reducers: {
        updateChatSelectedProduct: (state, action) => {
            state.chatSelectedProduct = action.payload;
        }
    }
});

export const {
    updateChatSelectedProduct
} = featuresSlice.actions;

export const featuresReducers = featuresSlice.reducer;