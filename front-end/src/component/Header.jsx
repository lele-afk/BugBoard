import React from 'react'
import { AppBar, Box, Toolbar, Typography } from '@mui/material';

const Header = () => {
    //  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    // const navigate = useNavigate()

    return (
        <AppBar position="static"
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                backgroundImage: 'none',
            }}>
            <Toolbar>
                <Box
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        gap: 1,
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            mr: 2,
                            fontWeight: 'bold',
                            color: 'black'
                        }}
                    >
                        Bug Board
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header