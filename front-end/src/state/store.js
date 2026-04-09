import { configureStore } from '@reduxjs/toolkit'
import userSlice from './user/userSlice'
import issueSlice from './issue/issueSlice'
import { logger } from 'redux-logger'
import appSlice from './appStatus/appStatusSlice'

export const appReducer = {
    appState: appSlice.reducer,
    userState: userSlice.reducer,
    issueState: issueSlice.reducer

}

export const store = configureStore({
    reducer: appReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([logger])
})