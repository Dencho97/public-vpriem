import {
    WS_CONNECTING,
    WS_CONNECTED,
    WS_DISCONNECTED,
    WS_SET_USER
} from './actions';

const initialState = {
    ws: null,
    loading: false,
    userConnectionID: null,
    userID: null
};

export default function reducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case WS_CONNECTING:
            return { ...state, loading: true };
        case WS_CONNECTED:
            return { ...state, loading: false, ws: payload };
        case WS_DISCONNECTED:
            return {
                ...state,
                loading: false,
                ws: null,
                userConnectionID: null,
                userID: null
            };
        case WS_SET_USER:
            return {
                ...state,
                userConnectionID: payload.connectionID,
                userID: payload.userID
            };
        default:
            return state;
    }
}
