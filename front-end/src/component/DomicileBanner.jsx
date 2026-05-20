import React from "react"
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, AlertTitle, Box } from "@mui/material"

const DomicileBanner = ({ severity, open, handleClose = () => { }, canBeClosed = false, title = '', message = '' }) => {
    if (!open) return null
    return (
        <Box my={3}>
            <Alert
                severity={severity}
                variant="outlined"
                onClose={canBeClosed ? handleClose : undefined}
                action={canBeClosed &&
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={handleClose}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
            >
                {title && <AlertTitle>{title}</AlertTitle>}
                {message && message}
            </Alert>
        </Box >
    )
}
export default DomicileBanner