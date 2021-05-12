import {
    REQUEST_TARIFFS_GET,
    RESPONSE_TARIFFS_GET,
    CHANGE_TARIFF
} from './actions';

const initialState = {
    data: null,
    selected: {
        factorWorkers: 1,
        tariffID: null,
    },
    loading: false
};

export default function reduser(state = initialState, action) {
    const {
        type,
        payload
    } = action;

    switch (type) {
        case REQUEST_TARIFFS_GET:
            return {
                ...state, loading: true
            };
        case RESPONSE_TARIFFS_GET: {
            return {
                ...state,
                loading: false,
                data: payload
            };
        }
        case CHANGE_TARIFF:
            return {
                ...state,
                selected: {
                    ...state.selected,
                    ...payload
                }
            };
        default:
            return state;
    }
}
