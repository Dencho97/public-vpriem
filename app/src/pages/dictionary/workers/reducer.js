import moment from 'moment';
import {
    SHOW_DRAWER_CREATE_WORKERS,
    HIDE_DRAWER_CREATE_WORKERS,
    SHOW_DRAWER_UPDATE_WORKERS,
    HIDE_DRAWER_UPDATE_WORKERS,
    REQUEST_WORKERS_GET,
    RESPONSE_WORKERS_GET,
    REQUEST_WORKER_GET,
    RESPONSE_WORKER_GET,
    REQUEST_WORKER_CREATE,
    RESPONSE_WORKER_CREATE,
    REQUEST_WORKER_UPDATE,
    RESPONSE_WORKER_UPDATE,
    REQUEST_WORKER_DELETE,
    RESPONSE_WORKER_DELETE,
    ADD_WORKER,
    ADD_WORKER_FROM_USERS,
    EDIT_WORKER,
    REMOVE_WORKER,
    SET_FILTER_WORKERS,
    RESET_FILTER,
    REMOVE_SCHEDULE_WORKER,
    REQUEST_REMOVE_SCHEDULE_WORKER,
    RESPONSE_REMOVE_SCHEDULE_WORKER
} from './actions';

const initialState = {
    data: null,
    loading: false,
    loadingData: false,
    drawerUpdate: false,
    drawerCreate: false,
    editing: null,
    filter: {
        type: null,
        filial: null,
        speciality: [],
        doctors: []
    }
};

export default function reduser(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case SHOW_DRAWER_CREATE_WORKERS:
            return { ...state, drawerCreate: true };
        case HIDE_DRAWER_CREATE_WORKERS:
            return { ...state, drawerCreate: false };
        case SHOW_DRAWER_UPDATE_WORKERS:
            return { ...state, drawerUpdate: true, editing: payload.id };
        case HIDE_DRAWER_UPDATE_WORKERS:
            return { ...state, drawerUpdate: false, editing: payload.id };
        case REQUEST_WORKER_CREATE:
        case REQUEST_WORKER_UPDATE:
        case REQUEST_WORKER_DELETE:
        case REQUEST_REMOVE_SCHEDULE_WORKER:
            return { ...state, loading: true };
        case RESPONSE_WORKER_CREATE:
        case RESPONSE_WORKER_UPDATE:
        case RESPONSE_WORKER_DELETE:
        case RESPONSE_REMOVE_SCHEDULE_WORKER:
            return { ...state, loading: false };
        case REQUEST_WORKERS_GET:
            return { ...state, loadingData: true };
        case RESPONSE_WORKERS_GET:
            return { ...state, loadingData: false, data: payload };
        case ADD_WORKER_FROM_USERS:
            return {
                ...state,
                data: [...state.data, {
                    id: +payload.id,
                    first_name: payload.first_name,
                    last_name: payload.last_name,
                    second_name: payload.second_name
                }]
            };
        case ADD_WORKER:
            return {
                ...state,
                drawerCreate: false,
                data: [...state.data, {
                    ...payload,
                    schedules_all: payload.schedule.length ? [{
                        id: payload.schedule_id,
                        worker_id: payload.id,
                        schedule: payload.schedule,
                        starts_working: payload.starts_working
                    }] : [],
                    schedule_id: null,
                    starts_working: payload.schedule.length ? payload.starts_working : null
                }]
            };
        case EDIT_WORKER: {
            return {
                ...state,
                drawerUpdate: false,
                editing: null,
                data: state.data.map((item) => {
                    if (+item.id === +payload.id) {
                        const schedules = payload.addedSchedule ? [...item.schedules_all, payload.addedSchedule] : item.schedules_all;
                        schedules.sort((a, b) => {
                            if (+a.starts_working.format('x') > +b.starts_working.format('x')) {
                                return 1;
                            }
                            if (+a.starts_working.format('x') < +b.starts_working.format('x')) {
                                return -1;
                            }
                            return 0;
                        });

                        return {
                            ...item,
                            photo: payload.photo,
                            first_name: payload.first_name,
                            second_name: payload.second_name,
                            last_name: payload.last_name,
                            type_id: payload.type_id,
                            services_ids: payload.services_ids,
                            description: payload.description,
                            filial_id: payload.filial_id,
                            priority: payload.priority,
                            in_admin_statistic: payload.in_admin_statistic,
                            // schedule_id: item.schedule_id,
                            // starts_working: item.starts_working,
                            // schedule: payload.schedule.length ? payload.schedule : item.schedule,
                            schedules_all: schedules,
                            holidays: payload.holidays,
                        };
                    }
                    return item;
                })
            };
        }
        case REMOVE_WORKER: {
            return { ...state, data: state.data.filter(item => +item.id !== +payload.id) };
        }
        case RESET_FILTER:
            return {
                ...state,
                filter: {
                    type: null,
                    filial: null,
                    speciality: [],
                    doctors: []
                }
            };
        case SET_FILTER_WORKERS:
            return {
                ...state,
                filter: {
                    ...state.filter,
                    [payload.type]: payload.value
                }
            };
        case REMOVE_SCHEDULE_WORKER:
            return {
                ...state,
                data: state.data.map((worker) => {
                    if (+worker.id === +payload.workerID) {
                        return {
                            ...worker,
                            schedules_all: worker.schedules_all.filter(schedule => +schedule.id !== +payload.scheduleID)
                        };
                    }
                    return worker;
                })
            };
        default:
            return state;
    }
}
