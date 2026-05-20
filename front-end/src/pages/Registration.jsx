import React from 'react'
import CardForm from '../component/CardForm'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { sendMail } from '../state/user/userActions'
const Registration = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleRegistrationSubmit = async (formData) => {

        try {
            await dispatch(sendMail(formData)).unwrap()
            navigate('/verificationCode');
        } catch (error) {
            console.error("Errore durante la registrazione:", error);
        }

        navigate('/verificationCode');
    }

    const handleBack = () => {
        navigate("/")
    }

    return (
        <CardForm withPrivateData={true}
            withBackButton={true}
            textOfTitle={'Pagina di registrazione utente'}
            textOfSubtitle={'Crea un account'}
            textOfDescription={'Inserisci i tuoi dati per completare la registrazione'}
            textOfButtonOfSubmit={'Vai alla verifica identitá'}
            onBack={handleBack}
            onSubmit={handleRegistrationSubmit} />
    )
}

export default Registration