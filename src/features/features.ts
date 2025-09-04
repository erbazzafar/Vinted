import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatSelectedProduct: null,
    userLoggedIn: false,
    userToken: null,
};

export const featuresSlice = createSlice({
    name: "features",
    initialState,
    reducers: {
        updateChatSelectedProduct: (state, action) => {
            state.chatSelectedProduct = action.payload;
        },
        updateUserLoggedIn: (state, action) => {
            state.userLoggedIn = action.payload;
        },
        updateUserToken: (state, action) => {
            state.userToken = action.payload;
        }
    }
});

export const {
    updateChatSelectedProduct,
    updateUserLoggedIn,
    updateUserToken
} = featuresSlice.actions;

export const featuresReducers = featuresSlice.reducer;