import axios from 'axios';
import moment from 'moment';

import notification from '../notification';
import { API_HOST } from '../../constans/api';

moment.locale('ru');

export const REQUEST_GET_NOTIFICATIONS = 'REQUEST_GET_NOTIFICATIONS';
export const RESPONSE_GET_NOTIFICATIONS = 'RESPONSE_GET_NOTIFICATIONS';
export const ADD_WRITE_SCHEDULE_NOTIFICATION = 'ADD_WRITE_SCHEDULE_NOTIFICATION';
export const REMOVE_WRITE_SCHEDULE_NOTIFICATION = 'REMOVE_WRITE_SCHEDULE_NOTIFICATION';

export const getNotificationsAction = (token = '') => (dispatch) => {
    dispatch({ type: REQUEST_GET_NOTIFICATIONS });

    axios.get(`${API_HOST}notifications?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({
                type: RESPONSE_GET_NOTIFICATIONS,
                payload: {
                    data: data.data
                }
            });
        } else {
            dispatch({ type: RESPONSE_GET_NOTIFICATIONS, payload: [] });
            notification('error', 'Ошибка', 'Произошла ошибка при получении оповещений');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_GET_NOTIFICATIONS, payload: [] });
        notification('error', 'Ошибка', 'Произошла ошибка при получении оповещений');
        console.error(error);
    });
};

export const openNotificationAction = id => (dispatch) => {

};
