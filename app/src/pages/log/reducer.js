import moment from 'moment';
import {
  REQUEST_LOG_GET,
  RESPONSE_LOG_GET,
  CHANGE_FILTER_LOG
} from './actions';

const initialState = {
  data: null,
  loading: false,
  filter: {
    date: [moment().hours(0).minutes(0).seconds(0), moment().hours(23).minutes(59).seconds(59)],
    user: 0
  }
};

export default function reduser(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case REQUEST_LOG_GET:
        return { ...state, loading: true };
    case RESPONSE_LOG_GET:
        return { ...state, loading: false, data: payload };
    case CHANGE_FILTER_LOG:
        return {
          ...state,
          filter: {
            ...state.filter,
            [payload.field]: payload.value
          }
        };
    default:
      return state;
  }
}
