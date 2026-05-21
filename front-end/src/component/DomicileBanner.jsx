import React from "react";
import { Alert, AlertTitle, Box, Snackbar } from "@mui/material";

const DomicileBanner = ({ severity, open, handleClose, title = '', message = '' }) => {

    // Rimosso il "if (!open) return null" per permettere l'animazione di chiusura di MUI

    const handleCloseWithClickaway = (event, reason) => {
        if (reason === 'clickaway') {
            return; // Ignora il click fuori se l'utente clicca casualmente sullo schermo
        }
        if (handleClose) {
            handleClose(); // Esegue clearAlertForCreateIssue dispatchato dal padre
        }
    };

    return (
        <Box my={3}>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={open}
                autoHideDuration={5000} // Si chiuderà da solo dopo 5 secondi
                onClose={handleCloseWithClickaway}
                key={'bottom-right'}
            >
                {/* L'onClose sull'Alert mostra automaticamente la "X" a destra */}
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