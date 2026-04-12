import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setDispatch } from './api/api.config';
import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import StyledButton from './component/StyledButton'
import CardForm from './component/CardForm';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    setDispatch(dispatch);
  }, [dispatch]);



  return (
    <Box sx={{
      height: '100vh',
      width: '100vw',
      overflow: { md: 'hidden' },
    }}>

      <Grid container spacing={{ xs: 4, md: 8 }} columns={16} alignItems="center">

        <Grid size={{ xs: 16, md: 9, lg: 10 }}>
          <Stack
            direction={'column'}
            sx={{ minHeight: { xs: 'auto', md: '100vh' }, py: { xs: 8, md: 0 } }}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <CardForm />
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
              <StyledButton fullWidth label={'Vai alla pagina di registrazione'} />
            </Box>
          </Stack>
        </Grid>

      </Grid>
    </Box>
  );
}

export default App;
