/* eslint-disable no-use-before-define */
import { notification, Icon } from 'antd';

export const WS_CONNECTING = 'WS_CONNECTING';
export const WS_CONNECTED = 'WS_CONNECTED';
export const WS_DISCONNECTED = 'WS_DISCONNECTED';
export const WS_SET_USER = 'WS_SET_USER';

let timeout = 250;
let countReconnect = 0;
let socket = null;
let connectInterval;
let forcedClose = true;

const wsProtocol = process.env.WS_PROTOCOL;
const { scheduleConfig } = window;

export const connectWSAction = (filter, token) => (dispatch) => {
    dispatch({ type: WS_CONNECTING });
    forcedClose = false;

    const {
        currentDate,
        speciality,
        filial,
        typeView
    } = filter;

    const params = `?currentDate=${currentDate.format('x')}&speciality=${JSON.stringify(speciality)}&filial=${filial}&typeView=${typeView}&token=${token}`;
    socket = new WebSocket(`${wsProtocol}${scheduleConfig['admin-url']}:${scheduleConfig.port}${params}`);

    socket.onopen = () => {
        dispatch({ type: WS_CONNECTED, payload: socket });

        timeout = 250;
        clearTimeout(connectInterval);

        if (countReconnect > 0) {
            countReconnect = 0;
            notification.destroy();
            notification.success({
                message: 'Успех!',
                description: 'Соединение к серверу восстановлено.'
            });
        }
    };

    socket.onclose = (e) => {
        dispatch({ type: WS_DISCONNECTED });

        if (!forcedClose) {
            if (countReconnect === 0) {
                notification.open({
                    icon: new Icon({ type: 'loading', style: { color: 'var(--primiry-color)' } }),
                    message: 'Восстановление соединения...',
                    description: 'Попытка повторного подключения к серверу...',
                    duration: 0
                });
            }
            console.log(
                `Socket is closed. Reconnect will be attempted in ${Math.min(
                    10000 / 1000,
                    (timeout + timeout) / 1000
                )} second.`,
                e.reason
            );

            timeout += timeout;
            countReconnect++;
            connectInterval = setTimeout(check(socket, dispatch, filter, token), Math.min(10000, timeout));
        }
    };

    socket.onerror = (err) => {
        dispatch({ type: WS_DISCONNECTED });
        if (countReconnect === 0) {
            notification.error({
                message: 'Ошибка',
                description: 'Нет соединения с сервером.'
            });
        }

        console.error('Socket encountered error: ', err.message, 'Closing socket');
        socket.close();
    };
};

export const disconnectWSAction = () => {
    forcedClose = true;
    socket.close();
    console.log('websocket disconnected');
};

export const setUserWSAction = (userID, connectionID) => (dispatch) => {
    dispatch({ type: WS_SET_USER, payload: { userID, connectionID } });
};

const check = (ws, dispatch, filter, token) => {
    if (!ws || ws.readyState === WebSocket.CLOSED) dispatch(connectWSAction(filter, token));
};
