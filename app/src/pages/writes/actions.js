import axios from 'axios';
import moment from 'moment';
import notification from '../../components/notification';
import { API_HOST } from '../../constans/api';

moment.locale('ru');

export const REQUEST_WRITES_GET = 'REQUEST_WRITES_GET';
export const RESPONSE_WRITES_GET = 'RESPONSE_WRITES_GET';

export const getWritesAction = (userdata, token) => (dispatch) => {
    dispatch({ type: REQUEST_WRITES_GET });

    const sendData = {
        date: userdata.date !== undefined ? +userdata.date.format('x') : '',
        phone: userdata.phone !== undefined ? userdata.phone : '',
        'first-name': userdata['first-name'] !== undefined ? userdata['first-name'] : '',
        'last-name': userdata['last-name'] !== undefined ? userdata['last-name'] : '',
    };

    axios.get(`${API_HOST}writes?date=${sendData.date}&phone=${sendData.phone}&first-name=${sendData['first-name']}&last-name=${sendData['last-name']}&token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_WRITES_GET, payload: data.data ? data.data : [] });
        } else {
            dispatch({ type: RESPONSE_WRITES_GET, payload: [] });
            notification('error', 'Ошибка', 'Произошла ошибка при получении записей');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_WRITES_GET });
        notification('error', 'Ошибка', 'Произошла ошибка при получении записей');
        console.error(error);
    });
};
