import React from "react";
import { Alert, AlertTitle, Box, Snackbar } from "@mui/material";

const DomicileBanner = ({ severity, open, handleClose, title = '', message = '' }) => {

    const handleCloseWithClickaway = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        if (handleClose) {
            handleClose();
        }
    };

    return (
        <Box my={3}>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={open}
                autoHideDuration={5000}
                onClose={handleCloseWithClickaway}
                key={'bottom-right'}
            >
                <Alert
                    severity={severity}
                    variant="outlined"
                    onClose={handleCloseWithClickaway}
                >
                    {title && <AlertTitle>{title}</AlertTitle>}
                    {message && message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default DomicileBanner;