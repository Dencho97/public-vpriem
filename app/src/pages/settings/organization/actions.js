import axios from 'axios';
import moment from 'moment';
import notification from '../../../components/notification';
import { API_HOST } from '../../../constans/api';

moment.locale('ru');

export const REQUEST_SETTINGS_ORG_GET = 'REQUEST_SETTINGS_ORG_GET';
export const RESPONSE_SETTINGS_ORG_GET = 'RESPONSE_SETTINGS_ORG_GET';
export const REQUEST_SETTINGS_ORG_UPDATE = 'REQUEST_SETTINGS_ORG_UPDATE';
export const RESPONSE_SETTINGS_ORG_UPDATE = 'RESPONSE_SETTINGS_ORG_UPDATE';

export const getSettingsOrganizationAction = token => (dispatch) => {
    dispatch({ type: REQUEST_SETTINGS_ORG_GET });

    axios.get(`${API_HOST}organizations?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_SETTINGS_ORG_GET, payload: data.data ? data.data : [] });
        } else {
            dispatch({ type: RESPONSE_SETTINGS_ORG_GET, payload: [] });
            notification('error', 'Ошибка', data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_SETTINGS_ORG_GET, payload: [] });
        notification('error', 'Ошибка', 'Произошла ошибка при получении настроек');
        console.error(error);
    });
};

export const updateSettingsOrganizationAction = (fields, token) => (dispatch) => {
    dispatch({ type: REQUEST_SETTINGS_ORG_UPDATE });

    const formData = new FormData();
    let sendData = { token };

    if (fields.type === 1) {
        sendData = {
            ...sendData,
            type: fields.type,
            name: fields['ur-name'],
            short_name: fields['ur-short-name'],
            ur_address: fields['ur-address'],
            post_address: fields['ur-post-address'],
            phone: fields['ur-phone'],
            inn: fields['ur-inn'],
            ogrn: fields['ur-ogrn'],
            kpp: fields['ur-kpp'],
            bik: fields['ur-bik'],
            bank: fields['ur-bank'],
            representative_type: +fields['ur-representative-type'],
            сorrespondent_number: fields['ur-сorrespondent-number'],
            payment_number: fields['ur-payment-number'],
            getting_type: +fields['ur-getting-type'],
            docs_address: +fields['ur-getting-type'] === 2 ? fields['ur-address-docs'] : '',
            representative_position: +fields['ur-representative-type'] === 2 ? fields['ur-representative-position'] : '',
            based: +fields['ur-representative-type'] === 2 ? fields['ur-based'].file : '',
        };
    }

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key]);
        }
    }

    axios.post(`${API_HOST}organizations`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_SETTINGS_ORG_UPDATE, payload: sendData });
            notification('success', 'Успех!', 'Реквизиты организации обновлены');
        } else {
            dispatch({ type: RESPONSE_SETTINGS_ORG_UPDATE });
            notification('error', 'Ошибка', data.message);
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_SETTINGS_ORG_UPDATE });
        notification('error', 'Ошибка', 'Произошла ошибка при получении организации');
        console.error(error);
    });
};
