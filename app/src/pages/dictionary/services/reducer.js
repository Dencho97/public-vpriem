import {
  SHOW_DRAWER_UPDATE_SERVICES,
  HIDE_DRAWER_UPDATE_SERVICES,
  REQUEST_SERVICES_GET,
  RESPONSE_SERVICES_GET,
  REQUEST_SERVICE_CREATE,
  RESPONSE_SERVICE_CREATE,
  REQUEST_SERVICE_UPDATE,
  RESPONSE_SERVICE_UPDATE,
  REQUEST_SERVICE_DELETE,
  RESPONSE_SERVICE_DELETE,
  ADD_SERVICE,
  EDIT_SERVICE,
  REMOVE_SERVICE
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
    case SHOW_DRAWER_UPDATE_SERVICES:
        return { ...state, drawerUpdate: true, editing: payload.id };
    case HIDE_DRAWER_UPDATE_SERVICES:
        return { ...state, drawerUpdate: false, editing: payload.id };
    case REQUEST_SERVICES_GET:
    case REQUEST_SERVICE_CREATE:
    case REQUEST_SERVICE_UPDATE:
    case REQUEST_SERVICE_DELETE:
        return { ...state, loading: true };
    case RESPONSE_SERVICE_CREATE:
    case RESPONSE_SERVICE_UPDATE:
    case RESPONSE_SERVICE_DELETE:
        return { ...state, loading: false };
    case RESPONSE_SERVICES_GET:
        return { ...state, loading: false, data: payload };
    case ADD_SERVICE:
        return {
          ...state,
          data: [{
            id: payload.id,
            name: payload.name,
            link: payload.link,
            image: payload.image,
            description: payload.description
          }, ...state.data]
        };
    case EDIT_SERVICE: {
      if (payload) {
        const newData = state.data.map((item) => {
          if (+item.id === +payload.id) {
            return {
              ...item,
              name: payload.name,
              link: payload.link,
              image: payload.image,
              description: payload.description
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
    case REMOVE_SERVICE: {
      if (payload) {
        return { ...state, loading: false, data: state.data.filter(item => item.id !== payload.id) };
      }
      return { ...state, loading: false };
    }
    default:
      return state;
  }
}
