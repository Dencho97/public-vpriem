import {
   SHOW_DRAWER_UPDATE_TYPES,
   HIDE_DRAWER_UPDATE_TYPES,
   REQUEST_TYPES_GET,
   RESPONSE_TYPES_GET,
   REQUEST_TYPE_CREATE,
   RESPONSE_TYPE_CREATE,
   REQUEST_TYPE_UPDATE,
   RESPONSE_TYPE_UPDATE,
   REQUEST_TYPE_DELETE,
   RESPONSE_TYPE_DELETE,
   ADD_TYPE,
   EDIT_TYPE,
   REMOVE_TYPE
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
     case SHOW_DRAWER_UPDATE_TYPES:
         return { ...state, drawerUpdate: true, editing: payload.id };
     case HIDE_DRAWER_UPDATE_TYPES:
         return { ...state, drawerUpdate: false, editing: payload.id };
     case REQUEST_TYPES_GET:
     case REQUEST_TYPE_CREATE:
     case REQUEST_TYPE_UPDATE:
     case REQUEST_TYPE_DELETE:
         return { ...state, loading: true };
     case RESPONSE_TYPE_CREATE:
     case RESPONSE_TYPE_UPDATE:
     case RESPONSE_TYPE_DELETE:
         return { ...state, loading: false };
     case RESPONSE_TYPES_GET:
         return { ...state, loading: false, data: payload };
     case ADD_TYPE:
         return {
           ...state,
           data: [{ id: payload.id, name: payload.name }, ...state.data]
         };
     case EDIT_TYPE: {
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
     case REMOVE_TYPE: {
       if (payload) {
         return { ...state, loading: false, data: state.data.filter(item => item.id !== payload.id) };
       }
       return { ...state, loading: false };
     }
     default:
       return state;
   }
 }
