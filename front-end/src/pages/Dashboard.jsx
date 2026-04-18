import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    Stack,
    Chip,
    useTheme,
    useMediaQuery
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import TicketModal from '../component/TicketModal';
import StyledButton from '../component/StyledButton';

const INITIAL_TICKETS = [
    { id: '1', title: 'Creare API Login', status: 'TO-DO', description: 'Implementare endpoint JWT' },
    { id: '2', title: 'Fix bug CSS Dashboard', status: 'DOING', description: 'Sistemare il padding delle colonne' },
    { id: '3', title: 'Setup Progetto', status: 'DONE', description: 'Inizializzato repository e MUI' },
    { id: '4', title: 'Test Sicurezza', status: 'TO-DO', description: 'Verifica vulnerabilità' },
    { id: '5', title: 'Refactoring Modali', status: 'DOING', description: 'Migliorare performance' },
];

const COLUMNS = ['TO-DO', 'DOING', 'DONE'];

const Dashboard = () => {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleOpenModal = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTicket(null);
    };

    const getTicketCount = (status) => INITIAL_TICKETS.filter(t => t.status === status).length;

    return (
        <Box
            sx={{
                // Importante: occupiamo tutto lo spazio che il router ci dà
                flexGrow: 1,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                boxSizing: 'border-box',
                p: { xs: 1, sm: 2, md: 3 },
                // Su desktop l'overflow è gestito dalle singole colonne
                // Su mobile permettiamo al main di scrollare se le colonne si impilano
                overflowY: isMobile ? 'auto' : 'hidden',
                bgcolor: '#ffffff'
            }}
        >
            <Box sx={{
                width: '100%',
                maxWidth: '1800px',
                height: '90%', // Prende il 100% dello spazio sotto l'header
                display: 'flex',
                flexDirection: 'column'
            }}>

                {/* --- TOOLBAR FILTRI --- */}
                <Box sx={{ mb: 2 }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                    >

                        <Stack direction="row" spacing={1}>
                            <StyledButton
                                label={"Utente"}
                                main={true}
                                endIcon={<PersonOutlineIcon />}
                            >
                            </StyledButton>
                            <StyledButton
                                label={"Priorità"}
                                main={true}
                                endIcon={<PriorityHighIcon />}
                            ></StyledButton>
                        </Stack>
                    </Stack>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        flexGrow: 1,
                        bgcolor: '#f4f5f7',
                        borderRadius: { xs: 2, md: 4 },
                        p: { xs: 1, md: 2 },
                        gap: { xs: 2, md: 2 },
                        overflow: 'hidden', // Blocca lo scroll qui per farlo gestire alle colonne
                        minHeight: 0 // Cruciale per far funzionare flex-grow + overflow in CSS
                    }}
                >
                    {COLUMNS.map((status) => (
                        <Box
                            key={status}
                            sx={{
                                flex: 1,
                                bgcolor: '#ebecf0',
                                borderRadius: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                p: 1.5,
                                // Altezza minima per non far sparire la colonna su mobile
                                minHeight: isMobile ? '250px' : 0,
                            }}
                        >
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'black', ml: 1, fontSize: " 1.5rem" }}>
                                    {status.toUpperCase()}
                                </Typography>
                                <Chip
                                    label={getTicketCount(status)}
                                    size="medium"
                                    sx={{ bgcolor: '#dfe1e6' }}
                                />
                            </Stack>

                            <Box sx={{
                                flexGrow: 1,
                                overflowY: 'auto',
                                px: 0.5,
                                '&::-webkit-scrollbar': { width: '5px' },
                                '&::-webkit-scrollbar-thumb': { bgcolor: '#c1c7d0', borderRadius: '10px' }
                            }}>
                                {INITIAL_TICKETS.filter(t => t.status === status).map((ticket) => (
                                    <Card
                                        key={ticket.id}
                                        sx={{
                                            mb: 1,
                                            borderRadius: 2,
                                            boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
                                            border: '1px solid transparent',
                                            '&:hover': { borderColor: '#4c9aff' }
                                        }}
                                    >
                                        <CardActionArea onClick={() => handleOpenModal(ticket)}>
                                            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                                                <Typography variant="body2" sx={{ fontSize: '0.9rem', color: '#172b4d' }}>
                                                    {ticket.title}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#5e6c84', mt: 1, display: 'block' }}>
                                                    #{ticket.id}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

            <TicketModal open={isModalOpen} handleClose={handleCloseModal} ticket={selectedTicket} />
        </Box>
    );
};

export default Dashboard;