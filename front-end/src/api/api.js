import { _get, _post } from "./api.config";

export const loginUser = async (loginData) => {
    try {
        const response = await _post('/user/login', loginData);
        return response;
    } catch (error) {
        const message = error?.response?.data || "Errore imprevisto";
        const code = error?.response?.status || 500;

        // eslint-disable-next-line no-throw-literal
        throw { code, message };
    }
}

export const insertIssue = async (newIssue) => {
    try {
        const response = await _post('/issue/insert', newIssue)
        return response
    } catch (error) {
        const message = error?.response?.data || "Errore imprevisto";
        const code = error?.response?.status || 500;

        // eslint-disable-next-line no-throw-literal
        throw { code, message };
    }
}

export const insertCommento = async (newCommento) => {
    try {
        const response = await _post('/commento/insert', newCommento)
        return response
    } catch (error) {
        const message = error?.response?.data || "Errore imprevisto";
        const code = error?.response?.status || 500;

        // eslint-disable-next-line no-throw-literal
        throw { code, message };
    }
}

export const registrationUser = async (newUser) => {
    try {
        const response = await _post('/user/registration', newUser);
        return response;
    } catch (error) {
        const message = error?.response?.data || "Errore imprevisto";
        const code = error?.response?.status || 500;

        // eslint-disable-next-line no-throw-literal
        throw { code, message };
    }
}

export const sendMailApi = async (newUser) => {
    try {
        const response = await _post('/user/sendMail', newUser);
        return response;
    } catch (error) {
        const message = error?.response?.data || "Errore imprevisto";
        const code = error?.response?.status || 500;

        // eslint-disable-next-line no-throw-literal
        throw { code, message };
    }
}

export const getIssue = async (req) => {
    try {
        const response = await _get('/issue');
        return response
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Errore imprevisto";
        const code = error?.response?.status || 500;

        // eslint-disable-next-line no-throw-literal
        throw { code, message };
    }
}