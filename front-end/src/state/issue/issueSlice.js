import { createSlice } from "@reduxjs/toolkit";
import { commentoInsert, getIssues, issueChangeStatus, issueInsert } from "./issueAction";

const initialState = {
    issue: [],
    selectedIssue: null,
    issueFiltered: null,
    issueLoaded: false,
    loadingIssue: false,
}

const issueSlice = createSlice({
    name: "issue",
    initialState,
    reducers: {
        setSelectedIssue: (state, action) => {
            state.selectedIssue = action.payload;
        },
        setIssueFiltered: (state, action) => {
            state.issueFiltered = action.payload;
        },
        clearSelectedIssue: (state) => {
            state.selectedIssue = null;
        },
        clearLoadingIssue: (state) => {
            state.loadingIssue = false;
        },
        clearAlertForCreateIssue: (state) => {
            state.issueLoaded = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getIssues.fulfilled, (state, action) => {
            state.issue = action.payload;
        });
        builder.addCase(issueInsert.fulfilled, (state, action) => {
            state.issueLoaded = true;
            state.issue = [...state.issue, action.payload];
            state.loadingIssue = false;
        });
        builder.addCase(issueInsert.pending, (state) => {
            state.loadingIssue = true;
        });
        builder.addCase(issueInsert.rejected, (state) => {
            state.loadingIssue = false;
        });
        builder.addCase(issueChangeStatus.fulfilled, (state, action) => {
            if (state.issue) {
                state.issue = state.issue.map(item => {
                    if (item.id_issue === action.payload.id_issue) {
                        return {
                            ...action.payload,
                            commenti: item.commenti
                        };
                    }
                    return item;
                });
            }
        });
        builder.addCase(commentoInsert.fulfilled, (state, action) => {
            state.selectedIssue = action.payload;

            if (state.issue) {
                state.issue = state.issue.map(item =>
                    item.id_issue === action.payload.id_issue ? action.payload : item
                );
            }
        });
    }
});

export const {
    setSelectedIssue,
    clearSelectedIssue,
    setIssueFiltered,
    clearLoadingIssue,
    clearAlertForCreateIssue
} = issueSlice.actions;

export default issueSlice;