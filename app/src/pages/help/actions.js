import axios from 'axios';
import notification from '../../components/notification';
import { API_HOST } from '../../constans/api';

export const REQUEST_SEND_SUPPORT_MESSAGE = 'REQUEST_SEND_SUPPORT_MESSAGE';
export const RESPONSE_SEND_SUPPORT_MESSAGE = 'RESPONSE_SEND_SUPPORT_MESSAGE';

export const sendSupportMesageAction = (userdata, form, token) => (dispatch) => {
    dispatch({ type: REQUEST_SEND_SUPPORT_MESSAGE });

    const formData = new FormData();
    const sendData = {
        message: userdata.message,
        token
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

    axios.post(`${API_HOST}help`, formData)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            form.resetFields();
            dispatch({ type: RESPONSE_SEND_SUPPORT_MESSAGE });
            notification('success', 'Успех!', 'Ваше сообщение успешно отправлено');
        } else {
            dispatch({ type: RESPONSE_SEND_SUPPORT_MESSAGE });
            notification('error', 'Ошибка', data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_SEND_SUPPORT_MESSAGE });
        notification('error', 'Ошибка', 'Произошла ошибка при отправке сообщения');
        console.error(error);
    });
};
