import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Divider, TextField, Chip, Alert, AlertTitle, Collapse } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { resetCommentoLoaded } from '../state/user/userSlice';
import StyledButton from './StyledButton';
import { commentoInsert } from '../state/user/userActions';

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

const TicketModal = ({ open, handleClose, ticket: initialTicket }) => {
    const dispatch = useDispatch();

    // 1. Recuperiamo lo stato dell'utente
    const { commentoLoaded, idUtente } = useSelector((state) => state.userState);

    // 2. AGGIORNAMENTO IN TEMPO REALE: Selezioniamo il ticket direttamente da Redux 
    // in modo che qualsiasi modifica (es. nuovi commenti inseriti nel reducer) ri-renderizzi subito la modale.
    const ticket = useSelector((state) =>
        state.issueState?.issue?.find(i => i.id_issue === initialTicket?.id_issue) || initialTicket
    );

    const [currentStatus, setCurrentStatus] = useState(ticket?.stato || 'todo');
    const [newComment, setNewComment] = useState("");

    // Sincronizza lo stato locale dello status quando cambia il ticket di Redux
    useEffect(() => {
        if (ticket) {
            setCurrentStatus(ticket.stato);
        }
    }, [ticket]);

    // EFFETTO AUTO-HIDE: Chiude l'alert automaticamente dopo 4 secondi
    useEffect(() => {
        if (commentoLoaded) {
            const timer = setTimeout(() => {
                dispatch(resetCommentoLoaded());
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [commentoLoaded, dispatch]);

    if (!ticket) return null;

    const handleStatusChange = () => {
        const nextStatus = NEXT_STATUS_MAP[currentStatus];
        if (nextStatus) {
            setCurrentStatus(nextStatus);
            console.log(`Stato aggiornato nel database a: ${nextStatus}`);
        }
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const payload = {
            id_issue: ticket.id_issue,
            id_utente: idUtente || ticket.id_utente,
            commento: newComment
        };

        dispatch(commentoInsert(payload));
        setNewComment("");
    };

    const nextStatus = NEXT_STATUS_MAP[currentStatus];
    const listaCommenti = ticket.commenti || [];

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                {/* Header: Info di testata */}
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="overline" color="text.secondary">
                        ID TICKET: {ticket.id_issue} — Tipo: <Typography component="span" variant="overline" sx={{ fontWeight: 'bold' }}>{ticket.tipo}</Typography>
                    </Typography>
                    <Chip
                        label={currentStatus.toUpperCase()}
                        color={currentStatus === 'done' ? 'success' : currentStatus === 'inprogress' ? 'warning' : 'default'}
                        size="small"
                    />
                </Box>

                {/* ALERT INTEGRATO NELLA MODALE */}
                <Collapse in={commentoLoaded}>
                    <Alert
                        severity="success"
                        variant="outlined"
                        onClose={() => dispatch(resetCommentoLoaded())}
                        sx={{ mb: 2, borderRadius: 1.5 }}
                    >
                        <AlertTitle sx={{ fontWeight: 'bold' }}>Successo</AlertTitle>
                        Commento aggiunto con successo!
                    </Alert>
                </Collapse>

                <Typography variant="h5" component="h2" gutterBottom>
                    {ticket.titolo}
                </Typography>

                {/* Badge Priorità e Date */}
                <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    <Chip label={`Priorità: ${ticket.priorita?.toUpperCase()}`} size="small" variant="outlined" />
                    <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                        Creato il: {new Date(ticket.created_at).toLocaleDateString()}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Descrizione */}
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Descrizione:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {ticket.descrizione || "Nessuna descrizione fornita."}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* WORKFLOW: Cambio Stato */}
                <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
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

                {/* SEZIONE COMMENTI AGGIORNATA IN REAL-TIME */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Commenti ({listaCommenti.length})
                </Typography>

                <Box sx={{ maxHeight: 150, overflowY: 'auto', mb: 2, pr: 1 }}>
                    {listaCommenti.length > 0 ? (
                        listaCommenti.map((commento, index) => (
                            <Box key={commento.id_commento || index} sx={{ mb: 1.5, p: 1, bgcolor: 'background.default', borderRadius: 1, borderLeft: '3px solid #4c9aff' }}>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{commento.utente?.nome
                                        ? commento.utente.nome
                                        : (commento.id_utente === idUtente ? commento?.utente.nome : `Utente #${commento.id_utente}`)
                                    }</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {commento.created_at ? new Date(commento.created_at).toLocaleString() : ''}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>{commento.commento}</Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="caption" color="text.secondary">Nessun commento presente.</Typography>
                    )}
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