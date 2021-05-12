import {
  SHOW_DRAWER_UPDATE_FILIALS,
  HIDE_DRAWER_UPDATE_FILIALS,
  REQUEST_FILIALS_GET,
  RESPONSE_FILIALS_GET,
  REQUEST_FILIAL_CREATE,
  RESPONSE_FILIAL_CREATE,
  REQUEST_FILIAL_UPDATE,
  RESPONSE_FILIAL_UPDATE,
  REQUEST_FILIAL_DELETE,
  RESPONSE_FILIAL_DELETE,
  ADD_FILIAL,
  EDIT_FILIAL,
  REMOVE_FILIAL
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
    case SHOW_DRAWER_UPDATE_FILIALS:
        return { ...state, drawerUpdate: true, editing: payload.id };
    case HIDE_DRAWER_UPDATE_FILIALS:
        return { ...state, drawerUpdate: false, editing: payload.id };
    case REQUEST_FILIALS_GET:
    case REQUEST_FILIAL_CREATE:
    case REQUEST_FILIAL_UPDATE:
    case REQUEST_FILIAL_DELETE:
        return { ...state, loading: true };
    case RESPONSE_FILIAL_CREATE:
    case RESPONSE_FILIAL_UPDATE:
    case RESPONSE_FILIAL_DELETE:
        return { ...state, loading: false };
    case RESPONSE_FILIALS_GET:
        return { ...state, loading: false, data: payload };
    case ADD_FILIAL:
        return {
          ...state,
          data: [{ id: payload.id, name: payload.name }, ...state.data]
        };
    case EDIT_FILIAL: {
      if (payload) {
        const newData = state.data.map((item) => {
          if (+item.id === +payload.id) {
            return { ...item, name: payload.name };
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
    case REMOVE_FILIAL: {
      if (payload) {
        return { ...state, loading: false, data: state.data.filter(item => item.id !== payload.id) };
      }
      return { ...state, loading: false };
    }
    default:
      return state;
  }
}
