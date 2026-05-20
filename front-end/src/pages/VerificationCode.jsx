import React, { useState } from 'react'
import CardForm from '../component/CardForm'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { userRegistration } from '../state/user/userActions'
import DomicileBanner from '../component/DomicileBanner';
const VerificationCode = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.userState)
    const dispatch = useDispatch();
    const [err, setErr] = useState(false)

    const handleVerificationCodeSubmit = async (verificationCode) => {
        if (user.verificationCode === verificationCode) {
            try {
                setErr(false)
                await dispatch(userRegistration({ email: user.email, password: user.password, role: 'user' })).unwrap();
                navigate("/")
            } catch (error) {
                setErr(true)
            }
        }
    }

    const handleBack = () => {
        navigate("/registration")
    }

    return (

        <>
            <CardForm onlyVerificationCode={true}
                withBackButton={true}
                textOfTitle={'Pagina verifica codice'}
                textOfSubtitle={'Inserisci codice'}
                textOfDescription={'Inserisci il codice inviato via mail per confemare la registrazione'}
                textOfButtonOfSubmit={'Completa registrazione'}
                onBack={handleBack}
                onSubmit={handleVerificationCodeSubmit} />
            <DomicileBanner
                severity={'Error'}
                open={err}
                title={'Errore'}
                message={'Registrazione fallita'}
            /></>
    )
}

export default VerificationCode