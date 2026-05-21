import { createSlice, } from "@reduxjs/toolkit";
import { commentoInsert, getIssues, issueInsert } from "./issueAction";

const initialState = {
    issue: [],
    selectedissue: null,
    issueFiltered: null,
    issueLoaded: false
}

const issueSlice = createSlice({
    name: "issue",
    initialState,
    reducers: {
        setSelectedIssue: (state, action) => {
            state.selectedissue = action.payload
        },
        setIssueFiltered: (state, action) => {
            state.issueFiltered = action.payload
        },
        clearSelectediIssue: (state) => {
            state.selectedissue = null;
        },
        clearLoadingIssue: (state) => {
            state.loadingissue = false;
        },
        clearAlertForCreateIssue: (state) => {
            state.issueLoaded = false;
        },


    },
    extraReducers: (builder) => {
        builder.addCase(getIssues.fulfilled, (state, action) => {
            state.issue = action.payload
        });
        builder.addCase(issueInsert.fulfilled, (state, action) => {
            state.issueLoaded = true
            state.issue = [...state.issue, action.payload];
            state.loadingIssue = false;
        })
        builder.addCase(issueInsert.pending, (state) => {
            // Quando la chiamata parte, il loading va a true
            state.loadingIssue = true;
        })
        builder.addCase(issueInsert.rejected, (state) => {
            // Se fallisce, spegniamo il loading
            state.loadingIssue = false;
        })
        builder.addCase(commentoInsert.fulfilled, (state, action) => {
            state.selectedIssue = action.payload
        })
    }
})

export const {
    setSelectedIssue,
    clearSelectedIssue,
    setIssueFiltered,
    clearLoadingIssue,
    clearAlertForCreateIssue
} = issueSlice.actions;
export default issueSlice