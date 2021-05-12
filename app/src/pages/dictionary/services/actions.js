import axios from 'axios';
import notification from '../../../components/notification';
import { history } from '../../../store';
import { API_HOST } from '../../../constans/api';
import { DICTIONARY_SERVICES_ROUTE } from '../../../constans/routes';

export const SHOW_DRAWER_UPDATE_SERVICES = 'SHOW_DRAWER_UPDATE_SERVICES';
export const HIDE_DRAWER_UPDATE_SERVICES = 'HIDE_DRAWER_UPDATE_SERVICES';
export const REQUEST_SERVICES_GET = 'REQUEST_SERVICES_GET';
export const RESPONSE_SERVICES_GET = 'RESPONSE_SERVICES_GET';
export const REQUEST_SERVICE_CREATE = 'REQUEST_SERVICE_CREATE';
export const RESPONSE_SERVICE_CREATE = 'RESPONSE_SERVICE_CREATE';
export const REQUEST_SERVICE_UPDATE = 'REQUEST_SERVICE_UPDATE';
export const RESPONSE_SERVICE_UPDATE = 'RESPONSE_SERVICE_UPDATE';
export const REQUEST_SERVICE_DELETE = 'REQUEST_SERVICE_DELETE';
export const RESPONSE_SERVICE_DELETE = 'RESPONSE_SERVICE_DELETE';
export const ADD_SERVICE = 'ADD_SERVICE';
export const EDIT_SERVICE = 'EDIT_SERVICE';
export const REMOVE_SERVICE = 'REMOVE_SERVICE';

export const switchDrawer = (type, id = null) => (dispatch) => {
    switch (type) {
        case 'show_update':
            dispatch({ type: SHOW_DRAWER_UPDATE_SERVICES, payload: { id } });
            break;
        case 'hide_update':
            dispatch({ type: HIDE_DRAWER_UPDATE_SERVICES, payload: { id } });
            break;
        default:
            break;
    }
};

export const getServicesAction = token => (dispatch) => {
    dispatch({ type: REQUEST_SERVICES_GET });

    axios.get(`${API_HOST}dictionary/services?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_SERVICES_GET, payload: data.data ? data.data : [] });
        } else {
            dispatch({ type: RESPONSE_SERVICES_GET, payload: [] });
            notification('error', 'Ошибка', 'Произошла ошибка при получении услуг');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_SERVICE_CREATE });
        notification('error', 'Ошибка', 'Произошла ошибка при получении услуг');
        console.error(error);
    });
};

export const createServiceAction = (fields, token) => (dispatch) => {
    dispatch({ type: REQUEST_SERVICE_CREATE });

    const formData = new FormData();
    const sendData = {
        name: fields.name,
        link: fields.link !== undefined ? fields.link : '',
        image: fields.image !== undefined ? fields.image : '',
        description: fields.description !== undefined ? fields.description : '',
        token
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

    axios.post(`${API_HOST}dictionary/services`, formData)
    .then((response) => {
        const { data } = response;

        dispatch({ type: RESPONSE_SERVICE_CREATE });
        if (!+data.error) {
            dispatch({
                type: ADD_SERVICE,
                payload: {
                    ...sendData,
                    id: data.data.id
                }
            });
            notification('success', 'Успех!', 'Услуга добавлена');
        } else {
            console.error(data.message);
            notification('error', 'Ошибка', 'Произошла ошибка при добавлении услуги');
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_SERVICE_CREATE });
        notification('error', 'Ошибка', 'Произошла ошибка при добавлении услуги');
        console.error(error);
    });
};

export const editServiceAction = (fields, token) => (dispatch) => {
    dispatch({ type: REQUEST_SERVICE_UPDATE });

    const sendData = {
        id: fields.id,
        name: fields.name,
        link: fields.link !== undefined ? fields.link : '',
        image: fields.image !== undefined ? fields.image : '',
        description: fields.description !== undefined ? fields.description : '',
        token
    };

    axios.put(`${API_HOST}dictionary/services`, sendData)
    .then((response) => {
        const { data } = response;

        dispatch({ type: RESPONSE_SERVICE_UPDATE });
        if (!+data.error) {
            dispatch({
                type: EDIT_SERVICE,
                payload: { ...sendData }
            });
            setTimeout(() => { history.push(DICTIONARY_SERVICES_ROUTE); }, 300);
            notification('success', 'Успех!', `Услуга "${sendData.name}" обновлена`);
        } else {
            console.error(data.message);
            notification('error', 'Ошибка', 'Произошла ошибка при обновлении услуги');
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_SERVICE_UPDATE });
        notification('error', 'Ошибка', 'Произошла ошибка при обновлении услуги');
        console.error(error);
    });
};

export const removeServicesAction = (id, token) => (dispatch) => {
    dispatch({ type: REQUEST_SERVICE_DELETE });

    axios.delete(`${API_HOST}dictionary/services/${id}?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_SERVICE_DELETE });
            dispatch({ type: REMOVE_SERVICE, payload: { id } });
            notification('success', 'Успех!', 'Услуга удалена');
        } else {
            dispatch({ type: RESPONSE_SERVICE_DELETE });
            notification('error', 'Ошибка', 'Произошла ошибка при удалении услуги');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_SERVICE_CREATE });
        notification('error', 'Ошибка', 'Произошла ошибка при удалении услуги');
        console.error(error);
    });
};
