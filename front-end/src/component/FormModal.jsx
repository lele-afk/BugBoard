import React, { useState } from 'react'
import { FormControl, FormLabel, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Box, useMediaQuery, useTheme, Stack, Select, MenuItem, styled, Typography } from '@mui/material';
import StyledButton from './StyledButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch, useSelector } from 'react-redux'; // <-- Aggiunto useSelector per prendere l'utente
import { issueInsert } from '../state/issue/issueAction';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const FormModal = ({ open, handleClose }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const user = useSelector((state) => state.userState);

    const [titolo, setTitolo] = useState('');
    const [descrizione, setDescrizione] = useState('');
    const [priority, setPriority] = useState('');
    const [typo, setTypo] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleChangePriority = (event) => setPriority(event.target.value);
    const handleChangeTypo = (event) => setTypo(event.target.value);

    const handleFileChange = (e) => {
        const fileUploaded = e.target.files[0];
        if (!fileUploaded) return;

        setFileName(fileUploaded.name);
        const reader = new FileReader();
        reader.onloadend = () => {
            setFile(reader.result); // Questo sarà il Base64 da mandare al backend
        };
        reader.readAsDataURL(fileUploaded);
    };

    const resetForm = () => {
        setTitolo('');
        setDescrizione('');
        setPriority('');
        setTypo('');
        setFile(null);
        setFileName('');
    };

    const handleCloseDialog = () => {
        resetForm();
        handleClose();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validazione minima prima dell'invio
        if (!titolo.trim() || !priority || !typo) {
            // Se mancano i dati obbligatori blocchiamo l'invio
            return;
        }

        console.log('user :>> ', user);


        const payload = {
            id_utente: user.idUtente,        // <-- FONDAMENTALE: Evita l'errore NOT NULL del DB
            titolo: titolo,
            descrizione: descrizione || '',     // Sostituisce stringa vuota per sicurezza
            priority: priority,                 // Mantiene 'low', 'medium', 'high'
            tipo: typo.toLowerCase(),           // <-- FONDAMENTALE: Trasforma 'Bug' in 'bug' per l'enum del DB
            immagine_url: file                  // Il Base64 o null
        };

        try {

            await dispatch(issueInsert(payload)).unwrap();
            handleCloseDialog();
        } catch (error) {
            console.error("Errore durante la creazione del ticket nel Form:", error);
        }
    };

    const TYPO = ["Question", "Bug", "Documentation", "Feature"];

    return (
        <Dialog open={open} onClose={handleCloseDialog} maxWidth={isMobile ? 'xs' : 'md'} fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: '2rem' }}>Creazione ticket</DialogTitle>

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <DialogContent>
                    <FormControl fullWidth>
                        <FormLabel htmlFor="titolo" sx={{ fontWeight: 'bold' }}>Titolo ticket</FormLabel>
                        <TextField
                            name="titolo"
                            required
                            fullWidth
                            id="titolo"
                            value={titolo}
                            onChange={(e) => setTitolo(e.target.value)}
                            sx={{ backgroundColor: 'white', mb: 3 }}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <FormLabel htmlFor="descrizione" sx={{ fontWeight: 'bold' }}>Descrizione</FormLabel>
                        <TextField
                            name="descrizione"
                            fullWidth
                            multiline
                            rows={4}
                            id="descrizione"
                            value={descrizione}
                            onChange={(e) => setDescrizione(e.target.value)}
                            sx={{ backgroundColor: 'white', mb: 3 }}
                        />
                    </FormControl>

                    <Stack
                        direction={'row'}
                        alignItems={'center'}
                        spacing={2}
                        sx={{ width: '100%', mb: 3 }}
                    >
                        <FormControl
                            size={isMobile ? 'small' : 'medium'}
                            sx={{ flex: 1 }}
                            required
                        >
                            <FormLabel htmlFor="priority" sx={{ fontWeight: 'bold', mb: 1 }}>Priorità</FormLabel>
                            <Select
                                id="priority"
                                value={priority}
                                onChange={handleChangePriority}
                                fullWidth
                            >
                                <MenuItem value={'low'}>Bassa</MenuItem>
                                <MenuItem value={'medium'}>Media</MenuItem>
                                <MenuItem value={'high'}>Alta</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl
                            size={isMobile ? 'small' : 'medium'}
                            sx={{ flex: 1 }}
                            required
                        >
                            <FormLabel htmlFor="typo" sx={{ fontWeight: 'bold', mb: 1 }}>Tipologia</FormLabel>
                            <Select
                                id="typo"
                                value={typo}
                                onChange={handleChangeTypo}
                                fullWidth
                            >
                                {TYPO.map(t =>
                                    <MenuItem key={t} value={t}>{t}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Stack>

                    <FormControl>
                        <FormLabel htmlFor="img" sx={{ fontWeight: 'bold', mb: 1 }}>Inserisci immagine</FormLabel>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <StyledButton
                                component="label"
                                role={undefined}
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                                label={"Carica immagine"}
                            >
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={handleFileChange}
                                    accept='image/*'
                                    data-testid="file-input"
                                />
                            </StyledButton>
                            {fileName && (
                                <Typography variant="caption" color="textSecondary">
                                    {fileName}
                                </Typography>
                            )}
                        </Stack>
                    </FormControl>
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <StyledButton type="button" label='Chiudi' main={false} onClick={handleCloseDialog} />
                    <StyledButton
                        type="submit"
                        disabled={!(user?.idUtente || user?.id_utente || user?.data?.id)}
                        label={!(user?.idUtente || user?.id_utente || user?.data?.id) ? 'Caricamento utente...' : 'Crea ticket'}
                        sx={{ backgroundColor: 'black', color: 'white' }}
                    />
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default FormModal;