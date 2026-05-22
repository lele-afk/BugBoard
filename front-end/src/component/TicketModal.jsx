import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Divider, TextField, Chip, Alert, AlertTitle, Collapse } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { resetCommentoLoaded } from '../state/user/userSlice';
import StyledButton from './StyledButton';
import { commentoInsert } from '../state/user/userActions';
import { issueChangeStatus } from '../state/issue/issueAction';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    maxHeight: '90vh',
    overflowY: 'auto',
    overflowX: 'hidden',
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

    const { commentoLoaded, idUtente } = useSelector((state) => state.userState);

    const ticket = useSelector((state) =>
        state.issueState?.issue?.find(i => i.id_issue === initialTicket?.id_issue) || initialTicket
    );

    const [currentStatus, setCurrentStatus] = useState(ticket?.stato || 'todo');
    const [newComment, setNewComment] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (ticket) {
            setCurrentStatus(ticket.stato === 'in_progress' ? 'inprogress' : ticket.stato);
        }
    }, [ticket]);

    useEffect(() => {
        if (commentoLoaded) {
            setErrorMessage("");
            const timer = setTimeout(() => {
                dispatch(resetCommentoLoaded());
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [commentoLoaded, dispatch]);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage("");
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    if (!ticket) return null;

    const handleStatusChange = async () => {
        const nextStatus = NEXT_STATUS_MAP[currentStatus];
        if (nextStatus) {
            const backendStatus = nextStatus === 'inprogress' ? 'in_progress' : nextStatus;
            const payload = {
                id_issue: ticket.id_issue,
                stato: backendStatus
            };

            try {
                setErrorMessage("");
                await dispatch(issueChangeStatus(payload)).unwrap();
            } catch (error) {
                console.error("Errore avanzamento stato:", error);
                setErrorMessage("Impossibile aggiornare lo stato del ticket. Riprova più tardi.");
            }
        }
    };

    const handleAddComment = async () => {
        // Ulteriore controllo di sicurezza prima dell'invio
        if (newComment.trim().length < 4) return;

        const payload = {
            id_issue: ticket.id_issue,
            id_utente: idUtente || ticket.id_utente,
            commento: newComment.trim()
        };

        try {
            setErrorMessage("");
            if (commentoLoaded) dispatch(resetCommentoLoaded());

            await dispatch(commentoInsert(payload)).unwrap();
            setNewComment("");
        } catch (error) {
            console.error("Errore inserimento commento:", error);
            setErrorMessage("Impossibile aggiungere il commento. Riprova più tardi.");
        }
    };

    const nextStatus = NEXT_STATUS_MAP[currentStatus];
    const listaCommenti = ticket.commenti || [];
    const imageUrl = ticket.immagine || null;

    const handleOpenBase64Image = () => {
        if (!imageUrl) return;

        try {
            const parts = imageUrl.split(',');
            const mimeType = parts[0].match(/:(.*?);/)[1];
            const base64Data = parts[1];

            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });
            const blobUrl = URL.createObjectURL(blob);

            window.open(blobUrl, '_blank');
        } catch (error) {
            console.error("Impossibile aprire l'immagine Base64:", error);
        }
    };

    const handleCloseModal = () => {
        setErrorMessage("");
        if (commentoLoaded) dispatch(resetCommentoLoaded());
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleCloseModal}>
            <Box sx={style}>
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

                <Collapse in={Boolean(errorMessage)}>
                    <Alert
                        severity="error"
                        variant="outlined"
                        onClose={() => setErrorMessage("")}
                        sx={{ mb: 2, borderRadius: 1.5 }}
                    >
                        <AlertTitle sx={{ fontWeight: 'bold' }}>Errore</AlertTitle>
                        {errorMessage}
                    </Alert>
                </Collapse>

                <Typography variant="h5" component="h2" gutterBottom>
                    {ticket.titolo}
                </Typography>

                <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    <Chip label={`Priorità: ${ticket.priorita?.toUpperCase()}`} size="small" variant="outlined" />
                    <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
                        Creato il: {ticket.created_at
                            ? new Date(ticket.created_at).toLocaleString('it-IT', {
                                timeZone: 'UTC',
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })
                            : '—'
                        }
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Descrizione:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {ticket.descrizione || "Nessuna descrizione fornita."}
                </Typography>
                {imageUrl && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Allegato:
                        </Typography>
                        <Box
                            sx={{
                                maxWidth: '100%',
                                boxSizing: 'border-box',
                                maxHeight: '250px',
                                overflow: 'hidden',
                                borderRadius: 1.5,
                                border: '1px solid',
                                borderColor: 'divider',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bgcolor: 'action.hover',
                                mb: 2
                            }}
                        >
                            <Box
                                component="img"
                                src={imageUrl}
                                alt={`Allegato del ticket ${ticket.id_issue}`}
                                sx={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    maxHeight: '250px',
                                    objectFit: 'contain',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.02)'
                                    }
                                }}
                                onClick={handleOpenBase64Image}
                            />
                        </Box>
                    </>
                )}

                <Divider sx={{ my: 2 }} />

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
                            Questo ticket è completato (DONE).
                        </Typography>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Commenti ({listaCommenti.length})
                </Typography>

                <Box sx={{ maxHeight: 150, overflowY: 'auto', mb: 2, pr: 1 }}>
                    {listaCommenti.length > 0 ? (
                        listaCommenti.map((commento, index) => (
                            <Box key={commento.id_commento || index} sx={{ mb: 1.5, p: 1, bgcolor: 'background.default', borderRadius: 1, borderLeft: '3px solid #4c9aff' }}>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                        {commento.utente?.nome
                                            ? `${commento.utente.nome} ${commento.utente.cognome ?? ''}`.trim()
                                            : (commento.id_utente === idUtente ? "Tu" : `Utente #${commento.id_utente}`)
                                        }
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {commento.created_at
                                            ? new Date(commento.created_at).toLocaleString('it-IT', { timeZone: 'UTC' })
                                            : ''
                                        }
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>{commento.commento}</Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="caption" color="text.secondary">Nessun commento presente.</Typography>
                    )}
                </Box>

                <Box display="flex" gap={1} alignItems="flex-start" sx={{ mb: 3 }}>
                    <TextField
                        fullWidth
                        size="small"
                        multiline
                        maxRows={3}
                        placeholder="Scrivi un commento (minimo 4 caratteri)..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    {/* AGGIUNTO: Proprietà disabled per bloccare il tasto se il testo è inferiore a 4 caratteri */}
                    <StyledButton
                        onClick={handleAddComment}
                        label="Invia"
                        disabled={newComment.trim().length < 4}
                    />
                </Box>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <StyledButton onClick={handleCloseModal} main={false} label='Chiudi' />
                </Box>
            </Box>
        </Modal>
    );
};

export default TicketModal;