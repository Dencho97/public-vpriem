import axios from 'axios';
import { API_HOST } from '../../../constans/api';
import notification from '../../../components/notification';
import { history } from '../../../store';
import { DICTIONARY_USERS_ROUTE } from '../../../constans/routes';
import { ADD_WORKER_FROM_USERS } from '../workers/actions';

export const SHOW_DRAWER_UPDATE_USERS = 'SHOW_DRAWER_UPDATE_USERS';
export const HIDE_DRAWER_UPDATE_USERS = 'HIDE_DRAWER_UPDATE_USERS';
export const REQUEST_USERS_GET = 'REQUEST_USERS_GET';
export const RESPONSE_USERS_GET = 'RESPONSE_USERS_GET';
export const REQUEST_USER_CREATE = 'REQUEST_USER_CREATE';
export const RESPONSE_USER_CREATE = 'RESPONSE_USER_CREATE';
export const REQUEST_USER_UPDATE = 'REQUEST_USER_UPDATE';
export const RESPONSE_USER_UPDATE = 'RESPONSE_USER_UPDATE';
export const REQUEST_USER_DELETE = 'REQUEST_USER_DELETE';
export const RESPONSE_USER_DELETE = 'RESPONSE_USER_DELETE';
export const ADD_USER = 'ADD_USER';
export const EDIT_USER = 'EDIT_USER';
export const REMOVE_USER = 'REMOVE_USER';

export const switchDrawer = (type, id = null) => (dispatch) => {
    switch (type) {
        case 'show_update':
            dispatch({ type: SHOW_DRAWER_UPDATE_USERS, payload: { id } });
            break;
        case 'hide_update':
            dispatch({ type: HIDE_DRAWER_UPDATE_USERS, payload: { id } });
            break;
        default:
            break;
    }
};

export const getUsersAction = (params, token) => (dispatch) => {
    dispatch({ type: REQUEST_USERS_GET });

    axios.get(`${API_HOST}dictionary/users?${Object.prototype.hasOwnProperty.call(params, 'withWorkers') ? `withWorkers=${params.withWorkers}&` : ''}token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_USERS_GET, payload: data.data ? data.data : [] });
        } else {
            dispatch({ type: RESPONSE_USERS_GET, payload: [] });
            notification('error', 'Ошибка', 'Произошла ошибка при получении пользователей');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_USER_CREATE });
        notification('error', 'Ошибка', 'Произошла ошибка при получении пользователей');
        console.error(error);
    });
};

export const createUsersAction = (fields, token) => (dispatch) => {
    dispatch({ type: REQUEST_USER_CREATE });

    const formData = new FormData();
    let sendData = {
        email: fields.email,
        password: fields.password,
        role: fields.role,
        create_worker: fields.createWorker ? 1 : 0,
        token
    };

    if (fields.createWorker) {
        sendData = {
            ...sendData,
            first_name: fields.worker_new_first,
            last_name: fields.worker_new_last,
            second_name: fields.worker_new_second
        };
    } else {
        sendData = {
            ...sendData,
            worker_id: fields.worker,
        };
    }

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

    axios.post(`${API_HOST}dictionary/users`, formData)
    .then((response) => {
        const { data } = response;

        dispatch({ type: RESPONSE_USER_CREATE });
        if (!+data.error) {
            if (fields.createWorker) {
                dispatch({
                    type: ADD_WORKER_FROM_USERS,
                    payload: {
                        id: data.data.new_worker,
                        first_name: sendData.first_name,
                        last_name: sendData.last_name,
                        second_name: sendData.second_name
                    }
                });
                sendData = {
                    ...sendData,
                    worker_id: data.data.new_worker,
                };
            }
            dispatch({
                type: ADD_USER,
                payload: {
                    ...sendData,
                    id: data.data.id
                }
            });
            notification('success', 'Успех!', `Пользователь создан. На почту ${fields.email} отправлено сообщение с подтверждением регистрации.`);
        } else {
            notification('error', 'Ошибка', data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_USER_CREATE });
        notification('error', 'Ошибка', 'Произошла ошибка при добавлении пользователя');
        console.error(error);
    });
};

export const editUsersAction = (fields, token) => (dispatch) => {
    dispatch({ type: REQUEST_USER_UPDATE });

    const sendData = {
        id: fields.id,
        email: fields.email,
        password: fields.password && fields.password !== '' ? fields.password : '',
        role: fields.role,
        worker_id: fields.worker,
        token
    };

    axios.put(`${API_HOST}dictionary/users`, sendData)
    .then((response) => {
        const { data } = response;

        dispatch({ type: RESPONSE_USER_UPDATE });
        if (!+data.error) {
            dispatch({
                type: EDIT_USER,
                payload: { ...sendData }
            });
            setTimeout(() => { history.push(DICTIONARY_USERS_ROUTE); }, 300);
            notification('success', 'Успех!', `Пользователь "${sendData.email}" обновлен`);
        } else {
            console.error(data.message);
            notification('error', 'Ошибка', 'Произошла ошибка при обновлении пользователя');
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_USER_UPDATE });
        notification('error', 'Ошибка', 'Произошла ошибка при обновлении пользователя');
        console.error(error);
    });
};

export const removeUsersAction = (id, token) => (dispatch) => {
    dispatch({ type: REQUEST_USER_DELETE });

    axios.delete(`${API_HOST}dictionary/users/${id}?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_USER_DELETE });
            dispatch({ type: REMOVE_USER, payload: { id } });
            notification('success', 'Успех!', 'Пользователь удален');
        } else {
            dispatch({ type: RESPONSE_USER_DELETE });
            notification('error', 'Ошибка', data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_USER_CREATE });
        notification('error', 'Ошибка', 'Произошла ошибка при удалении пользователя');
        console.error(error);
    });
};
