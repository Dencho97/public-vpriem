import axios from 'axios';
import notification from '../../../components/notification';
import { history } from '../../../store';
import { API_HOST } from '../../../constans/api';
import { DICTIONARY_TYPES_ROUTE } from '../../../constans/routes';

export const SHOW_DRAWER_UPDATE_TYPES = 'SHOW_DRAWER_UPDATE_TYPES';
export const HIDE_DRAWER_UPDATE_TYPES = 'HIDE_DRAWER_UPDATE_TYPES';
export const REQUEST_TYPES_GET = 'REQUEST_TYPES_GET';
export const RESPONSE_TYPES_GET = 'RESPONSE_TYPES_GET';
export const REQUEST_TYPE_CREATE = 'REQUEST_TYPE_CREATE';
export const RESPONSE_TYPE_CREATE = 'RESPONSE_TYPE_CREATE';
export const REQUEST_TYPE_UPDATE = 'REQUEST_TYPE_UPDATE';
export const RESPONSE_TYPE_UPDATE = 'RESPONSE_TYPE_UPDATE';
export const REQUEST_TYPE_DELETE = 'REQUEST_TYPE_DELETE';
export const RESPONSE_TYPE_DELETE = 'RESPONSE_TYPE_DELETE';
export const ADD_TYPE = 'ADD_TYPE';
export const EDIT_TYPE = 'EDIT_TYPE';
export const REMOVE_TYPE = 'REMOVE_TYPE';

export const switchDrawer = (type, id = null) => (dispatch) => {
    switch (type) {
        case 'show_update':
            dispatch({ type: SHOW_DRAWER_UPDATE_TYPES, payload: { id } });
            break;
        case 'hide_update':
            dispatch({ type: HIDE_DRAWER_UPDATE_TYPES, payload: { id } });
            break;
        default:
            break;
    }
};

export const getTypesAction = token => (dispatch) => {
    dispatch({ type: REQUEST_TYPES_GET });

    axios.get(`${API_HOST}dictionary/types?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_TYPES_GET, payload: data.data ? data.data : [] });
        } else {
            dispatch({ type: RESPONSE_TYPES_GET, payload: [] });
            notification('error', 'Ошибка', 'Произошла ошибка при получении типов');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_TYPE_CREATE });
        notification('error', 'Ошибка', 'Произошла ошибка при получении типов');
        console.error(error);
    });
};

export const createTypeAction = (fields, token) => (dispatch) => {
    dispatch({ type: REQUEST_TYPE_CREATE });

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

    axios.post(`${API_HOST}dictionary/types`, formData)
    .then((response) => {
        const { data } = response;

        dispatch({ type: RESPONSE_TYPE_CREATE });
        if (!+data.error) {
            dispatch({
                type: ADD_TYPE,
                payload: {
                    ...sendData,
                    id: data.data.id
                }
            });
            notification('success', 'Успех!', 'Тип добавлен');
        } else {
            console.error(data.message);
            notification('error', 'Ошибка', 'Произошла ошибка при добавлении типа');
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_TYPE_CREATE });
        notification('error', 'Ошибка', 'Произошла ошибка при добавлении типа');
        console.error(error);
    });
};

export const editTypeAction = (fields, token) => (dispatch) => {
    dispatch({ type: REQUEST_TYPE_UPDATE });

    const sendData = {
        id: fields.id,
        name: fields.name,
        token
    };

    axios.put(`${API_HOST}dictionary/types`, sendData)
    .then((response) => {
        const { data } = response;

        dispatch({ type: RESPONSE_TYPE_UPDATE });
        if (!+data.error) {
            dispatch({
                type: EDIT_TYPE,
                payload: { ...sendData }
            });
            setTimeout(() => { history.push(DICTIONARY_TYPES_ROUTE); }, 300);
            notification('success', 'Успех!', `Тип "${sendData.name}" обновлен`);
        } else {
            console.error(data.message);
            notification('error', 'Ошибка', 'Произошла ошибка при обновлении типа');
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_TYPE_UPDATE });
        notification('error', 'Ошибка', 'Произошла ошибка при обновлении типа');
        console.error(error);
    });
};

export const removeTypesAction = (id, token) => (dispatch) => {
    dispatch({ type: REQUEST_TYPE_DELETE });

    axios.delete(`${API_HOST}dictionary/types/${id}?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_TYPE_DELETE });
            dispatch({ type: REMOVE_TYPE, payload: { id } });
            notification('success', 'Успех!', 'Тип удален');
        } else {
            dispatch({ type: RESPONSE_TYPE_DELETE });
            notification('error', 'Ошибка', 'Произошла ошибка при удалении типа');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_TYPE_CREATE });
        notification('error', 'Ошибка', 'Произошла ошибка при удалении типа');
        console.error(error);
    });
};
