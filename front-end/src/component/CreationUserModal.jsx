import React, { useState } from 'react';
import {
    FormControl,
    FormLabel,
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
    Checkbox
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch } from 'react-redux';
import StyledButton from './StyledButton';
import { userRegistration } from '../state/user/userActions';

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

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowRePassword = () => setShowRePassword((showRePassword) => !showRePassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const validateInputs = () => {
        if (password.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('La password deve essere di almeno 6 caratteri.');
            return false;
        }
        if (password !== rePassword) {
            setPasswordError(true);
            setPasswordErrorMessage('Le password non corrispondono.');
            return false;
        }
        setPasswordError(false);
        setPasswordErrorMessage('');
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateInputs()) {
            return;
        }

        const newUserPayload = {
            nome,
            cognome,
            email,
            password,
            role: isAdmin ? 'admin' : 'user'
        };

        try {
            await dispatch(userRegistration(newUserPayload)).unwrap();
            handleCloseDialog();
        } catch (error) {
            console.error("Errore durante la creazione dell'utente:", error);
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
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
                Creazione utente
            </DialogTitle>

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <DialogContent>
                    <Stack spacing={3}>

                        <Stack
                            direction={isMobile ? 'column' : 'row'}
                            spacing={2}
                            sx={{ width: '100%' }}
                        >
                            <FormControl fullWidth>
                                <FormLabel htmlFor="nome" sx={{ fontWeight: 'bold', mb: 1 }}>Nome</FormLabel>
                                <TextField
                                    id="nome"
                                    name="nome"
                                    required
                                    fullWidth
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    sx={{ backgroundColor: 'white' }}
                                />
                            </FormControl>

                            <FormControl fullWidth>
                                <FormLabel htmlFor="cognome" sx={{ fontWeight: 'bold', mb: 1 }}>Cognome</FormLabel>
                                <TextField
                                    id="cognome"
                                    name="cognome"
                                    required
                                    fullWidth
                                    value={cognome}
                                    onChange={(e) => setCognome(e.target.value)}
                                    sx={{ backgroundColor: 'white' }}
                                />
                            </FormControl>
                        </Stack>

                        <FormControl fullWidth>
                            <FormLabel htmlFor="email" sx={{ fontWeight: 'bold', mb: 1 }}>Indirizzo email</FormLabel>
                            <TextField
                                id="email"
                                name="email"
                                type="email"
                                required
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ backgroundColor: 'white' }}
                            />
                        </FormControl>

                        <Stack
                            direction={isMobile ? 'column' : 'row'}
                            spacing={2}
                            sx={{ width: '100%' }}
                        >
                            <FormControl fullWidth error={passwordError}>
                                <FormLabel htmlFor="password" sx={{ fontWeight: 'bold', mb: 1 }}>Password</FormLabel>
                                <TextField
                                    id="password"
                                    name="password"
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
                            </FormControl>

                            <FormControl fullWidth error={passwordError}>
                                <FormLabel htmlFor="repassword" sx={{ fontWeight: 'bold', mb: 1 }}>Ripeti la password</FormLabel>
                                <TextField
                                    id="repassword"
                                    name="repassword"
                                    type={showRePassword ? 'text' : 'password'}
                                    required
                                    fullWidth
                                    error={passwordError}
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
                            </FormControl>
                        </Stack>

                        <FormControl fullWidth>
                            <FormLabel sx={{ fontWeight: 'bold', mb: 1 }}>Permessi account</FormLabel>
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
                        </FormControl>

                    </Stack>
                </DialogContent>

                <DialogActions>
                    <StyledButton label='Chiudi' main={false} onClick={handleCloseDialog} />
                    <StyledButton
                        type="submit"
                        label='Crea utente'
                        sx={{ backgroundColor: 'black' }}
                    />
                </DialogActions>
            </Box>
        </Dialog>
    );
}

export default CreationUserModal;