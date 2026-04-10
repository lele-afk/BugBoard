import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setDispatch } from './api/api.config';
import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import StyledButton from './component/StyledButton'

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    setDispatch(dispatch);
  }, [dispatch]);



  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={16}>
        <Grid size={{ xs: 4, md: 8 }}>
        </Grid>
        <Divider />
        <Grid size={{ xs: 4, md: 6 }}>
          <Stack direction={'column'} sx={{ minHeight: '100vh' }} justifyContent={'center'} alignItems={'center'} >
            <Typography mb={5}>Se non possiedi un account effettua la registrazione per usufruire dell’applicazione</Typography>
            <StyledButton fullWidth label={'Vai alla pagina di registrazione'} />
          </Stack>

        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
