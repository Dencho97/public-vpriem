import axios from 'axios';
import moment from 'moment';
import Cookies from 'js-cookie';
import notification from '../../components/notification';
import { API_HOST } from '../../constans/api';

moment.locale('ru');

export const CHANGE_FILTER_REPORT = 'CHANGE_FILTER_REPORT';
export const REQUEST_REPORT_GET = 'REQUEST_REPORT_GET';
export const RESPONSE_REPORT_GET = 'RESPONSE_REPORT_GET';

export const changeReportFilterAction = (property, value) => (dispatch) => {
    dispatch({ type: CHANGE_FILTER_REPORT, payload: { property, value } });
};

export const getReportAdministratorsAction = (date, filial) => (dispatch) => {
    dispatch({ type: REQUEST_REPORT_GET });

    const token = Cookies.get('token');

    axios.get(`${API_HOST}report/administators?currentDate=${+date.format('x')}&filial=${filial}&token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_REPORT_GET, payload: data.data ? data.data : [] });
        } else {
            dispatch({ type: RESPONSE_REPORT_GET, payload: [] });
            notification('error', 'Ошибка', 'Произошла ошибка при получении отчётов');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_REPORT_GET });
        notification('error', 'Ошибка', 'Произошла ошибка при получении отчётов');
        console.error(error);
    });
};

export const getReportDoctorsAction = (date, filial) => (dispatch) => {
    dispatch({ type: REQUEST_REPORT_GET });

    const token = Cookies.get('token');

    axios.get(`${API_HOST}report/doctors?startDate=${+date[0].format('x')}&endDate=${+date[1].format('x')}&filial=${filial}&token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_REPORT_GET, payload: data.data ? data.data : [] });
        } else {
            dispatch({ type: RESPONSE_REPORT_GET, payload: [] });
            notification('error', 'Ошибка', 'Произошла ошибка при получении отчётов');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_REPORT_GET });
        notification('error', 'Ошибка', 'Произошла ошибка при получении отчётов');
        console.error(error);
    });
};

export const getReportAgeAction = () => (dispatch) => {
    dispatch({ type: REQUEST_REPORT_GET });

    const token = Cookies.get('token');

    axios.get(`${API_HOST}report/age?&token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_REPORT_GET, payload: data.data ? data.data : [] });
        } else {
            dispatch({ type: RESPONSE_REPORT_GET, payload: [] });
            notification('error', 'Ошибка', 'Произошла ошибка при получении отчётов');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_REPORT_GET });
        notification('error', 'Ошибка', 'Произошла ошибка при получении отчётов');
        console.error(error);
    });
};

export const getReportReceptionAction = (date, filial) => (dispatch) => {
    dispatch({ type: REQUEST_REPORT_GET });

    const token = Cookies.get('token');

    axios.get(`${API_HOST}report/reception?startDate=${+date[0].format('x')}&endDate=${+date[1].format('x')}&filial=${filial}&token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_REPORT_GET, payload: data.data ? data.data : [] });
        } else {
            dispatch({ type: RESPONSE_REPORT_GET, payload: [] });
            notification('error', 'Ошибка', 'Произошла ошибка при получении отчётов');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_REPORT_GET });
        notification('error', 'Ошибка', 'Произошла ошибка при получении отчётов');
        console.error(error);
    });
};

export const getReportServicesAction = (date, filial) => (dispatch) => {
    dispatch({ type: REQUEST_REPORT_GET });

    const token = Cookies.get('token');

    axios.get(`${API_HOST}report/services?startDate=${+date[0].format('x')}&endDate=${+date[1].format('x')}&filial=${filial}&token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_REPORT_GET, payload: data.data ? data.data : [] });
        } else {
            dispatch({ type: RESPONSE_REPORT_GET, payload: [] });
            notification('error', 'Ошибка', 'Произошла ошибка при получении отчётов');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_REPORT_GET });
        notification('error', 'Ошибка', 'Произошла ошибка при получении отчётов');
        console.error(error);
    });
};

export const getReportDynimicsWritesAction = (date, filial) => (dispatch) => {
    dispatch({ type: REQUEST_REPORT_GET });

    const token = Cookies.get('token');

    axios.get(`${API_HOST}report/dynamicWrites?startDate=${+date[0].format('x')}&endDate=${+date[1].format('x')}&filial=${filial}&token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_REPORT_GET, payload: data.data ? data.data : [] });
        } else {
            dispatch({ type: RESPONSE_REPORT_GET, payload: [] });
            notification('error', 'Ошибка', 'Произошла ошибка при получении отчётов');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_REPORT_GET });
        notification('error', 'Ошибка', 'Произошла ошибка при получении отчётов');
        console.error(error);
    });
};
