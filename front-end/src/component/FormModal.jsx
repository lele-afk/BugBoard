import React, { useState } from 'react'
import { FormControl, FormLabel, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Box, useMediaQuery, useTheme, Stack, Select, MenuItem, styled, Typography, Collapse, Alert, AlertTitle } from '@mui/material';
import StyledButton from './StyledButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch, useSelector } from 'react-redux';
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

const FormModal = ({ open, handleClose, onError }) => {
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
    const [errorFile, setErrorFile] = useState(''); // <-- Stato locale per gestire l'errore del file

    const handleChangePriority = (event) => setPriority(event.target.value);
    const handleChangeTypo = (event) => setTypo(event.target.value);

    const handleFileChange = (e) => {
        const fileUploaded = e.target.files[0];
        if (!fileUploaded) return;

        // Controllo sul tipo di file (accetta solo PNG e JPEG/JPG)
        const validTypes = ['image/png', 'image/jpeg'];
        if (!validTypes.includes(fileUploaded.type)) {
            setErrorFile('Il file selezionato non è valido. Sono accettati solo formati PNG o JPEG.');
            setFile(null);
            setFileName('');
            return;
        }

        // Se il file è valido, azzero l'errore precedente e lo leggo
        setErrorFile('');
        setFileName(fileUploaded.name);
        const reader = new FileReader();
        reader.onloadend = () => {
            setFile(reader.result);
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
        setErrorFile(''); // <-- Reset dell'errore alla chiusura/pulizia
    };

    const handleCloseDialog = () => {
        resetForm();
        handleClose();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            id_utente: user.idUtente,
            titolo: titolo,
            descrizione: descrizione || '',
            priority: priority,
            tipo: typo.toLowerCase(),
            immagine_url: file
        };

        try {
            await dispatch(issueInsert(payload)).unwrap();
            handleCloseDialog();
        } catch (error) {
            console.error("Errore durante la creazione del ticket nel Form:", error);
            handleCloseDialog();
            if (onError) {
                onError("Creazione del ticket fallita. Riprova.");
            }
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
                            <FormLabel htmlFor="priority" sx={{ fontWeight: 'bold', mb: 1 }} id="priority-label">Priorità</FormLabel>
                            <Select
                                labelId="priority-label"
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
                            <FormLabel htmlFor="typo" sx={{ fontWeight: 'bold', mb: 1 }} id="typo-label">Tipologia</FormLabel>
                            <Select
                                labelId="typo-label"
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

                    {/* Banner di Errore per il formato file non valido */}
                    <Collapse in={Boolean(errorFile)}>
                        <Alert
                            severity="error"
                            variant="outlined"
                            onClose={() => setErrorFile('')}
                            sx={{ mb: 3, borderRadius: 1.5 }}
                        >
                            <AlertTitle sx={{ fontWeight: 'bold' }}>Errore Formato</AlertTitle>
                            {errorFile}
                        </Alert>
                    </Collapse>

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
                                    accept='image/png, image/jpeg'
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
                        disabled={!(user?.idUtente || user?.id_utente || user?.data?.id) || !titolo.trim() || !priority || !typo}
                        label={!(user?.idUtente || user?.id_utente || user?.data?.id) ? 'Caricamento utente...' : 'Crea ticket'}
                        sx={{ backgroundColor: 'black', color: 'white' }}
                    />
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default FormModal;