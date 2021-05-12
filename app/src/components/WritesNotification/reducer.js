import moment from 'moment';
import {
    REQUEST_GET_NOTIFICATIONS,
    RESPONSE_GET_NOTIFICATIONS,
    ADD_WRITE_SCHEDULE_NOTIFICATION,
    REMOVE_WRITE_SCHEDULE_NOTIFICATION
} from './actions';

const initialState = {
    data: null,
    loading: false
};

export default function reduser(state = initialState, action) {
    const {
        type,
        payload
    } = action;

    switch (type) {
        case REQUEST_GET_NOTIFICATIONS:
            return {
                ...state,
                loading: true
            };
        case RESPONSE_GET_NOTIFICATIONS:
            return {
                ...state,
                loading: false,
                data: payload.data.map(item => ({
                    ...item,
                    created_at: moment(item.created_at)
                }))
            };
        case ADD_WRITE_SCHEDULE_NOTIFICATION: {
            let data = payload[0];
            data = { ...data, created_at: moment(data.created_at) };
            return {
                ...state,
                data: [data, ...state.data]
            };
        }
        case REMOVE_WRITE_SCHEDULE_NOTIFICATION: {
            switch (payload.typeID) {
                case 'byNotificationID':
                    return {
                        ...state,
                        data: state.data.filter(item => +item.id !== +payload.id)
                    };
                case 'byWriteID':
                    return {
                        ...state,
                        data: state.data.filter(item => +item.ticket.data.id !== +payload.id)
                    };
                default:
                    return state;
            }
        }
        default:
            return state;
    }
}
