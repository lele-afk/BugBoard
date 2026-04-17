import React from 'react'
import CardForm from '../component/CardForm'
import { useNavigate } from 'react-router-dom'

const Registration = () => {
    const navigate = useNavigate();
    const handleRegistrationSubmit = () => {
        console.log("ciao");
        // se non ci sono errori di password
        navigate('/verificationCode')
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