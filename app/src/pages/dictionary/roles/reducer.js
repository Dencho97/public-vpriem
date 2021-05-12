import {
  SHOW_DRAWER_UPDATE_ROLES,
  HIDE_DRAWER_UPDATE_ROLES,
  REQUEST_ROLES_GET,
  RESPONSE_ROLES_GET,
  REQUEST_ROLE_CREATE,
  RESPONSE_ROLE_CREATE,
  REQUEST_ROLE_UPDATE,
  RESPONSE_ROLE_UPDATE,
  REQUEST_ROLE_DELETE,
  RESPONSE_ROLE_DELETE,
  ADD_ROLE,
  EDIT_ROLE,
  REMOVE_ROLE
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
    case SHOW_DRAWER_UPDATE_ROLES:
        return { ...state, drawerUpdate: true, editing: payload.id };
    case HIDE_DRAWER_UPDATE_ROLES:
        return { ...state, drawerUpdate: false, editing: payload.id };
    case REQUEST_ROLES_GET:
    case REQUEST_ROLE_CREATE:
    case REQUEST_ROLE_UPDATE:
    case REQUEST_ROLE_DELETE:
        return { ...state, loading: true };
    case RESPONSE_ROLE_CREATE:
    case RESPONSE_ROLE_UPDATE:
    case RESPONSE_ROLE_DELETE:
        return { ...state, loading: false };
    case RESPONSE_ROLES_GET:
        return {
          ...state,
          loading: false,
          data: payload.map(item => ({
            ...item,
            permissions: JSON.parse(item.permissions)
          }))
        };
    case ADD_ROLE:
        return {
          ...state,
          data: [{ id: payload.id, name: payload.name, permissions: payload.permissions }, ...state.data]
        };
    case EDIT_ROLE: {
      if (payload) {
        const newData = state.data.map((item) => {
          if (+item.id === +payload.id) {
            return {
              ...item,
              name: payload.name,
              permissions: payload.permissions
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
    case REMOVE_ROLE: {
      if (payload) {
        return { ...state, loading: false, data: state.data.filter(item => item.id !== payload.id) };
      }
      return { ...state, loading: false };
    }
    default:
      return state;
  }
}
