import axios from 'axios';
import notification from '../../components/notification';
import { API_HOST } from '../../constans/api';

export const REQUEST_LOG_GET = 'REQUEST_LOG_GET';
export const RESPONSE_LOG_GET = 'RESPONSE_LOG_GET';
export const CHANGE_FILTER_LOG = 'CHANGE_FILTER_LOG';

export const getLogAction = (params, token) => (dispatch) => {
    dispatch({ type: REQUEST_LOG_GET });

    axios.get(`${API_HOST}log?user=${params.user}&date=[${params.date[0].format('X')},${params.date[1].format('X')}]&token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_LOG_GET, payload: data.data ? data.data : [] });
        } else {
            dispatch({ type: RESPONSE_LOG_GET, payload: [] });
            notification('error', 'Ошибка', 'Произошла ошибка при получении логов');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_LOG_GET });
        notification('error', 'Ошибка', 'Произошла ошибка при получении логов');
        console.error(error);
    });
};

export const changeFilterAction = (field, value) => (dispatch) => {
    dispatch({ type: CHANGE_FILTER_LOG, payload: { field, value } });
};
