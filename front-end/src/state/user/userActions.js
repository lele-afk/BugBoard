import { createAsyncThunk } from "@reduxjs/toolkit";
import { insertCommento, loginUser, registrationUser, sendMailApi } from "../../api/api";

export const userLogin = createAsyncThunk("loginUser", async (req, { rejectWithValue }) => {
    try {
        const response = await loginUser(req);
        return {
            idUtente: response.data.idUser,
            email: response.data.email,
            nome: response.data.nome,
            cognome: response.data.cognome,
            password: response.data.hashedPassword,
            token: response.data.jwtToken,
            role: response.data.role
        }
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const userRegistration = createAsyncThunk("registrationUser", async (req, { rejectWithValue }) => {
    try {
        await registrationUser(req)
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

export const sendMail = createAsyncThunk("sendMail", async (req, { rejectWithValue }) => {
    try {
        const response = await sendMailApi(req)
        return {
            email: req.email,
            password: req.password,
            codeVerification: response.data.codeVerification
        };
    } catch (error) {
        return rejectWithValue(error)
    }

})