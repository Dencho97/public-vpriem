import {
  SHOW_DRAWER_UPDATE_USERS,
  HIDE_DRAWER_UPDATE_USERS,
  REQUEST_USERS_GET,
  RESPONSE_USERS_GET,
  REQUEST_USER_CREATE,
  RESPONSE_USER_CREATE,
  REQUEST_USER_UPDATE,
  RESPONSE_USER_UPDATE,
  REQUEST_USER_DELETE,
  RESPONSE_USER_DELETE,
  ADD_USER,
  EDIT_USER,
  REMOVE_USER
} from './actions';

const initialState = {
  data: null,
  loading: false,
  drawerUpdate: false,
  editing: null
};

export default function reduser(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SHOW_DRAWER_UPDATE_USERS:
        return { ...state, drawerUpdate: true, editing: payload.id };
    case HIDE_DRAWER_UPDATE_USERS:
        return { ...state, drawerUpdate: false, editing: payload.id };
    case REQUEST_USERS_GET:
    case REQUEST_USER_CREATE:
    case REQUEST_USER_UPDATE:
    case REQUEST_USER_DELETE:
        return { ...state, loading: true };
    case RESPONSE_USER_CREATE:
    case RESPONSE_USER_UPDATE:
    case RESPONSE_USER_DELETE:
        return { ...state, loading: false };
    case RESPONSE_USERS_GET:
        return { ...state, loading: false, data: payload };
    case ADD_USER:
        return {
          ...state,
          data: [
            {
              id: +payload.id,
              email: payload.email,
              role: payload.role,
              worker_id: +payload.worker_id
            },
            ...state.data
          ]
        };
    case EDIT_USER: {
      if (payload) {
        const newData = state.data.map((item) => {
          if (+item.id === +payload.id) {
            return {
              ...item,
              email: payload.email,
              role: payload.role,
              worker_id: payload.worker_id
            };
          }
          return item;
        });

        return {
          ...state,
          drawerUpdate: false,
          editing: null,
          data: newData
        };
      }
      return { ...state, loading: false };
    }
    case REMOVE_USER: {
      if (payload) {
        return { ...state, loading: false, data: state.data.filter(item => +item.id !== +payload.id) };
      }
      return { ...state, loading: false };
    }
    default:
      return state;
  }
}
