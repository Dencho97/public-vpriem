import axios from 'axios';
import moment from 'moment';
import notification from '../../../components/notification';
import { API_HOST } from '../../../constans/api';

moment.locale('ru');

export const REQUEST_SETTINGS_GET = 'REQUEST_SETTINGS_GET';
export const RESPONSE_SETTINGS_GET = 'RESPONSE_SETTINGS_GET';
export const REQUEST_SETTINGS_UPDATE = 'REQUEST_SETTINGS_UPDATE';
export const RESPONSE_SETTINGS_UPDATE = 'RESPONSE_SETTINGS_UPDATE';

export const getSettingsAction = token => (dispatch) => {
    dispatch({ type: REQUEST_SETTINGS_GET });

    axios.get(`${API_HOST}settings?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_SETTINGS_GET, payload: data.data ? data.data : [] });
        } else {
            dispatch({ type: RESPONSE_SETTINGS_GET, payload: [] });
            notification('error', 'Ошибка', 'Произошла ошибка при получении настроек');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_SETTINGS_GET, payload: [] });
        notification('error', 'Ошибка', 'Произошла ошибка при получении настроек');
        console.error(error);
    });
};

export const updateSettingsAction = (fields, token) => (dispatch) => {
    dispatch({ type: REQUEST_SETTINGS_UPDATE });

    let mainColor = fields['setting-main-color'];
    let secondColor = fields['setting-second-color'];

    if (typeof mainColor === 'object') mainColor = mainColor.hex;
    if (typeof secondColor === 'object') secondColor = secondColor.hex;

    const sendData = {
        logo: fields['setting-logo'] !== undefined && typeof fields['setting-logo'] === 'object' ? fields['setting-logo'].fileInBase64 : null,
        placeholder: fields['setting-placeholder'] !== undefined && typeof fields['setting-placeholder'] === 'object' ? fields['setting-placeholder'].fileInBase64 : null,
        app: fields['setting-app-name'] !== undefined && fields['setting-app-name'] !== '' ? fields['setting-app-name'] : null,
        vk_secret: fields['setting-secret-vk'] !== undefined && fields['setting-secret-vk'] !== '' ? fields['setting-secret-vk'] : null,
        mail_recipients: fields['setting-mails-recipients'] !== undefined && fields['setting-mails-recipients'] !== '' ? fields['setting-mails-recipients'] : null,
        main_color: mainColor,
        second_color: secondColor,
        token
    };

    axios.put(`${API_HOST}settings`, sendData)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_SETTINGS_UPDATE, payload: data.data ? data.data : null });
            notification('success', 'Успех!', 'Настройки обновлены');
        } else {
            dispatch({ type: RESPONSE_SETTINGS_UPDATE });
            notification('error', 'Ошибка', data.message);
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_SETTINGS_UPDATE });
        notification('error', 'Ошибка', 'Произошла ошибка при получении настроек');
        console.error(error);
    });
};
