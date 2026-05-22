import React, { useState } from 'react';
import CardForm from '../component/CardForm';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userRegistration } from '../state/user/userActions';
import { resetMailSended } from '../state/user/userSlice';
import DomicileBanner from '../component/DomicileBanner';

const VerificationCode = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.userState);
    const [err, setErr] = useState(false);

    const handleVerificationCodeSubmit = async (formData) => {
        const inputCode = formData.verificationCode;

        if (String(user.codeVerification) === String(inputCode)) {
            try {
                setErr(false);
                await dispatch(userRegistration({
                    nome: user.nome,
                    cognome: user.cognome,
                    email: user.email,
                    password: user.password,
                    role: 'user'
                })).unwrap();

                navigate("/");
            } catch (error) {
                setErr(true);
            }
        } else {
            setErr(true);
        }
    };

    const handleBack = () => {
        navigate("/registration");
    };

    return (
        <>
            <CardForm
                onlyVerificationCode={true}
                withBackButton={true}
                textOfTitle={'Pagina verifica codice'}
                textOfSubtitle={'Inserisci codice'}
                textOfDescription={'Inserisci il codice inviato via mail per confermare la registrazione'}
                textOfButtonOfSubmit={'Completa registrazione'}
                onBack={handleBack}
                onSubmit={handleVerificationCodeSubmit}
            />
            <DomicileBanner
                severity={'error'}
                open={err}
                handleClose={() => setErr(false)}
                title={'Errore'}
                message={'Codice errato o registrazione fallita'}
            />
            <DomicileBanner
                severity={'success'}
                open={user.mailSended}
                handleClose={() => dispatch(resetMailSended())}
                title={'Successo'}
                message={'É stata inviata un mail con il codice di verifica identitá alla mail inserita durnte la registrazione'}
            />
        </>
    );
};

export default VerificationCode;