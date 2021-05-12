import axios from 'axios';
import notification from '../../../components/notification';
import { history } from '../../../store';
import { API_HOST } from '../../../constans/api';
import { DICTIONARY_FILIALS_ROUTE } from '../../../constans/routes';

export const SHOW_DRAWER_UPDATE_FILIALS = 'SHOW_DRAWER_UPDATE_FILIALS';
export const HIDE_DRAWER_UPDATE_FILIALS = 'HIDE_DRAWER_UPDATE_FILIALS';
export const REQUEST_FILIALS_GET = 'REQUEST_FILIALS_GET';
export const RESPONSE_FILIALS_GET = 'RESPONSE_FILIALS_GET';
export const REQUEST_FILIAL_CREATE = 'REQUEST_FILIAL_CREATE';
export const RESPONSE_FILIAL_CREATE = 'RESPONSE_FILIAL_CREATE';
export const REQUEST_FILIAL_UPDATE = 'REQUEST_FILIAL_UPDATE';
export const RESPONSE_FILIAL_UPDATE = 'RESPONSE_FILIAL_UPDATE';
export const REQUEST_FILIAL_DELETE = 'REQUEST_FILIAL_DELETE';
export const RESPONSE_FILIAL_DELETE = 'RESPONSE_FILIAL_DELETE';
export const ADD_FILIAL = 'ADD_FILIAL';
export const EDIT_FILIAL = 'EDIT_FILIAL';
export const REMOVE_FILIAL = 'REMOVE_FILIAL';

export const switchDrawer = (type, id = null) => (dispatch) => {
    switch (type) {
        case 'show_update':
            dispatch({ type: SHOW_DRAWER_UPDATE_FILIALS, payload: { id } });
            break;
        case 'hide_update':
            dispatch({ type: HIDE_DRAWER_UPDATE_FILIALS, payload: { id } });
            break;
        default:
            break;
    }
};

export const getFilialsAction = token => (dispatch) => {
    dispatch({ type: REQUEST_FILIALS_GET });

    axios.get(`${API_HOST}dictionary/filials?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_FILIALS_GET, payload: data.data ? data.data : [] });
        } else {
            dispatch({ type: RESPONSE_FILIALS_GET, payload: [] });
            notification('error', 'Ошибка', 'Произошла ошибка при получении филиалов');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_FILIAL_CREATE });
        notification('error', 'Ошибка', 'Произошла ошибка при получении филиалов');
        console.error(error);
    });
};

export const createFilialAction = (fields, token) => (dispatch) => {
    dispatch({ type: REQUEST_FILIAL_CREATE });

    const formData = new FormData();
    const sendData = {
        name: fields.name,
        token
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

    axios.post(`${API_HOST}dictionary/filials`, formData)
    .then((response) => {
        const { data } = response;

        dispatch({ type: RESPONSE_FILIAL_CREATE });
        if (!+data.error) {
            dispatch({
                type: ADD_FILIAL,
                payload: {
                    ...sendData,
                    id: data.data.id
                }
            });
            notification('success', 'Успех!', 'Филиал добавлен');
        } else {
            console.error(data.message);
            notification('error', 'Ошибка', 'Произошла ошибка при добавлении филиала');
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_FILIAL_CREATE });
        notification('error', 'Ошибка', 'Произошла ошибка при добавлении филиала');
        console.error(error);
    });
};

export const editFilialAction = (fields, token) => (dispatch) => {
    dispatch({ type: REQUEST_FILIAL_UPDATE });

    const sendData = {
        id: fields.id,
        name: fields.name,
        token
    };

    axios.put(`${API_HOST}dictionary/filials`, sendData)
    .then((response) => {
        const { data } = response;

        dispatch({ type: RESPONSE_FILIAL_UPDATE });
        if (!+data.error) {
            dispatch({
                type: EDIT_FILIAL,
                payload: { ...sendData }
            });
            setTimeout(() => { history.push(DICTIONARY_FILIALS_ROUTE); }, 300);
            notification('success', 'Успех!', `Филиал "${sendData.name}" обновлен`);
        } else {
            console.error(data.message);
            notification('error', 'Ошибка', 'Произошла ошибка при обновлении филиала');
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_FILIAL_UPDATE });
        notification('error', 'Ошибка', 'Произошла ошибка при обновлении филиала');
        console.error(error);
    });
};

export const removeFilialsAction = (id, token) => (dispatch) => {
    dispatch({ type: REQUEST_FILIAL_DELETE });

    axios.delete(`${API_HOST}dictionary/filials/${id}?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_FILIAL_DELETE });
            dispatch({ type: REMOVE_FILIAL, payload: { id } });
            notification('success', 'Успех!', 'Филиал удален');
        } else {
            dispatch({ type: RESPONSE_FILIAL_DELETE });
            notification('error', 'Ошибка', 'Произошла ошибка при удалении филиала');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_FILIAL_CREATE });
        notification('error', 'Ошибка', 'Произошла ошибка при удалении филиала');
        console.error(error);
    });
};
