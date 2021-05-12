import {
    REQUEST_SETTINGS_ORG_GET,
    RESPONSE_SETTINGS_ORG_GET,
    REQUEST_SETTINGS_ORG_UPDATE,
    RESPONSE_SETTINGS_ORG_UPDATE
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
        case REQUEST_SETTINGS_ORG_GET:
        case REQUEST_SETTINGS_ORG_UPDATE:
            return {
                ...state, loading: true
            };
        case RESPONSE_SETTINGS_ORG_GET: {
            return {
                ...state,
                loading: false,
                data: payload
            };
        }
        case RESPONSE_SETTINGS_ORG_UPDATE: {
            return {
                ...state,
                loading: false,
                data: payload
            };
        }
        default:
            return state;
    }
}
