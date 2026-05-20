import { createAsyncThunk } from "@reduxjs/toolkit";
import { getIssue, insertIssue, insertCommento } from "../../api/api";


export const getIssues = createAsyncThunk("getIssue", async (req, { rejectWithValue }) => {
    try {
        const response = await getIssue()
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const issueInsert = createAsyncThunk("issueInsert", async (req, { rejectWithValue }) => {
    try {
        const response = await insertIssue(req)
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const commentoInsert = createAsyncThunk("commentoInsert", async (req, { rejectWithValue }) => {
    try {
        return (await insertCommento(req)).data
    } catch (error) {
        return rejectWithValue(error)
    }
})

