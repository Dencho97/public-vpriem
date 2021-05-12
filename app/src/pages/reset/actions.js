import axios from 'axios';

import { API_HOST } from '../../constans/api';
import notification from '../../components/notification';
import { LOGIN_ROUTE } from '../../constans/routes';

export const REQUEST_RESET_PASSWORD = 'REQUEST_RESET_PASSWORD';
export const RESPONSE_RESET_PASSWORD = 'RESPONSE_RESET_PASSWORD';
export const REQUEST_CONFIRM_RESET_PASSWORD = 'REQUEST_CONFIRM_RESET_PASSWORD';
export const RESPONSE_CONFIRM_RESET_PASSWORD = 'RESPONSE_CONFIRM_RESET_PASSWORD';

export const resetAction = email => (dispatch) => {
    dispatch({ type: REQUEST_RESET_PASSWORD });

    const formData = new FormData();
    const sendData = {
        email
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

    axios.post(`${API_HOST}users/reset`, formData)
      .then((response) => {
        const { data } = response;
        dispatch({
            type: RESPONSE_RESET_PASSWORD,
            payload: data
        });
      })
      .catch((error) => {
            dispatch({ type: RESPONSE_RESET_PASSWORD, payload: null });
            console.error(error);
      });
};

export const confirmResetAction = resetCode => (dispatch) => {
    dispatch({ type: REQUEST_CONFIRM_RESET_PASSWORD });

    axios.get(`${API_HOST}users/reset?reset_code=${resetCode}`)
      .then((response) => {
        const { data } = response;
        dispatch({
            type: RESPONSE_CONFIRM_RESET_PASSWORD,
            payload: { error: +data.error }
        });
        if (!+data.error) {
            setTimeout(() => {
                window.location.replace(`${window.location.origin}${LOGIN_ROUTE}`);
            }, 3000);
            console.log('ok');
        } else {
            notification('error', 'Ошибка', data.message);
        }
      })
      .catch((error) => {
            dispatch({ type: RESPONSE_CONFIRM_RESET_PASSWORD, payload: { error: 1 } });
            console.error(error);
      });
};
