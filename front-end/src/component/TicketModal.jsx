import React from 'react';
import { Modal, Box, Typography, Divider } from '@mui/material';
import StyledButton from './StyledButton';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const TicketModal = ({ open, handleClose, ticket }) => {
    if (!ticket) return null;

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="overline" color="text.secondary">
                    {ticket.status} - ID: {ticket.id}
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    {ticket.title}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" sx={{ mt: 2 }}>
                    <strong>Descrizione:</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {ticket.description || "Nessuna descrizione fornita."}
                </Typography>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <StyledButton onClick={handleClose} label='Chiudi'>
                        Chiudi
                    </StyledButton>
                </Box>
            </Box>
        </Modal>
    );
};

export default TicketModal;