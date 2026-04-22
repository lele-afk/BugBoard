import React, { useState } from 'react'
import { FormControl, FormLabel, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Box, useMediaQuery, useTheme, Stack, Select, MenuItem, styled } from '@mui/material';
import StyledButton from './StyledButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [priority, setPriority] = useState('');
    const [typo, setTypo] = useState('');
    const [file, setFile] = useState(null);

    const handleChangePriority = (event) => {
        setPriority(event.target.value)
    }
    const handleChangeTypo = (event) => {
        setTypo(event.target.value)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFile(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const resetForm = () => {
        setPriority('')
        setTypo('')
        console.log('file :>> ', file);
    }

    const handleCloseDialog = () => {
        resetForm()
        handleClose()
    }

    const TYPO = ["Question", "Bug", "Documentation", "Feature"]

    return (
        <Dialog open={open} onClose={handleClose} maxWidth={isMobile ? 'xs' : 'md'} fullWidth >
            <DialogTitle sx={{ fontWeight: 'bold', fontSize: '2rem' }}>Creazione ticket</DialogTitle>
            <DialogContent>
                <Box>
                    <FormControl fullWidth >
                        <FormLabel htmlFor="titolo" sx={{ fontWeight: 'bold' }}>Titolo ticket</FormLabel>
                        <TextField
                            name="titolo"
                            required
                            fullWidth
                            id="titolo"
                            sx={{ backgroundColor: 'white', mb: 3 }}
                        />
                    </FormControl>
                    <FormControl fullWidth >
                        <FormLabel htmlFor="descrizione" sx={{ fontWeight: 'bold' }}>Descrizione</FormLabel>
                        <TextField
                            name="descrizione"
                            required
                            fullWidth
                            multiline
                            rows={4}
                            id="descrizione"
                            sx={{ backgroundColor: 'white', mb: 3 }}
                        />
                    </FormControl>
                    <Stack
                        direction={'row'}
                        alignItems={'center'}
                        spacing={2}
                        sx={{ width: '100%' }}
                    >
                        <FormControl
                            size={isMobile ? 'small' : 'medium'}
                            sx={{ flex: 1 }}
                        >
                            <FormLabel htmlFor="priority" sx={{ fontWeight: 'bold', mb: 1 }}>Priorità</FormLabel>
                            <Select
                                id="priority"
                                value={priority}
                                label="Priorità"
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
                        >
                            <FormLabel htmlFor="typo" sx={{ fontWeight: 'bold', mb: 1 }}>Tipologia</FormLabel>
                            <Select
                                id="typo"
                                value={typo}
                                label="Tipologia"
                                onChange={handleChangeTypo}
                                fullWidth // Assicura che il Select riempia il FormControl
                            >
                                {TYPO.map(typo =>
                                    <MenuItem key={typo} value={typo}>{typo}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Stack>
                    <FormControl>
                        <FormLabel htmlFor="img" sx={{ fontWeight: 'bold', mb: 1 }}>Inserisce immagine</FormLabel>
                        <StyledButton
                            component="label"
                            role={undefined}
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                            label={"Carica immagine"}
                        >
                            <VisuallyHiddenInput
                                required
                                type="file"
                                onChange={(event) => handleFileChange(event)}
                                accept='image/*'
                                data-testid="file-input"
                            />
                        </StyledButton>

                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <StyledButton label='Chiudi' main={false} onClick={handleCloseDialog}></StyledButton>
                <StyledButton type="submit" label={'Crea ticket'} sx={{
                    backgroundColor: 'black'
                }}>
                </StyledButton>
            </DialogActions>
        </Dialog>
    )
}

export default FormModal