import axios from 'axios';
import { API_HOST } from '../../constans/api';

export const UNSET_AUTH = 'UNSET_AUTH';
export const REQUEST_AUTH = 'REQUEST_AUTH';
export const RESPONSE_AUTH = 'RESPONSE_AUTH';

export const checkAuthAction = token => (dispatch) => {
    dispatch({ type: REQUEST_AUTH });

    axios.get(`${API_HOST}auth?token=${token}`)
    .then((response) => {
        const { data } = response;

        dispatch({
           type: RESPONSE_AUTH,
           payload: data
        });
    })
    .catch((error) => {
           dispatch({ type: RESPONSE_AUTH, payload: null });
           console.error(error);
    });
};

export const authAction = userdata => (dispatch) => {
    dispatch({ type: REQUEST_AUTH });

    const formData = new FormData();
    const sendData = {
        email: userdata.login,
        password: userdata.password
    };

    for (const key in sendData) {
        if ({}.hasOwnProperty.call(sendData, key)) {
            formData.append(key, sendData[key] !== undefined ? sendData[key] : '');
        }
    }

   axios.post(
        `${API_HOST}auth`,
        formData
      )
      .then((response) => {
        const { data } = response;
        dispatch({
            type: RESPONSE_AUTH,
            payload: data
        });
      })
      .catch((error) => {
            dispatch({ type: RESPONSE_AUTH, payload: null });
            console.error(error);
      });
};

export const logOutAction = () => (dispatch) => {
    dispatch({ type: UNSET_AUTH });
};
