import {
    REQUEST_SETTINGS_GET,
    RESPONSE_SETTINGS_GET,
    REQUEST_SETTINGS_UPDATE,
    RESPONSE_SETTINGS_UPDATE
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
        case REQUEST_SETTINGS_GET:
        case REQUEST_SETTINGS_UPDATE:
            return {
                ...state, loading: true
            };
        case RESPONSE_SETTINGS_GET:
        case RESPONSE_SETTINGS_UPDATE:
            return {
                ...state, loading: false, data: payload
            };
        default:
            return state;
    }
}
