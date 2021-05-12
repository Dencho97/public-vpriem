import {
    REQUEST_REFERALS,
    REQUEST_WITHDRAW_REFERALS,
    RESPONSE_REFERALS,
    RESPONSE_WITHDRAW_REFERALS,
    SWITCH_PANE_REFERALS
} from './actions';

const initialState = {
    loading: true,
    data: null,
    pane: 'referal'
};

export default function reduser(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SWITCH_PANE_REFERALS:
        return {
            ...state,
            pane: payload
        };
    case REQUEST_REFERALS:
    case REQUEST_WITHDRAW_REFERALS:
        return { ...state, loading: true };
    case RESPONSE_REFERALS:
        return {
            ...state,
            loading: false,
            data: payload
        };
    case RESPONSE_WITHDRAW_REFERALS:
        return {
            ...state,
            loading: false
        };
    default:
      return state;
  }
}
