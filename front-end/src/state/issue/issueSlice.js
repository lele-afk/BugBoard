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
        setIssueFiltered: (state, action) => {
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
            console.log('action.payload :>> ', action.payload);
            state.issue = action.payload
        });
        builder.addCase(issueInsert.fulfilled, (state, action) => {
            state.issue = [...state.issue, action.payload];
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

export const { setSelectedissue, clearSelectedissue, setissueFiltered, clearLoadingissue } = issueSlice.actions;
export default issueSlice