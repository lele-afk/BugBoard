import { createSlice } from "@reduxjs/toolkit";
import { sendMail, userLogin, userRegistration, commentoInsert } from "./userActions";

const initialState = {
    idUtente: null,
    nome: '',
    cognome: '',
    email: '',
    password: '',
    codeVerification: '',
    isAdmin: '',
    logged: false,
    registrationSuccess: false,
    commentoLoaded: false,
    mailSended: false
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
        },
        resetCommentoLoaded: (state, action) => {
            state.commentoLoaded = false
        },
        resetMailSended: (state, action) => {
            state.mailSended = false
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
            state.codeVerification = action.payload.verificationCode
            state.mailSended = true
        })
        builder.addCase(userRegistration.fulfilled, (state, action) => {
            // 1. Impostiamo il flag di successo a true
            state.registrationSuccess = true;

            // 2. Svuotiamo i dati temporanei di registrazione (consigliato per sicurezza)
            state.nome = "";
            state.cognome = "";
            state.email = "";
            state.password = "";
            state.verificationCode = null;
            state.loading = false;
            state.error = null;

            // NOTA: Nessun "return" qui sotto! Modificiamo il draft direttamente.
        });
        builder.addCase(commentoInsert.fulfilled, (state, action) => {
            state.commentoLoaded = true
        })

    }
})
export const { resetState, resetRegistrationFlag, resetCommentoLoaded, resetMailSended } = userSlice.actions
export default userSlice