import moment from 'moment';
import {
    CHANGE_FILTER_REPORT,
    REQUEST_REPORT_GET,
    RESPONSE_REPORT_GET
} from './actions';

const initialState = {
    data: null,
    filter: {
        type: 'byTickets',
        date: moment(),
        dateRange: [moment().startOf('month'), moment().endOf('month')],
        filial: 0
    },
    loading: false
};

export default function reduser(state = initialState, action) {
    const {
        type,
        payload
    } = action;

    switch (type) {
        case CHANGE_FILTER_REPORT:
            return {
                ...state,
                data: null,
                filter: {
                    ...state.filter,
                    [payload.property]: payload.value
                }
            };
        case REQUEST_REPORT_GET:
            return {
                ...state, loading: true
            };
        case RESPONSE_REPORT_GET:
            return {
                ...state, loading: false, data: payload
            };
        default:
            return state;
    }
}
