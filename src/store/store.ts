import { configureStore } from "@reduxjs/toolkit";
import { featuresReducers } from "@/features/features";

export const store = configureStore({
    reducer: featuresReducers
});