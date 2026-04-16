import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setDispatch } from './api/api.config';
import { Box } from '@mui/material';
import Router from './router/router';
import Header from './component/Header';


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    setDispatch(dispatch);
  }, [dispatch]);



  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
    }}>
      <Header></Header>
      <Router />
    </Box>
  );
}

export default App;
