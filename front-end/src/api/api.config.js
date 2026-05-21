
import axios from 'axios';
import { setAppError } from '../state/appStatus/appStatusSlice';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3030';

const getToken = () => {
    const token = localStorage.getItem('AuthToken')
    return token;
}

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(request => {
    const token = getToken()
    if (token) {
        request.headers['Authorization'] = `Bearer ${token}`
    }
    return request
})
let dispatchFunction = null;

export const setDispatch = (dispatch) => {
    dispatchFunction = dispatch;
};

apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.code === "ERR_NETWORK" && dispatchFunction) {
            dispatchFunction(setAppError(true));
        }
        return Promise.reject(error);
    }
);
const _get = (url, config = {}) => {
    return apiClient.get(url, config);
};

const _post = (url, data = {}, config = {}) => {
    return apiClient.post(url, data, config);
};

const _put = (url, data = {}, config = {}) => {
    return apiClient.put(url, data, config);
};



export { _get, _post, _put };