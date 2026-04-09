import { createSlice, } from "@reduxjs/toolkit";

const initialState = {
    error: null
}

const appSlice = createSlice({
    name: "appStatus",
    initialState,
    reducers: {
        setAppError: (state, action) => {
            state.error = action.payload
        },
    }
})

export const { setAppError } = appSlice.actions;
export default appSlice