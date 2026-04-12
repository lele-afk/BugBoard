import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import { Box, Stack, FormControl, Typography } from "@mui/material";
import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import StyledButton from './StyledButton';

const CardForm = ({ withPrivateData = false }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleClickShowRePassword = () => setShowRePassword((showRePassword) => !showRePassword);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = () => { }

    return <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100%',
            py: 4,

        }}
    >
        <Stack spacing={3}
            alignItems="center"
            sx={{
                width: '100%',
                maxWidth: { xs: '100%', sm: '450px', md: '550px' },
            }}>
            <Typography variant="h5"
                sx={{
                    fontSize: { xs: '2rem', sm: '3rem' },
                    textAlign: 'center'
                }}
                gutterBottom>
                Pagina di Login
            </Typography>
            <Typography variant="h3"
                sx={{
                    fontSize: { xs: '2rem', sm: '3rem' },
                    textAlign: 'center'
                }}
                gutterBottom>
                Accedi al tuo account
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Inserisci i tuoi dati per effettuare l’accesso
            </Typography>
            <Card sx={{
                width: '100%',
                backgroundColor: "#6750A4",
                borderRadius: 2,
                boxShadow: 3,
            }} >
                <CardContent sx={{
                    p: { xs: 3, sm: 5 },
                    '&:last-child': { pb: { xs: 3, sm: 5 } }
                }} >
                    <Stack direction={'column'} spacing={2.5} >
                        {withPrivateData && <>
                            <FormControl >
                                <FormLabel htmlFor="nome" sx={{ fontWeight: 'bold' }}>Inserisci nome</FormLabel>
                                <TextField
                                    name="nome"
                                    required
                                    fullWidth
                                    id="nome"
                                    sx={{ backgroundColor: 'white', mb: 3 }}
                                />
                            </FormControl>
                            <FormControl >
                                <FormLabel htmlFor="cognome" sx={{ fontWeight: 'bold' }}>Inserisci cognome</FormLabel>
                                <TextField
                                    name="cognome"
                                    required
                                    fullWidth
                                    id="cognome"
                                    sx={{ backgroundColor: 'white', mb: 3 }}
                                />
                            </FormControl></>}
                        <FormControl >
                            <FormLabel htmlFor="email" sx={{ fontWeight: 'bold' }}>Inserisci email</FormLabel>
                            <TextField
                                name="email"
                                required
                                fullWidth
                                id="email"
                                sx={{ backgroundColor: 'white', mb: 3 }}
                            />
                        </FormControl>
                        <FormControl >
                            <FormLabel htmlFor="password" sx={{ fontWeight: 'bold' }}>Inserisci password</FormLabel>
                            <TextField
                                name="password"
                                required
                                fullWidth
                                id="password"
                                sx={{ backgroundColor: 'white', mb: 3 }}
                                type={showPassword ? 'text' : 'password'}
                                slotProps={{
                                    input: {
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <IconButton

                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    onMouseUp={handleMouseUpPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                    }
                                }}
                            />
                        </FormControl>
                        <FormControl >
                            <FormLabel htmlFor="re-password" sx={{ fontWeight: 'bold' }}>Ripeti la password</FormLabel>
                            <TextField
                                name="re-password"
                                required
                                fullWidth
                                id="re-password"
                                sx={{ backgroundColor: 'white', mb: 3 }}
                                type={showRePassword ? 'text' : 'password'}
                                slotProps={{
                                    input: {
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <IconButton

                                                    onClick={handleClickShowRePassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    onMouseUp={handleMouseUpPassword}
                                                    edge="end"
                                                >
                                                    {showRePassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                    }
                                }}
                            />
                        </FormControl>

                    </Stack>
                </CardContent>

            </Card>
            <StyledButton fullWidth label={'Accedi'} sx={{
                py: 1.5, // Bottone un po' più alto per il touch su mobile
                fontSize: '1.1rem'
            }} />
        </Stack>
    </Box >

}

export default CardForm