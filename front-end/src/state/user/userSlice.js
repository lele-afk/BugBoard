import { createSlice } from "@reduxjs/toolkit";
import { sendMail, userLogin, userRegistration } from "./userActions";

const initialState = {
    idUtente: null,
    nome: '',
    cognome: '',
    email: '',
    password: '',
    codeVerification: '',
    isAdmin: '',
    logged: false,
    registrationSuccess: false
}
const userSlice = createSlice({
    name: "utente",
    initialState,
    reducers: {
        resetState: () => {
            localStorage.clear()
            return initialState
        },
        resetRegistrationFlag: (state, action) => {
            state.registrationSuccess = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(userLogin.fulfilled, (state, action) => {
            state.idUtente = action.payload.idUtente
            state.email = action.payload.email
            state.nome = action.payload.nome
            state.cognome = action.payload.cognome
            state.password = action.payload.password
            state.isAdmin = action.payload.role === "admin"
            localStorage.setItem("AuthToken", action.payload.token)
            localStorage.setItem("Role", action.payload.role)
            state.logged = true;
        })
        builder.addCase(sendMail.fulfilled, (state, action) => {
            state.email = action.payload.email
            state.nome = action.payload.nome
            state.cognome = action.payload.cognome
            state.password = action.payload.password
            state.codeVerification = action.payload.codeVerification
        })
        builder.addCase(userRegistration.fulfilled, (state, action) => {
            state.registrationSuccess = true
        })

    }
})
export const { resetState, resetRegistrationFlag } = userSlice.actions
export default userSlice