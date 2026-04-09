import { createSlice, } from "@reduxjs/toolkit";
import { commentoInsert, getIssues, issueInsert } from "./issueAction";

const initialState = {
    issue: null,
    selectedissue: null,
    issueFiltered: null
}

const issueSlice = createSlice({
    name: "issue",
    initialState,
    reducers: {
        setSelectedIssue: (state, action) => {
            state.selectedissue = action.payload
        },
        setiIssueFiltered: (state, action) => {
            state.issueFiltered = action.payload
        },
        clearSelectediIssue: (state) => {
            state.selectedissue = null;
        },
        clearLoadingIssue: (state) => {
            state.loadingissue = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getIssues.fulfilled, (state, action) => {
            state.issue = action.payload.issues
            state.totalissue = action.payload.issues.length
        });
        builder.addCase(issueInsert.fulfilled, (state, action) => {
            state.loadingissue = true
            state.issue = [...state.issue, ...action.payload]
        })
        builder.addCase(commentoInsert.fulfilled, (state, action) => {
            state.selectedissue = action.payload
        })
    }
})

export const { setSelectedissue, clearSelectedissue, setissueFiltered, clearLoadingissue } = issueSlice.actions;
export default issueSlice