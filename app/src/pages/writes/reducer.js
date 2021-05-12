import moment from 'moment';
import {
    REQUEST_WRITES_GET,
    RESPONSE_WRITES_GET
} from './actions';

const initialState = {
    data: null,
    date: moment(),
    loading: false
};

export default function reduser(state = initialState, action) {
    const {
        type,
        payload
    } = action;

    switch (type) {
        case REQUEST_WRITES_GET:
            return {
                ...state, loading: true
            };
        case RESPONSE_WRITES_GET:
            return {
                ...state, loading: false, data: payload
            };
        default:
            return state;
    }
}
