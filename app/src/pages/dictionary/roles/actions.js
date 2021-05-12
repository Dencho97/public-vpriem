import axios from 'axios';
import notification from '../../../components/notification';
import { history } from '../../../store';
import { API_HOST } from '../../../constans/api';
import { DICTIONARY_ROLES_ROUTE } from '../../../constans/routes';

export const SHOW_DRAWER_UPDATE_ROLES = 'SHOW_DRAWER_UPDATE_ROLES';
export const HIDE_DRAWER_UPDATE_ROLES = 'HIDE_DRAWER_UPDATE_ROLES';
export const REQUEST_ROLES_GET = 'REQUEST_ROLES_GET';
export const RESPONSE_ROLES_GET = 'RESPONSE_ROLES_GET';
export const REQUEST_ROLE_CREATE = 'REQUEST_ROLE_CREATE';
export const RESPONSE_ROLE_CREATE = 'RESPONSE_ROLE_CREATE';
export const REQUEST_ROLE_UPDATE = 'REQUEST_ROLE_UPDATE';
export const RESPONSE_ROLE_UPDATE = 'RESPONSE_ROLE_UPDATE';
export const REQUEST_ROLE_DELETE = 'REQUEST_ROLE_DELETE';
export const RESPONSE_ROLE_DELETE = 'RESPONSE_ROLE_DELETE';
export const ADD_ROLE = 'ADD_ROLE';
export const EDIT_ROLE = 'EDIT_ROLE';
export const REMOVE_ROLE = 'REMOVE_ROLE';

export const switchDrawer = (type, id = null) => (dispatch) => {
    switch (type) {
        case 'show_update':
            dispatch({ type: SHOW_DRAWER_UPDATE_ROLES, payload: { id } });
            break;
        case 'hide_update':
            dispatch({ type: HIDE_DRAWER_UPDATE_ROLES, payload: { id } });
            break;
        default:
            break;
    }
};

export const getRolesAction = token => (dispatch) => {
    dispatch({ type: REQUEST_ROLES_GET });

    axios.get(`${API_HOST}dictionary/roles?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_ROLES_GET, payload: data.data ? data.data : [] });
        } else {
            dispatch({ type: RESPONSE_ROLES_GET, payload: [] });
            notification('error', 'Ошибка', 'Произошла ошибка при получении ролей');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_ROLE_CREATE });
        notification('error', 'Ошибка', 'Произошла ошибка при получении ролей');
        console.error(error);
    });
};

export const createRolesAction = (fields, token) => (dispatch) => {
    dispatch({ type: REQUEST_ROLE_CREATE });

    const formData = new FormData();
    const permissions = {};
    for (const key in fields) {
        if (key !== 'name') {
            permissions[key] = fields[key] !== undefined && fields[key];
        }
    }

    const sendData = {
        name: fields.name,
        permissions,
        token
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            if (key === 'permissions') {
                formData.append(key, sendData[key] !== undefined ? JSON.stringify(sendData[key]) : '');
            } else {
                formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
            }
        }
    }

    axios.post(`${API_HOST}dictionary/roles`, formData)
    .then((response) => {
        const { data } = response;

        dispatch({ type: RESPONSE_ROLE_CREATE });
        if (!+data.error) {
            dispatch({
                type: ADD_ROLE,
                payload: {
                    ...sendData,
                    id: data.data.id
                }
            });
            notification('success', 'Успех!', 'Роль добавлена');
        } else {
            console.error(data.message);
            notification('error', 'Ошибка', 'Произошла ошибка при добавлении роли');
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_ROLE_CREATE });
        notification('error', 'Ошибка', 'Произошла ошибка при добавлении роли');
        console.error(error);
    });
};

export const editRolesAction = (fields, token) => (dispatch) => {
    dispatch({ type: REQUEST_ROLE_UPDATE });

    const permissions = {};
    for (const key in fields) {
        if (key !== 'name' && key !== 'id') {
            permissions[key] = fields[key] !== undefined && fields[key];
        }
    }

    const sendData = {
        id: fields.id,
        name: fields.name,
        permissions,
        token
    };

    axios.put(`${API_HOST}dictionary/roles`, { ...sendData, permissions: JSON.stringify(sendData.permissions) })
    .then((response) => {
        const { data } = response;

        dispatch({ type: RESPONSE_ROLE_UPDATE });
        if (!+data.error) {
            dispatch({
                type: EDIT_ROLE,
                payload: { ...sendData }
            });
            setTimeout(() => { history.push(DICTIONARY_ROLES_ROUTE); }, 300);
            notification('success', 'Успех!', `Роль "${sendData.name}" обновлена`);
        } else {
            console.error(data.message);
            notification('error', 'Ошибка', 'Произошла ошибка при обновлении роли');
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_ROLE_UPDATE });
        notification('error', 'Ошибка', 'Произошла ошибка при обновлении роли');
        console.error(error);
    });
};

export const removeRolesAction = (id, token) => (dispatch) => {
    dispatch({ type: REQUEST_ROLE_DELETE });

    axios.delete(`${API_HOST}dictionary/roles/${id}?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_ROLE_DELETE });
            dispatch({ type: REMOVE_ROLE, payload: { id } });
            notification('success', 'Успех!', 'Роль удалена');
        } else {
            dispatch({ type: RESPONSE_ROLE_DELETE });
            notification('error', 'Ошибка', 'Произошла ошибка при удалении роли');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_ROLE_CREATE });
        notification('error', 'Ошибка', 'Произошла ошибка при удалении роли');
        console.error(error);
    });
};
