import {
    REQUEST_SEND_SUPPORT_MESSAGE,
    RESPONSE_SEND_SUPPORT_MESSAGE
} from './actions';

const initialState = {
    loading: false
};

export default function reduser(state = initialState, action) {
    const {
        type
    } = action;

    switch (type) {
        case REQUEST_SEND_SUPPORT_MESSAGE:
            return {
                ...state, loading: true
            };
        case RESPONSE_SEND_SUPPORT_MESSAGE:
            return {
                ...state, loading: false
            };
        default:
            return state;
    }
}
