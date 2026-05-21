import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    Stack,
    Chip,
    useTheme,
    useMediaQuery,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import AddIcon from '@mui/icons-material/Add';
import TicketModal from '../component/TicketModal';
import StyledButton from '../component/StyledButton';
import FormModal from '../component/FormModal';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux'
import { resetState, resetRegistrationFlag } from '../state/user/userSlice';
import CreationUserModal from '../component/CreationUserModal';
import { getIssues } from '../state/issue/issueAction';
import DomicileBanner from '../component/DomicileBanner';
import { clearAlertForCreateIssue } from '../state/issue/issueSlice';

const COLUMNS = ['todo', 'in_progress', 'done'];

const Dashboard = () => {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenOfCreationTicket, setIsModalOpenOfCreationTicket] = useState(false);
    const [isModalCreationOpen, setIsModalCreationOpen] = useState(false);
    const [err, setErr] = useState(false)
    const [createIssueErr, setCreateIssueErr] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [utente, setUtente] = useState('');
    const [priorita, setPriorita] = useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { issue, issueLoaded } = useSelector((state) => state.issueState)
    const user = useSelector((state) => state.userState)

    const fetchIssue = async () => {
        try {
            await dispatch(getIssues()).unwrap()
        } catch (error) {
            setErr(true)
        }
    }
    useEffect(() => {
        fetchIssue()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleCreation = () => {
        setIsModalCreationOpen(true)
    }

    const handleOpenModal = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const handleOpenCreateTicket = () => {
        setIsModalOpenOfCreationTicket(true)
    }
    const handleCloseCreateTicket = () => {
        setIsModalOpenOfCreationTicket(false)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTicket(null);
    };

    const handleLogout = () => {
        dispatch(resetState())
        navigate('/')
    }

    const handleCloseCreationModal = () => {
        setIsModalCreationOpen(false)
    }

    const handleCreateIssueError = (msg) => {
        setErrorMessage(msg || 'Errore durante l\'inserimento della issue');
        setCreateIssueErr(true);
    };

    const getTicketCount = (status) => issue && issue.filter(t => t.stato === status).length;

    return (
        <Box
            sx={{
                flexGrow: 1,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                boxSizing: 'border-box',
                p: { xs: 1, sm: 2, md: 3 },

                overflowY: isMobile ? 'auto' : 'hidden',
                bgcolor: '#ffffff'
            }}
        >
            <Box sx={{
                width: '100%',
                maxWidth: '1800px',
                height: '90%',
                display: 'flex',
                flexDirection: 'column'
            }}>


                <Box sx={{ mb: 2 }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
                    >

                        <Stack direction="row" spacing={2}>
                            <FormControl size="small" sx={{ minWidth: 200 }}>
                                <InputLabel id="select-utente-label">Utente</InputLabel>
                                <Select
                                    labelId="select-utente-label"
                                    id="select-utente"
                                    value={utente}
                                    label="Utente"
                                    onChange={(e) => setUtente(e.target.value)}
                                    endAdornment={<PersonOutlineIcon sx={{ marginRight: 3, color: 'action.active' }} />}
                                >
                                    <MenuItem value="utente1">Utente 1</MenuItem>
                                    <MenuItem value="utente2">Utente 2</MenuItem>
                                    <MenuItem value="utente3">Utente 3</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel id="select-priorita-label">Priorità</InputLabel>
                                <Select
                                    labelId="select-priorita-label"
                                    id="select-priorita"
                                    value={priorita}
                                    label="Priorità"
                                    onChange={(e) => setPriorita(e.target.value)}
                                    endAdornment={<PriorityHighIcon sx={{ marginRight: 3, color: 'action.active' }} />}
                                >
                                    <MenuItem value="alta">Alta</MenuItem>
                                    <MenuItem value="media">Media</MenuItem>
                                    <MenuItem value="bassa">Bassa</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <StyledButton
                                label={"Crea ticket"}
                                main={true}
                                endIcon={<AddIcon />}
                                onClick={handleOpenCreateTicket}
                            ></StyledButton>
                            {user.isAdmin && <StyledButton
                                label={"Crea utente"}
                                main={true}
                                endIcon={<AddIcon />}
                                onClick={handleCreation}
                            ></StyledButton>}
                            <StyledButton
                                label={"Logout"}
                                main={false}
                                endIcon={<ArrowBackIcon />}
                                onClick={handleLogout}
                            ></StyledButton></Stack>

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
                        overflow: 'hidden',
                        minHeight: 0
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
                                {issue && issue.filter(t => t.stato === status).map((ticket) => (
                                    <Card
                                        key={ticket.id_issue}
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

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontSize: '1rem',
                                                        fontWeight: 'bold',
                                                        color: '#172b4d',
                                                        mb: 1.5
                                                    }}
                                                >
                                                    {ticket.titolo}
                                                </Typography>

                                                <Box
                                                    display="flex"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                >
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: '#5e6c84',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        #{ticket.id_issue}
                                                    </Typography>

                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: '#0052cc',
                                                            fontWeight: 'bold',
                                                            textTransform: 'uppercase',
                                                            backgroundColor: '#deebff',
                                                            px: 1,
                                                            py: 0.2,
                                                            borderRadius: 1
                                                        }}
                                                    >
                                                        {ticket.tipo}
                                                    </Typography>
                                                </Box>

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
            <FormModal open={isModalOpenOfCreationTicket} handleClose={handleCloseCreateTicket} onError={handleCreateIssueError}></FormModal>
            <CreationUserModal open={isModalCreationOpen} handleClose={handleCloseCreationModal}></CreationUserModal>
            <DomicileBanner
                severity={'error'}
                open={err}
                title={'Errore'}
                handleClose={() => setErr(false)}
                message={'Recupero dati issue fallito'}
            />
            <DomicileBanner
                severity={'error'}
                open={createIssueErr}
                title={'Errore Creazione'}
                handleClose={() => setCreateIssueErr(false)}
                message={errorMessage}
            />
            <DomicileBanner
                severity={'success'}
                open={issueLoaded}
                handleClose={() => dispatch(clearAlertForCreateIssue())}
                title={'Successo'}
                message={'Inserimento issue completato'}
            />
            <DomicileBanner
                severity={'success'}
                open={user.registrationSuccess}
                handleClose={() => dispatch(resetRegistrationFlag())}
                title={'Conferma registrazione'}
                message={'Registrazione completata con successo'}
            />
        </Box>
    );
};

export default Dashboard;