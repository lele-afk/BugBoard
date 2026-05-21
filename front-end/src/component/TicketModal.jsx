import React, { useState } from 'react';
import { Modal, Box, Typography, Divider, TextField, Chip } from '@mui/material';
import StyledButton from './StyledButton';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const NEXT_STATUS_MAP = {
    'todo': 'inprogress',
    'inprogress': 'done',
    'done': null
};

const TicketModal = ({ open, handleClose, ticket }) => {
    const [currentStatus, setCurrentStatus] = useState(ticket?.stato || 'todo');
    const [comments, setComments] = useState([
        { id: 1, utente: "Admin", testo: "Ticket preso in carico", data: "21/05/2026, 10:20" }
    ]);
    const [newComment, setNewComment] = useState("");

    React.useEffect(() => {
        if (ticket) {
            setCurrentStatus(ticket.stato);
        }
    }, [ticket]);

    if (!ticket) return null;

    const handleStatusChange = () => {
        const nextStatus = NEXT_STATUS_MAP[currentStatus];
        if (nextStatus) {
            setCurrentStatus(nextStatus);
            setComments([
                ...comments,
                {
                    id: Date.now(),
                    utente: "Sistema",
                    testo: `Stato cambiato in: ${nextStatus.toUpperCase()}`,
                    data: new Date().toLocaleString()
                }
            ]);
            console.log(`Stato aggiornato nel database a: ${nextStatus}`);
        }
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const commentObj = {
            id: Date.now(),
            utente: `Utente ${ticket.id_utente}`,
            testo: newComment,
            data: new Date().toLocaleString()
        };

        setComments([...comments, commentObj]);
        setNewComment("");
        console.log("Nuovo commento inserito:", commentObj);
    };

    const nextStatus = NEXT_STATUS_MAP[currentStatus];

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                {/* Header: Info di testata */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    {/* Sostituito strong con sx={{ fontWeight: 'bold' }} */}
                    <Typography variant="overline" color="text.secondary">
                        ID TICKET: {ticket.id_issue} — Tipo: <Typography component="span" variant="overline" sx={{ fontWeight: 'bold' }}>{ticket.tipo}</Typography>
                    </Typography>
                    <Chip
                        label={currentStatus.toUpperCase()}
                        color={currentStatus === 'done' ? 'success' : currentStatus === 'inprogress' ? 'warning' : 'default'}
                        size="small"
                    />
                </Box>

                <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 1 }}>
                    {ticket.titolo}
                </Typography>

                {/* Badge Priorità in MAIUSCOLO e Date */}
                <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    {/* ticket.priorita reso uppercase tramite .toUpperCase() */}
                    <Chip label={`Priorità: ${ticket.priorita?.toUpperCase()}`} size="small" variant="outlined" />
                    <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                        Creato il: {new Date(ticket.created_at).toLocaleDateString()}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Descrizione */}
                {/* Sostituito strong con sx={{ fontWeight: 'bold' }} sul Typography */}
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Descrizione:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {ticket.descrizione || "Nessuna descrizione fornita."}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* WORKFLOW: Cambio Stato Sequenziale */}
                <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                    {/* Sostituito strong con sx={{ fontWeight: 'bold' }} */}
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Stato Attuale: <Typography component="span" variant="subtitle2" sx={{ fontWeight: 'bold' }}>{currentStatus.toUpperCase()}</Typography>
                    </Typography>
                    {nextStatus ? (
                        <StyledButton
                            onClick={handleStatusChange}
                            label={`Avanza a ${nextStatus.toUpperCase()}`}
                        />
                    ) : (
                        <Typography variant="caption" color="success.main">
                            ✓ Questo ticket è completato (DONE).
                        </Typography>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* SEZIONE COMMENTI (MOCK) */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Commenti ({comments.length})
                </Typography>

                {/* Lista dei commenti */}
                <Box sx={{ maxHeight: 150, overflowY: 'auto', mb: 2, pr: 1 }}>
                    {comments.map((c) => (
                        <Box key={c.id} sx={{ mb: 1.5, p: 1, bgcolor: 'background.default', borderRadius: 1, borderLeft: '3px solid #ccc' }}>
                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{c.utente}</Typography>
                                <Typography variant="caption" color="text.secondary">{c.data}</Typography>
                            </Box>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>{c.testo}</Typography>
                        </Box>
                    ))}
                </Box>

                {/* Input per nuovo commento */}
                <Box display="flex" gap={1} alignItems="flex-start" sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        size="small"
                        multiline
                        maxRows={3}
                        placeholder="Scrivi un commento..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <StyledButton onClick={handleAddComment} label="Invia" />
                </Box>

                {/* Footer Modale */}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <StyledButton onClick={handleClose} main={false} label='Chiudi' />
                </Box>
            </Box>
        </Modal>
    );
};

export default TicketModal;