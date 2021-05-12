import axios from 'axios';

import { API_HOST } from '../../constans/api';
import notification from '../../components/notification';
import { LOGIN_ROUTE } from '../../constans/routes';

export const REQUEST_REGISTRATION = 'REQUEST_REGISTRATION';
export const RESPONSE_REGISTRATION = 'RESPONSE_REGISTRATION';
export const REQUEST_CONFIRM_REGISTRATION = 'REQUEST_CONFIRM_REGISTRATION';
export const RESPONSE_CONFIRM_REGISTRATION = 'RESPONSE_CONFIRM_REGISTRATION';

export const registrationAction = userdata => (dispatch) => {
    dispatch({ type: REQUEST_REGISTRATION });

    const formData = new FormData();
    const sendData = {
        email: userdata.email,
        password: userdata.password,
        referal: userdata.referal
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

    axios.post(`${API_HOST}registration`, formData)
      .then((response) => {
        const { data } = response;
        dispatch({
            type: RESPONSE_REGISTRATION,
            payload: data
        });
      })
      .catch((error) => {
            dispatch({ type: RESPONSE_REGISTRATION, payload: null });
            console.error(error);
      });
};

export const confirmRegistrationAction = confirmCode => (dispatch) => {
    dispatch({ type: REQUEST_CONFIRM_REGISTRATION });

    const formData = new FormData();
    const sendData = {
        confirm_code: confirmCode
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

    axios.post(`${API_HOST}registration/confirm`, formData)
      .then((response) => {
        const { data } = response;
        dispatch({
            type: RESPONSE_CONFIRM_REGISTRATION,
            payload: { error: +data.error }
        });
        if (!+data.error) {
            setTimeout(() => {
                window.location.replace(`${window.location.origin}${LOGIN_ROUTE}`);
            }, 3000);
        } else {
            notification('error', 'Ошибка', data.message);
        }
      })
      .catch((error) => {
            dispatch({ type: RESPONSE_CONFIRM_REGISTRATION, payload: { error: 1 } });
            console.error(error);
      });
};
