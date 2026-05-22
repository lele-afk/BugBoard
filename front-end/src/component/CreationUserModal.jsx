import React, { useState } from 'react';
import {
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    useMediaQuery,
    useTheme,
    Stack,
    InputAdornment,
    IconButton,
    FormControlLabel,
    Checkbox,
    Collapse,
    Alert,
    AlertTitle
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch } from 'react-redux';
import StyledButton from './StyledButton';
import { userRegistrationWithAuth } from '../state/user/userActions';

function CreationUserModal({ open, handleClose }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const dispatch = useDispatch();

    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registrationError, setRegistrationError] = useState(false);

    const isFormInvalid =
        !nome.trim() ||
        !cognome.trim() ||
        !email.trim() ||
        !password.trim() ||
        !rePassword.trim();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowRePassword = () => setShowRePassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const validateInputs = () => {
        const cleanPassword = password.trim();
        const cleanRePassword = rePassword.trim();

        if (cleanPassword.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('La password deve contenere almeno 6 caratteri.');
            return false;
        }
        if (cleanPassword !== cleanRePassword) {
            setPasswordError(true);
            setPasswordErrorMessage('Le password inserite non corrispondono.');
            return false;
        }

        setPasswordError(false);
        setPasswordErrorMessage('');
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setRegistrationError(false);

        if (isFormInvalid || !validateInputs() || isSubmitting) {
            return;
        }

        const newUserPayload = {
            nome: nome.trim(),
            cognome: cognome.trim(),
            email: email.trim(),
            password: password,
            role: isAdmin ? 'admin' : 'user'
        };

        try {
            setIsSubmitting(true);
            await dispatch(userRegistrationWithAuth(newUserPayload)).unwrap();
            handleCloseDialog();
        } catch (error) {
            console.error("Errore durante la creazione dell'utente:", error);
            setRegistrationError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setNome('');
        setCognome('');
        setEmail('');
        setPassword('');
        setRePassword('');
        setIsAdmin(false);
        setPasswordError(false);
        setPasswordErrorMessage('');
        setRegistrationError(false);
        setShowPassword(false);
        setShowRePassword(false);
    };

    const handleCloseDialog = () => {
        resetForm();
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleCloseDialog}
            maxWidth={isMobile ? 'xs' : 'md'}
            fullWidth
        >
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.75rem', pb: 1 }}>
                Creazione utente
            </DialogTitle>

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <DialogContent sx={{ pt: 1 }}>
                    <Stack spacing={3}>

                        <Stack
                            direction={isMobile ? 'column' : 'row'}
                            spacing={2}
                            sx={{ width: '100%' }}
                        >
                            <TextField
                                id="nome"
                                name="nome"
                                label="Nome"
                                required
                                fullWidth
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                sx={{ backgroundColor: 'white' }}
                            />

                            <TextField
                                id="cognome"
                                name="cognome"
                                label="Cognome"
                                required
                                fullWidth
                                value={cognome}
                                onChange={(e) => setCognome(e.target.value)}
                                sx={{ backgroundColor: 'white' }}
                            />
                        </Stack>

                        <TextField
                            id="email"
                            name="email"
                            label="Indirizzo email"
                            type="email"
                            required
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ backgroundColor: 'white' }}
                        />

                        <Stack
                            direction={isMobile ? 'column' : 'row'}
                            spacing={2}
                            sx={{ width: '100%' }}
                        >
                            <TextField
                                id="password"
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                fullWidth
                                error={passwordError}
                                helperText={passwordError ? passwordErrorMessage : ''}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ backgroundColor: 'white' }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />

                            <TextField
                                id="repassword"
                                name="repassword"
                                label="Ripeti la password"
                                type={showRePassword ? 'text' : 'password'}
                                required
                                fullWidth
                                error={passwordError}
                                helperText={passwordError ? passwordErrorMessage : ''}
                                value={rePassword}
                                onChange={(e) => setRePassword(e.target.value)}
                                sx={{ backgroundColor: 'white' }}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowRePassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showRePassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                }}
                            />
                        </Stack>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.checked)}
                                    color="primary"
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 26 } }}
                                />
                            }
                            label="Registra questo utente come Amministratore (Admin)"
                            sx={{ mt: 0.5 }}
                        />

                        <Collapse in={registrationError}>
                            <Alert
                                severity="error"
                                variant="outlined"
                                onClose={() => setRegistrationError(false)}
                                sx={{ mt: 1, borderRadius: 1.5 }}
                            >
                                <AlertTitle sx={{ fontWeight: 'bold' }}>Errore</AlertTitle>
                                {"L'utente esiste o la registrazione non è andata a buon fine."}
                            </Alert>
                        </Collapse>

                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <StyledButton label='Chiudi' main={false} onClick={handleCloseDialog} />
                    <StyledButton
                        type="submit"
                        label={isSubmitting ? 'Creazione...' : 'Crea utente'}
                        disabled={isFormInvalid || isSubmitting}
                        sx={{ backgroundColor: 'black' }}
                    />
                </DialogActions>
            </Box>
        </Dialog>
    );
}

export default CreationUserModal;