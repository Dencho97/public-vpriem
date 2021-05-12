import axios from 'axios';
import moment from 'moment';

import notification from '../../components/notification';
import { API_HOST } from '../../constans/api';
import { STATUSES } from '../../constans/statuses-writes';
import { history } from '../../store';
import { SCHEDULE_ROUTE } from '../../constans/routes';

moment.locale('ru');

export const SWITCH_MODAL_SHEDULE = 'SHOW_MODAL_SHEDULE';
export const REQUEST_GET_SCHEDULE = 'REQUEST_GET_SCHEDULE';
export const RESPONSE_GET_SCHEDULE = 'RESPONSE_GET_SCHEDULE';
export const REQUEST_CREATE_TICKET_SCHEDULE = 'REQUEST_CREATE_TICKET_SCHEDULE';
export const RESPONSE_CREATE_TICKET_SCHEDULE = 'RESPONSE_CREATE_TICKET_SCHEDULE';
export const REQUEST_DELETE_TICKET_SCHEDULE = 'REQUEST_DELETE_TICKET_SCHEDULE';
export const RESPONSE_DELETE_TICKET_SCHEDULE = 'RESPONSE_DELETE_TICKET_SCHEDULE';
export const REMOVE_USER_TICKET_SCHEDULE = 'REMOVE_USER_TICKET_SCHEDULE';
export const ADD_USER_TICKET_SCHEDULE = 'ADD_USER_TICKET_SCHEDULE';
export const DIVIDE_TICKET_SCHEDULE = 'DIVIDE_TICKET_SCHEDULE';
export const REMOVE_DIVIDE_TICKET_SCHEDULE = 'REMOVE_DIVIDE_TICKET_SCHEDULE';
export const RETIME_TICKET_SCHEDULE = 'RETIME_TICKET_SCHEDULE';
export const SWITCH_HIDE_TICKET_SCHEDULE = 'SWITCH_HIDE_TICKET_SCHEDULE';
export const SET_FILTER_SCHEDULE = 'SET_FILTER_SCHEDULE';
export const ADD_WRITE_SCHEDULE = 'ADD_WRITE_SCHEDULE';
export const REQUEST_CREATE_WRITE_SCHEDULE = 'REQUEST_CREATE_WRITE_SCHEDULE';
export const RESPONSE_CREATE_WRITE_SCHEDULE = 'REQUEST_CREATE_WRITE_SCHEDULE';
export const REQUEST_EDIT_WRITE_SCHEDULE = 'REQUEST_EDIT_WRITE_SCHEDULE';
export const RESPONSE_EDIT_WRITE_SCHEDULE = 'RESPONSE_EDIT_WRITE_SCHEDULE';
export const REQUEST_DELETE_WRITE_SCHEDULE = 'REQUEST_DELETE_WRITE_SCHEDULE';
export const RESPONSE_DELETE_WRITE_SCHEDULE = 'RESPONSE_DELETE_WRITE_SCHEDULE';
export const REMOVE_WRITE_SCHEDULE = 'REMOVE_WRITE_SCHEDULE';
export const SET_CREATING_WRITE_SCHEDULE = 'SET_CREATING_WRITE_SCHEDULE';
export const UNSET_CREATING_WRITE_SCHEDULE = 'UNSET_CREATING_WRITE_SCHEDULE';
export const SET_EDITING_WRITE_SCHEDULE = 'SET_EDITING_WRITE_SCHEDULE';
export const UNSET_EDITING_WRITE_SCHEDULE = 'UNSET_EDITING_WRITE_SCHEDULE';
export const SET_VIEWING_WRITE_SCHEDULE = 'SET_VIEWING_WRITE_SCHEDULE';
export const UNSET_VIEWING_WRITE_SCHEDULE = 'UNSET_VIEWING_WRITE_SCHEDULE';
export const EDIT_WRITE_SCHEDULE = 'EDIT_WRITE_SCHEDULE';
export const SET_SCHEDULE = 'SET_SCHEDULE';
export const REQUEST_GET_WRITE = 'REQUEST_GET_WRITE';
export const RESPONSE_GET_WRITE = 'RESPONSE_GET_WRITE';
export const RESET_FILTER = 'RESET_FILTER';
export const SWITCH_SHOW_FILTER_SHEDULE = 'SWITCH_SHOW_FILTER_SHEDULE';

export const switchModalAction = type => (dispatch) => {
    dispatch({ type: SWITCH_MODAL_SHEDULE, payload: type });
};

export const switchFilterAction = show => (dispatch) => {
    dispatch({ type: SWITCH_SHOW_FILTER_SHEDULE, payload: show });
};

export const setCreatingWriteAction = (type, ticket, doctor, user) => (dispatch) => {
    switch (type) {
        case 'SET':
            dispatch({ type: SET_CREATING_WRITE_SCHEDULE, payload: { ticket, doctor, user } });
            break;
        case 'UNSET':
            dispatch({ type: UNSET_CREATING_WRITE_SCHEDULE });
            break;
        default:
            break;
    }
};

export const setEditingWriteAction = (type, ticket, doctor, user) => (dispatch) => {
    switch (type) {
        case 'SET':
            dispatch({ type: SET_EDITING_WRITE_SCHEDULE, payload: { doctor, ticket, user } });
            break;
        case 'UNSET':
            dispatch({ type: UNSET_EDITING_WRITE_SCHEDULE });
            break;
        default:
            break;
    }
};

export const setViewingWriteAction = (type, doctor, ticket, user) => (dispatch) => {
    switch (type) {
        case 'SET':
            dispatch({ type: SET_VIEWING_WRITE_SCHEDULE, payload: { doctor, ticket, user } });
            break;
        case 'UNSET':
            dispatch({ type: UNSET_VIEWING_WRITE_SCHEDULE });
            break;
        default:
            break;
    }
};

export const setScheduleAction = data => (dispatch) => {
    dispatch({ type: SET_SCHEDULE, payload: data });
};

export const getScheduleAction = (date = +moment().format('x')) => (dispatch) => {
    dispatch({ type: REQUEST_GET_SCHEDULE });

    axios.get(`${API_HOST}tickets?date=${date}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({
                type: RESPONSE_GET_SCHEDULE,
                payload: data.data
            });
        } else {
            dispatch({ type: RESPONSE_GET_SCHEDULE, payload: [] });
            notification('error', 'Ошибка', 'Произошла ошибка при получении расписания');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_GET_SCHEDULE, payload: [] });
        notification('error', 'Ошибка', 'Произошла ошибка при получении расписания');
        console.error(error);
    });
};

export const setFilterAction = (type, value) => (dispatch) => {
    dispatch({ type: SET_FILTER_SCHEDULE, payload: { type, value } });
};

export const resetFilterAction = () => (dispatch) => {
    dispatch({type: RESET_FILTER});
};

export const createTicketAction = (fields, doctorID) => (dispatch) => {
    dispatch({ type: REQUEST_CREATE_TICKET_SCHEDULE });

    const formData = new FormData();
    const sendData = {
        worker_id: +doctorID,
        time_start: +fields.ticket_time_start.format('x'),
        time_end: +fields.ticket_time_end.format('x')
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

    axios.post(`${API_HOST}tickets`, formData)
    .then((response) => {
        const { data } = response;

        dispatch({ type: RESPONSE_CREATE_TICKET_SCHEDULE });
        if (!+data.error) {
            dispatch({
                type: ADD_USER_TICKET_SCHEDULE,
                payload: {
                    ...sendData,
                    id: data.data.id
                }
            });
            notification('success', 'Успех!', `Талон ${fields.ticket_time_start.format('HH:mm')}-${fields.ticket_time_end.format('HH:mm')} добавлен.`);
        } else {
            notification('error', 'Ошибка', `Произошла ошибка при добавлении талона. ${data.message}`);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_CREATE_TICKET_SCHEDULE });
        notification('error', 'Ошибка', 'Произошла ошибка при добавлении талона.');
        console.error(error);
    });
};

export const createWriteAction = (fields, creatingData, currentDate) => (dispatch) => {
    dispatch({ type: REQUEST_CREATE_WRITE_SCHEDULE });

    const formData = new FormData();
    const sendData = {
        status: STATUSES.notConfirmed.value,
        recorded_user_id: +creatingData.user,
        doctor_worker_id: +creatingData.doctor.id,
        filial_id: +creatingData.doctor.filial.id,
        patient_last_name: fields.patient_last_name,
        patient_first_name: fields.patient_first_name,
        patient_second_name: fields.patient_second_name,
        patient_phone: fields.patient_phone,
        patient_birthday: +fields.patient_birthday.format('x'),
        patient_type_payment: +fields['patient_type-payment'],
        patient_type_reception: +fields['patient_type-reception'],
        patient_comment: fields.patient_comment ? fields.patient_comment : '',
        date_write: currentDate.format('YYYY-MM-DD HH:mm:ss'),
        time_start: creatingData.time[0],
        time_end: creatingData.time[1]
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

    axios.post(`${API_HOST}writes`, formData)
    .then((response) => {
        const { data } = response;

        dispatch({ type: RESPONSE_CREATE_WRITE_SCHEDULE });
        if (!+data.error) {
            dispatch({
                type: ADD_WRITE_SCHEDULE,
                payload: {
                    ...sendData,
                    id: data.data.id,
                    created_at: data.data.created_at
                }
            });
            history.push(SCHEDULE_ROUTE);
            dispatch(switchModalAction('createWrite'));
            dispatch(setCreatingWriteAction('UNSET'));
            notification('success', 'Успех!', 'Запись создана');
        } else {
            console.error(data.message);
            notification('error', 'Ошибка', 'Произошла ошибка при создании записи');
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_CREATE_WRITE_SCHEDULE });
        notification('error', 'Ошибка', 'Произошла ошибка при создании записи');
        console.error(error);
    });
};

export const editWriteAction = (fields, editingData) => (dispatch) => {
    dispatch({ type: REQUEST_EDIT_WRITE_SCHEDULE });

    const sendData = {
        id: +editingData.ticket.data.id,
        status: fields.write_status,
        patient_last_name: fields.patient_last_name,
        patient_first_name: fields.patient_first_name,
        patient_second_name: fields.patient_second_name,
        patient_phone: fields.patient_phone,
        patient_birthday: +fields.patient_birthday.format('x'),
        patient_type_payment: +fields['patient_type-payment'],
        patient_type_reception: +fields['patient_type-reception'],
        patient_comment: fields.patient_comment ? fields.patient_comment : '',
    };

    axios.put(`${API_HOST}writes`, sendData)
    .then((response) => {
        const { data } = response;

        dispatch({ type: RESPONSE_EDIT_WRITE_SCHEDULE });
        if (!+data.error) {
            dispatch({
                type: EDIT_WRITE_SCHEDULE,
                payload: { data: sendData, writeID: +editingData.ticket.data.id, doctorID: +editingData.doctor.id }
            });
            history.push(SCHEDULE_ROUTE);
            dispatch(switchModalAction('updateWrite'));
            dispatch(setEditingWriteAction('UNSET'));
            notification('success', 'Успех!', 'Запись отредактирована');
        } else {
            console.error(data.message);
            notification('error', 'Ошибка', 'Произошла ошибка при редактировании записи');
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_CREATE_WRITE_SCHEDULE });
        notification('error', 'Ошибка', 'Произошла ошибка при редактировании записи');
        console.error(error);
    });
};

export const removeWriteAction = (writeID, doctorID, token = '') => (dispatch) => {
    dispatch({ type: REQUEST_DELETE_WRITE_SCHEDULE });

    axios.delete(`${API_HOST}writes/${writeID}?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_DELETE_WRITE_SCHEDULE });
            dispatch({ type: REMOVE_WRITE_SCHEDULE, payload: { writeID, doctorID } });
            notification('success', 'Успех!', 'Запись удалена');
        } else {
            dispatch({ type: RESPONSE_DELETE_WRITE_SCHEDULE });
            notification('error', 'Ошибка', 'Произошла ошибка при удалении записи');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_DELETE_WRITE_SCHEDULE });
        notification('error', 'Ошибка', 'Произошла ошибка при удалении записи');
        console.error(error);
    });
};

export const removeCustomTicketAction = (ticketID, doctorID, token = '') => (dispatch) => {
    dispatch({ type: REQUEST_DELETE_TICKET_SCHEDULE });

    axios.delete(`${API_HOST}tickets/${ticketID}?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_DELETE_TICKET_SCHEDULE });
            dispatch({ type: REMOVE_USER_TICKET_SCHEDULE, payload: { ticketID, doctorID } });
            notification('success', 'Успех!', 'Талон удален');
        } else {
            dispatch({ type: RESPONSE_DELETE_TICKET_SCHEDULE });
            notification('error', 'Ошибка', 'Произошла ошибка при удалении талона');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_DELETE_TICKET_SCHEDULE });
        notification('error', 'Ошибка', 'Произошла ошибка при удалении талона');
        console.error(error);
    });
};

export const switchHideTicketAction = (doctorID, ticket) => (dispatch) => {
    dispatch({ type: SWITCH_HIDE_TICKET_SCHEDULE, payload: { doctorID, ticket } });
};

export const getWriteSchedule = (writeID, userID, token = '') => (dispatch) => {
    dispatch({ type: REQUEST_GET_WRITE });

    axios.get(`${API_HOST}writes/${writeID}?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({
                type: RESPONSE_GET_WRITE,
                payload: {
                    data: data.data,
                    user: userID
                }
            });
        } else {
            dispatch({ type: RESPONSE_GET_WRITE, payload: [] });
            notification('error', 'Ошибка', 'Произошла ошибка при получении записи');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_GET_WRITE, payload: [] });
        notification('error', 'Ошибка', 'Произошла ошибка при получении записи');
        console.error(error);
    });
};
