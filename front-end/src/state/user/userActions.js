import { createAsyncThunk } from "@reduxjs/toolkit";
import { insertCommento, loginUser, registrationUser, registrationUserWithAuth, sendMailApi } from "../../api/api";

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
        const response = await registrationUser(req);
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const userRegistrationWithAuth = createAsyncThunk("registrationUserWithAuth", async (req, { rejectWithValue }) => {
    try {

        const response = await registrationUserWithAuth(req);
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});


export const commentoInsert = createAsyncThunk("commentoInsert", async (req, { rejectWithValue }) => {
    try {
        return (await insertCommento(req)).data
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const sendMail = createAsyncThunk("sendMail", async (req, { rejectWithValue }) => {
    try {
        const response = await sendMailApi(req);
        return {
            nome: req.nome,
            cognome: req.cognome,
            email: req.email,
            password: req.password,
            verificationCode: response.data.codeVerification
        };
    } catch (error) {
        return rejectWithValue(error);
    }
});