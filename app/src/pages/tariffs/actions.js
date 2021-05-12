import axios from 'axios';
import notification from '../../components/notification';
import { API_HOST } from '../../constans/api';


export const REQUEST_TARIFFS_GET = 'REQUEST_TARIFFS_GET';
export const RESPONSE_TARIFFS_GET = 'RESPONSE_TARIFFS_GET';
export const CHANGE_TARIFF = 'CHANGE_TARIFF';
export const REQUEST_PAYMENT_CREATE = 'REQUEST_PAYMENT_CREATE';
export const RESPONSE_PAYMENT_CREATE = 'RESPONSE_PAYMENT_CREATE';

export const getTariffsAction = token => (dispatch) => {
    dispatch({ type: REQUEST_TARIFFS_GET });

    axios.get(`${API_HOST}tariffs?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_TARIFFS_GET, payload: data.data ? data.data : [] });
        } else {
            dispatch({ type: RESPONSE_TARIFFS_GET, payload: [] });
            notification('error', 'Ошибка', data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_TARIFFS_GET, payload: [] });
        notification('error', 'Ошибка', 'Произошла ошибка при получении тарифов');
        console.error(error);
    });
};

export const changeTariffAction = (field, value) => (dispatch) => {
    dispatch({ type: CHANGE_TARIFF, payload: { [field]: value } });
};

export const selectPaymentAction = (type, tariff, fields, token) => (dispatch) => {
    const formData = new FormData();
    const sendData = {
        type,
        tariff,
        email: fields.email,
        token
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

    axios.post(`${API_HOST}payment`, sendData)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            if (type === 'by_card') {
                window.location.href = data.data.redirectForm;
            } else {
                window.open(data.data.invoicePDF, '_self');
            }
        } else {
            dispatch({ type: RESPONSE_PAYMENT_CREATE, payload: [] });
            notification('error', 'Ошибка', data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_PAYMENT_CREATE, payload: [] });
        notification('error', 'Ошибка', 'Произошла ошибка при создании платежа');
        console.error(error);
    });
};
