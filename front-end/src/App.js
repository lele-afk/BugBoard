import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setDispatch } from './api/api.config';
import { Box } from '@mui/material';
import Router from './router/router';


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
      <Router />
    </Box>
  );
}

export default App;
