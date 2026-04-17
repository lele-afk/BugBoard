import React, { } from "react";
import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import StyledButton from '../component/StyledButton'
import CardForm from '../component/CardForm';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
const LoginPage = () => {
    const { logged } = useSelector(state => state.userState)
    const navigate = useNavigate()

    const handleLogin = () => { console.log('logged :>> ', logged); }

    const navigateToRegistration = () => {
        navigate('/registration')
    }

    return <Grid container spacing={{ xs: 4, md: 8 }} columns={16} alignItems="center">

        <Grid size={{ xs: 16, md: 9, lg: 10 }}>
            <Stack
                direction={'column'}
                sx={{
                    minHeight: { xs: 'auto', md: 'calc(100vh - 64px)' },
                    py: { xs: 8, md: 0 }
                }}
                justifyContent={'center'}
                alignItems={'center'}
            >
                <CardForm
                    textOfTitle={'Pagina di Login '}
                    textOfSubtitle={'Accedi al tuo account'}
                    textOfDescription={'Inserisci i tuoi dati per effettuare l’accesso'}
                    textOfButtonOfSubmit="Accedi"
                    onSubmit={handleLogin} />
            </Stack>
        </Grid>

        <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { md: 'block' }, mx: -0.5, borderColor: 'rgba(0,0,0,0.12)' }}
        />

        <Grid size={{ xs: 16, md: 6, lg: 5 }}>
            <Stack
                direction={'column'}
                sx={{
                    minHeight: { xs: 'auto', md: '100vh' },
                    pb: { xs: 8, md: 0 },
                    textAlign: 'center'
                }}
                justifyContent={'center'}
                alignItems={'center'}
            >
                <Typography
                    variant="body1"
                    sx={{
                        mb: 3,
                        maxWidth: '300px',
                        color: 'text.secondary',
                        fontWeight: 500
                    }}
                >
                    Se non possiedi un account effettua la registrazione per usufruire dell’applicazione
                </Typography>

                <Box sx={{ width: '100%', maxWidth: '300px' }}>
                    <StyledButton fullWidth label={'Vai alla pagina di registrazione'} onClick={navigateToRegistration} />
                </Box>
            </Stack>
        </Grid>

    </Grid>
}

export default LoginPage