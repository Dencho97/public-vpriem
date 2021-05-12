import axios from 'axios';
import notification from '../../../components/notification';
import { API_HOST } from '../../../constans/api';

export const REQUEST_HISTORY_PAYMENTS = 'REQUEST_HISTORY_PAYMENTS';
export const RESPONSE_HISTORY_PAYMENTS = 'RESPONSE_HISTORY_PAYMENTS';

export const getPaymentsHistoryAction = token => (dispatch) => {
    dispatch({ type: REQUEST_HISTORY_PAYMENTS });

    axios.get(`${API_HOST}payments/history?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_HISTORY_PAYMENTS, payload: data.data ? data.data : [] });
        } else {
            dispatch({ type: RESPONSE_HISTORY_PAYMENTS, payload: [] });
            notification('error', 'Ошибка', data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_HISTORY_PAYMENTS, payload: null });
        notification('error', 'Ошибка', 'Произошла ошибка при получении ролей');
        console.error(error);
    });
};
