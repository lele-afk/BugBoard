import React from 'react'
import CardForm from '../component/CardForm'
import { useNavigate } from 'react-router-dom';

const VerificationCode = () => {
    const navigate = useNavigate();

    const handleVerificationCodeSubmit = () => {
        // registrazione utente con api
        // ritorno alla login se non ci sono errori
        // senza errori resetto i dati del form

    }

    const handleBack = () => {
        navigate("/registration")
    }

    return (

        <CardForm onlyVerificationCode={true}
            withBackButton={true}
            textOfTitle={'Pagina verifica codice'}
            textOfSubtitle={'Inserisci codice'}
            textOfDescription={'Inserisci il codice inviato via mail per confemare la registrazione'}
            textOfButtonOfSubmit={'Completa registrazione'}
            onBack={handleBack}
            onSubmit={handleVerificationCodeSubmit} />
    )
}

export default VerificationCode