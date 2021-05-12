import Cookies from 'js-cookie';
import {
    REQUEST_AUTH,
    RESPONSE_AUTH,
    UNSET_AUTH
} from './actions';
import {
  REQUEST_REGISTRATION,
  RESPONSE_REGISTRATION,
  REQUEST_CONFIRM_REGISTRATION,
  RESPONSE_CONFIRM_REGISTRATION
} from '../registration/actions';
import {
  REQUEST_RESET_PASSWORD,
  RESPONSE_RESET_PASSWORD,
  REQUEST_CONFIRM_RESET_PASSWORD,
  RESPONSE_CONFIRM_RESET_PASSWORD
} from '../reset/actions';


const initialState = {
    token: Cookies.get('token') ? Cookies.get('token') : null,
    user: null,
    role: null,
    tariff: null,
    permissions: null,
    loading: false,
    authorized: false,
    statuses: {
      waitingConfirm: false,
      successConfirm: false,
      errorConfirm: false
    },
    waitingConfirm: false,
    error: ''
};

export default function reduser(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REQUEST_AUTH:
    case REQUEST_REGISTRATION:
    case REQUEST_CONFIRM_REGISTRATION:
    case REQUEST_RESET_PASSWORD:
    case REQUEST_CONFIRM_RESET_PASSWORD:
        return { ...state, loading: true };
    case RESPONSE_AUTH: {
        if (payload && !+payload.error) {
            const {
              token,
              user,
              role,
              permissions,
              tariff
            } = payload.data;
            Cookies.set('token', token, { expires: 365 });
            return {
              ...state,
              loading: false,
              token,
              user,
              role,
              tariff,
              permissions,
              authorized: true,
              error: ''
            };
        }

        Cookies.remove('token');
        return {
          ...state,
          loading: false,
          token: null,
          user: null,
          role: null,
          tariff: null,
          permissions: null,
          authorized: false,
          error: payload && +payload.error ? payload.message : ''
      };
    }
    case RESPONSE_REGISTRATION:
    case RESPONSE_RESET_PASSWORD: {
      if (payload && !+payload.error) {
          return {
            ...state,
            loading: false,
            statuses: {
              ...state.statuses,
              waitingConfirm: true
            }
          };
      }
      if (payload && +payload.error) {
        return {
          ...state,
          loading: false,
          error: payload.message
        };
      }

      return state;
    }
    case RESPONSE_CONFIRM_REGISTRATION:
    case RESPONSE_CONFIRM_RESET_PASSWORD: {
      if (payload && !payload.error) {
        return {
          ...state,
          loading: false,
          statuses: {
            ...state.statuses,
            successConfirm: true
          }
        };
      }
      return {
        ...state,
        loading: false,
        statuses: {
          ...state.statuses,
          errorConfirm: true
        }
      };
    }
    case UNSET_AUTH:
        Cookies.remove('token');
        return {
          ...state,
          loading: false,
          token: null,
          user: null,
          role: null,
          tariff: null,
          permissions: null,
          authorized: false,
          error: ''
        };
    default:
      return state;
  }
}
