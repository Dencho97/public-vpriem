import axios from 'axios';
import notification from '../../components/notification';
import { API_HOST } from '../../constans/api';

export const REQUEST_REFERALS = 'REQUEST_REFERALS';
export const RESPONSE_REFERALS = 'RESPONSE_REFERALS';
export const REQUEST_WITHDRAW_REFERALS = 'REQUEST_WITHDRAW_REFERALS';
export const RESPONSE_WITHDRAW_REFERALS = 'RESPONSE_WITHDRAW_REFERALS';
export const SWITCH_PANE_REFERALS = 'SWITCH_REFERALS';

export const switchPaneReferalsAction = pane => (dispatch) => {
    dispatch({ type: SWITCH_PANE_REFERALS, payload: pane });
};

export const getReferalsAction = token => (dispatch) => {
    dispatch({ type: REQUEST_REFERALS });

    axios.get(`${API_HOST}referals?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_REFERALS, payload: data.data ? data.data : [] });
        } else {
            dispatch({ type: RESPONSE_REFERALS, payload: [] });
            notification('error', 'Ошибка', data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_REFERALS, payload: null });
        notification('error', 'Ошибка', 'Произошла ошибка');
        console.error(error);
    });
};


export const withdrawReferalsAction = (fields, token) => (dispatch) => {
    const formData = new FormData();
    const sendData = {
        summ: fields.summ,
        email: fields.email,
        token
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

    dispatch({ type: REQUEST_WITHDRAW_REFERALS });

    axios.post(`${API_HOST}referals/withdraw`, sendData)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_WITHDRAW_REFERALS });
            dispatch(switchPaneReferalsAction('referal'));
            notification('success', 'Отправлено!', 'Заявка на вывод средств отправлена');
        } else {
            dispatch({ type: RESPONSE_WITHDRAW_REFERALS });
            notification('error', 'Ошибка', data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_WITHDRAW_REFERALS });
        notification('error', 'Ошибка', 'Произошла ошибка');
        console.error(error);
    });
};
