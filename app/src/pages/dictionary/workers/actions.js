import axios from 'axios';
import moment from 'moment';
import clone from 'clone';


import notification from '../../../components/notification';
import { history } from '../../../store';
import { API_HOST } from '../../../constans/api';
import { DICTIONARY_WORKERS_ROUTE } from '../../../constans/routes';
import { defaultWorkerSchedule } from '../../../constans/schedule';
import { isBase64, readFileAsync } from '../../../helpers';

moment.locale('ru');

export const SHOW_DRAWER_CREATE_WORKERS = 'SHOW_DRAWER_CREATE_WORKERS';
export const HIDE_DRAWER_CREATE_WORKERS = 'HIDE_DRAWER_CREATE_WORKERS';
export const SHOW_DRAWER_UPDATE_WORKERS = 'SHOW_DRAWER_UPDATE_WORKERS';
export const HIDE_DRAWER_UPDATE_WORKERS = 'HIDE_DRAWER_UPDATE_WORKERS';
export const REQUEST_WORKER_GET = 'REQUEST_WORKER_GET';
export const RESPONSE_WORKER_GET = 'RESPONSE_WORKER_GET';
export const REQUEST_WORKERS_GET = 'REQUEST_WORKERS_GET';
export const RESPONSE_WORKERS_GET = 'RESPONSE_WORKERS_GET';
export const REQUEST_WORKER_CREATE = 'REQUEST_WORKER_CREATE';
export const RESPONSE_WORKER_CREATE = 'RESPONSE_WORKER_CREATE';
export const REQUEST_WORKER_UPDATE = 'REQUEST_WORKER_UPDATE';
export const RESPONSE_WORKER_UPDATE = 'RESPONSE_WORKER_UPDATE';
export const REQUEST_WORKER_DELETE = 'REQUEST_WORKER_DELETE';
export const RESPONSE_WORKER_DELETE = 'RESPONSE_WORKER_DELETE';
export const ADD_WORKER = 'ADD_WORKER';
export const ADD_WORKER_FROM_USERS = 'ADD_WORKER_FROM_USERS';
export const EDIT_WORKER = 'EDIT_WORKER';
export const REMOVE_WORKER = 'REMOVE_WORKER';
export const SET_FILTER_WORKERS = 'SET_FILTER_WORKERS';
export const RESET_FILTER = 'RESET_FILTER';
export const REQUEST_REMOVE_SCHEDULE_WORKER = 'REQUEST_REMOVE_SCHEDULE_WORKER';
export const RESPONSE_REMOVE_SCHEDULE_WORKER = 'RESPONSE_REMOVE_SCHEDULE_WORKER';
export const REMOVE_SCHEDULE_WORKER = 'REMOVE_SCHEDULE_WORKER';

export const switchDrawer = (type, id = null) => (dispatch) => {
    switch (type) {
        case 'show_create':
            dispatch({ type: SHOW_DRAWER_CREATE_WORKERS });
            break;
        case 'hide_create':
            dispatch({ type: HIDE_DRAWER_CREATE_WORKERS });
            break;
        case 'show_update':
            dispatch({ type: SHOW_DRAWER_UPDATE_WORKERS, payload: { id } });
            break;
        case 'hide_update':
            dispatch({ type: HIDE_DRAWER_UPDATE_WORKERS, payload: { id } });
            break;
        default:
            break;
    }
};

export const getWorkersAction = (userID, token) => (dispatch) => {
    dispatch({ type: REQUEST_WORKER_GET });

    axios.get(`${API_HOST}dictionary/workers?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({
                type: RESPONSE_WORKERS_GET,
                payload: data.data ? data.data.map(item => ({
                    ...item,
                    services_ids: item.services_ids,
                    starts_working: moment(item.starts_working),
                    schedule: item.schedule.length ? item.schedule.map((shift) => {
                        const newShift = shift;
                        for (const key in shift) {
                            switch (key) {
                                case 'day1':
                                case 'day2':
                                case 'day3':
                                case 'day4':
                                case 'day5':
                                case 'day6':
                                case 'day7': {
                                    if (newShift[key].parity.even) {
                                        newShift[key].parity.even.timeStart = moment(+newShift[key].parity.even.timeStart);
                                        newShift[key].parity.even.timeEnd = moment(+newShift[key].parity.even.timeEnd);
                                    }
                                    if (newShift[key].parity.odd) {
                                        newShift[key].parity.odd.timeStart = moment(+newShift[key].parity.odd.timeStart);
                                        newShift[key].parity.odd.timeEnd = moment(+newShift[key].parity.odd.timeEnd);
                                    }
                                    break;
                                }
                                default:
                                    break;
                            }
                        }
                        return newShift;
                    }) : defaultWorkerSchedule,
                    schedules_all: item.schedules_all.map((itemSchedule) => {
                        let newShedule = itemSchedule;
                        newShedule = {
                            ...newShedule,
                            starts_working: moment(newShedule.starts_working),
                            schedule: newShedule.schedule.length ? newShedule.schedule.map((shift) => {
                                const newShift = shift;
                                for (const key in shift) {
                                    switch (key) {
                                        case 'day1':
                                        case 'day2':
                                        case 'day3':
                                        case 'day4':
                                        case 'day5':
                                        case 'day6':
                                        case 'day7': {
                                            if (newShift[key].parity.even) {
                                                newShift[key].parity.even.timeStart = moment(+newShift[key].parity.even.timeStart);
                                                newShift[key].parity.even.timeEnd = moment(+newShift[key].parity.even.timeEnd);
                                            }
                                            if (newShift[key].parity.odd) {
                                                newShift[key].parity.odd.timeStart = moment(+newShift[key].parity.odd.timeStart);
                                                newShift[key].parity.odd.timeEnd = moment(+newShift[key].parity.odd.timeEnd);
                                            }
                                            break;
                                        }
                                        default:
                                            break;
                                    }
                                }
                                return newShift;
                            }) : defaultWorkerSchedule
                        };

                        return newShedule;
                    }),
                    holidays: item.holidays.map((holiday) => {
                        const newHoliday = holiday;
                        newHoliday.startHolidays = moment(+newHoliday.startHolidays);
                        newHoliday.endHolidays = moment(+newHoliday.endHolidays);
                        return newHoliday;
                    })
                })) : []
            });
        } else {
            dispatch({ type: RESPONSE_WORKERS_GET, payload: [] });
            notification('error', 'Ошибка', 'Произошла ошибка при получении сотрудников');
            console.error(data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_WORKERS_GET });
        notification('error', 'Ошибка', 'Произошла ошибка при получении сотрудников');
        console.error(error);
    });
};

export const createWorkersAction = (fields, token) => (dispatch) => {
    dispatch({ type: REQUEST_WORKER_CREATE });

    const { worker_photo: workerPhoto, ...clonnedFields } = fields;
    let newFields = clone(clonnedFields);
    newFields = {
        ...newFields,
        worker_photo: workerPhoto
    };

    let services;
    if (newFields.worker_services !== undefined && typeof newFields.worker_services === 'number') {
        services = [services];
    } else if (newFields.worker_services !== undefined && Array.isArray(newFields.worker_services)) {
        services = newFields.worker_services;
    } else {
        services = [];
    }

    const formData = new FormData();
    const sendData = {
        photo: newFields.worker_photo ? newFields.worker_photo : '',
        first_name: newFields.worker_first_name,
        second_name: newFields.worker_second_name,
        last_name: newFields.worker_last_name,
        type_id: +newFields.worker_type,
        services_ids: JSON.stringify(services),
        description: newFields.worker_description ? newFields.worker_description : '',
        filial_id: +newFields.worker_place,
        priority: 0,
        in_admin_statistic: 1,
        schedule: JSON.stringify(newFields.worker_schedule.map((item) => {
            const newItem = item;
            for (const key in item) {
                switch (key) {
                    case 'day1':
                    case 'day2':
                    case 'day3':
                    case 'day4':
                    case 'day5':
                    case 'day6':
                    case 'day7': {
                        if (item[key].parity.even) {
                            newItem[key].parity.even.timeStart = newItem[key].parity.even.timeStart.format('x');
                            newItem[key].parity.even.timeEnd = newItem[key].parity.even.timeEnd.format('x');
                        }
                        if (item[key].parity.odd) {
                            newItem[key].parity.odd.timeStart = newItem[key].parity.odd.timeStart.format('x');
                            newItem[key].parity.odd.timeEnd = newItem[key].parity.odd.timeEnd.format('x');
                        }
                        break;
                    }
                    default:
                        break;
                }
            }
            return newItem;
        })),
        holidays: JSON.stringify(newFields.worker_holidays.map((item) => {
            const newItem = item;
            newItem.startHolidays = item.startHolidays.format('x');
            newItem.endHolidays = item.endHolidays.format('x');
            return newItem;
        })),
        starts_working: newFields.worker_starts_working !== undefined ? newFields.worker_starts_working.format('YYYY-MM-DD HH:mm:ss') : null,
        token
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

    axios.post(`${API_HOST}dictionary/workers/create`, formData)
    .then((response) => {
        const { data } = response;

        dispatch({ type: RESPONSE_WORKER_CREATE });
        if (!+data.error) {
            delete sendData.token;
            dispatch({
                type: ADD_WORKER,
                payload: {
                    ...sendData,
                    id: data.data.id,
                    photo: data.data.photo ? data.data.photo : '',
                    schedule: fields.worker_schedule,
                    holidays: fields.worker_holidays,
                    services_ids: fields.worker_services ? fields.worker_services : [],
                    schedule_id: data.data.schedule_id,
                    starts_working: fields.worker_starts_working !== undefined ? fields.worker_starts_working : null
                }
            });
            setTimeout(() => { history.push(DICTIONARY_WORKERS_ROUTE); }, 300);
            notification('success', 'Успех!', 'Сотрудник добавлен');
        } else {
            notification('error', 'Ошибка', data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_WORKER_CREATE });
        notification('error', 'Ошибка', 'Произошла ошибка при добавлении сотрудника');
        console.error(error);
    });
};

export const editWorkersAction = (fields, token) => (dispatch) => {
    dispatch({ type: REQUEST_WORKER_UPDATE });

    const { worker_photo: workerPhoto, ...clonnedFields } = fields;
    let newFields = clone(clonnedFields);
    newFields = {
        ...newFields,
        worker_photo: workerPhoto
    };

    let services;
    if (newFields.worker_services !== undefined && typeof newFields.worker_services === 'number') {
        services = [services];
    } else if (newFields.worker_services !== undefined && Array.isArray(newFields.worker_services)) {
        services = newFields.worker_services;
    } else {
        services = [];
    }

    const formData = new FormData();
    const sendData = {
        id: newFields.worker_id,
        photo: newFields.worker_photo ? newFields.worker_photo : null,
        first_name: newFields.worker_first_name,
        second_name: newFields.worker_second_name,
        last_name: newFields.worker_last_name,
        type_id: +newFields.worker_type,
        services_ids: JSON.stringify(services),
        description: newFields.worker_description ? newFields.worker_description : '',
        filial_id: +newFields.worker_place,
        priority: 0,
        in_admin_statistic: 1,
        schedule: JSON.stringify(newFields.worker_schedule.map((item) => {
            const newItem = item;
            for (const key in newItem) {
                switch (key) {
                    case 'day1':
                    case 'day2':
                    case 'day3':
                    case 'day4':
                    case 'day5':
                    case 'day6':
                    case 'day7': {
                        if (newItem[key].parity.even) {
                            newItem[key].parity.even.timeStart = newItem[key].parity.even.timeStart.format('x');
                            newItem[key].parity.even.timeEnd = newItem[key].parity.even.timeEnd.format('x');
                        }
                        if (item[key].parity.odd) {
                            newItem[key].parity.odd.timeStart = newItem[key].parity.odd.timeStart.format('x');
                            newItem[key].parity.odd.timeEnd = newItem[key].parity.odd.timeEnd.format('x');
                        }
                        break;
                    }
                    default:
                        break;
                }
            }
            return newItem;
        })),
        holidays: JSON.stringify(newFields.worker_holidays.map((item) => {
            const newItem = item;
            newItem.startHolidays = newItem.startHolidays.format('x');
            newItem.endHolidays = newItem.endHolidays.format('x');
            return newItem;
        })),
        starts_working: newFields.worker_starts_working !== undefined ? newFields.worker_starts_working.format('YYYY-MM-DD HH:mm:ss') : null,
        token
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

    axios.post(`${API_HOST}dictionary/workers/update`, formData)
    .then((response) => {
        const { data } = response;

        dispatch({ type: RESPONSE_WORKER_UPDATE });
        if (!+data.error) {
            dispatch({
                type: EDIT_WORKER,
                payload: {
                    ...sendData,
                    id: data.data.id,
                    photo: data.data.photo ? data.data.photo : '',
                    schedule: fields.worker_schedule,
                    addedSchedule: data.data.schedule_id ? {
                        id: +data.data.schedule_id,
                        schedule: fields.worker_schedule,
                        starts_working: fields.worker_starts_working !== undefined ? fields.worker_starts_working : null,
                        worker_id: fields.id
                    } : null,
                    holidays: fields.worker_holidays,
                    services_ids: fields.worker_services ? fields.worker_services : []
                }
            });
            setTimeout(() => { history.push(DICTIONARY_WORKERS_ROUTE); }, 300);
            notification('success', 'Успех!', 'Сотрудник обновлен');
        } else {
            notification('error', 'Ошибка', data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_WORKER_UPDATE });
        notification('error', 'Ошибка', 'Произошла ошибка при обновлении сотрудника');
        console.error(error);
    });
};

export const removeWorkersAction = (id, token) => (dispatch) => {
    dispatch({ type: REQUEST_WORKER_DELETE });

    axios.delete(`${API_HOST}dictionary/workers/${id}?token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_WORKER_DELETE });
            dispatch({ type: REMOVE_WORKER, payload: { id } });
            notification('success', 'Успех!', 'Сотрудник удалён');
        } else {
            dispatch({ type: RESPONSE_WORKER_DELETE });
            notification('error', 'Ошибка', data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_WORKER_CREATE });
        notification('error', 'Ошибка', 'Произошла ошибка при удалении сотрудника');
        console.error(error);
    });
};

export const resetFilterAction = () => (dispatch) => {
    dispatch({ type: RESET_FILTER });
};

export const setFilterAction = (type, value) => (dispatch) => {
    dispatch({ type: SET_FILTER_WORKERS, payload: { type, value } });
};

export const removeScheduleAction = (scheduleID, workerID, token) => (dispatch) => {
    dispatch({ type: REQUEST_REMOVE_SCHEDULE_WORKER });

    axios.delete(`${API_HOST}dictionary/workers/${workerID}/removeSchedule?schedule=${scheduleID}&token=${token}`)
    .then((response) => {
        const { data } = response;
        if (!+data.error) {
            dispatch({ type: RESPONSE_REMOVE_SCHEDULE_WORKER });
            dispatch({ type: REMOVE_SCHEDULE_WORKER, payload: { workerID, scheduleID } });
            notification('success', 'Успех!', 'Сотрудник расписание удалено');
        } else {
            dispatch({ type: RESPONSE_REMOVE_SCHEDULE_WORKER });
            notification('error', 'Ошибка', data.message);
        }
    })
    .catch((error) => {
        dispatch({ type: RESPONSE_REMOVE_SCHEDULE_WORKER });
        notification('error', 'Ошибка', 'Произошла ошибка при удалении расписания');
        console.error(error);
    });
};
