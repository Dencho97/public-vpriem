import { REQUEST_HISTORY_PAYMENTS, RESPONSE_HISTORY_PAYMENTS } from './history/actions';

const initialState = {
    loading: true,
    data: null
};

export default function reduser(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case REQUEST_HISTORY_PAYMENTS:
        return { ...state, loading: true };
    case RESPONSE_HISTORY_PAYMENTS:
        return {
            ...state,
            loading: false,
            data: payload
        };
    default:
      return state;
  }
}
