/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import moment from 'moment';

import Header from './Header';
import Footer from './Footer';
import Preloader from './Preloader';
import Filter from '../pages/schedule/filter';
import notification from './notification';
import { connectWSAction, setUserWSAction } from '../ws/actions';
import { setScheduleAction } from '../pages/schedule/actions';
import { LOGIN_ROUTE } from '../constans/routes';
import { getFullNameWorker, playSoundNotification } from '../helpers';

moment.locale('ru');
const { Content } = Layout;

const WrapperSchedule = (Component) => {
    class WrapperScheduleChild extends React.PureComponent {
        static pathPage = Component.pathPage

        static namePage = Component.namePage

        componentDidMount() {
            const { dispatch, schedule, auth } = this.props;
            const { token } = auth;
            const { filter } = schedule;
            dispatch(connectWSAction(filter, token));
        }

        render() {
            const {
                dispatch,
                ws,
                schedule
            } = this.props;
            const styleContent = {
                background: '#fff',
                padding: '15px',
                borderRadius: '4px',
                margin: '15px 0 0 0',
                borderTop: '4px solid var(--primiry-color)',
                boxShadow: '1px 1px 3px 0px rgba(0, 0, 0, 0.05)'
            };

            document.title = `${Component.namePage} | ВедёмПриём`;

            if (ws.ws) {
                ws.ws.onmessage = (e) => {
                    const response = JSON.parse(e.data);
                    const {
                        action,
                        userID,
                        connectionID,
                        data
                    } = response;

                    switch (action) {
                        case 'NO_AUTH': {
                            ws.ws.close();
                            window.location.pathname = LOGIN_ROUTE;
                            break;
                        }
                        case 'CONNECTED': {
                            dispatch(setUserWSAction(userID, connectionID));
                            dispatch(setScheduleAction(data));
                            break;
                        }
                        default:
                            break;
                    }
                };

                if (ws.userConnectionID) {
                    ws.ws.onmessage = (e) => {
                        const response = JSON.parse(e.data);
                        const {
                            action,
                            type,
                            data,
                            unsetData,
                            connectionID,
                            userID,
                            message
                        } = response;

                        switch (action) {
                            case 'NO_AUTH': {
                                ws.ws.close();
                                window.location.pathname = LOGIN_ROUTE;
                                break;
                            }
                            case 'CONNECTED': {
                                dispatch(setUserWSAction(userID, connectionID));
                                dispatch(setScheduleAction(data));
                                break;
                            }
                            case 'GET_SCHEDULE':
                                dispatch(setScheduleAction(data));
                                break;
                            case 'CURRENT_EDITING_WRITES_SCHEDULE': {
                                dispatch({ type: 'WS_CURRENT_EDITING_WRITES_SCHEDULE', payload: { data } });
                                break;
                            }
                            case 'CREATING_WRITE_SCHEDULE':
                            case 'EDITING_WRITE_SCHEDULE': {
                                dispatch({ type, payload: { data, unsetData } });
                                break;
                            }
                            case 'CREATE_WRITE_SCHEDULE': {
                                dispatch({ type, payload: data });
                                if (connectionID === ws.userConnectionID) {
                                    notification('success', 'Успех!', 'Запись создана.');
                                }
                                break;
                            }
                            case 'CREATE_WRITE_SCHEDULE_ERROR': {
                                if (connectionID === ws.userConnectionID) {
                                    // dispatch({ type, payload: data });
                                    notification('error', 'Ошибка', message);
                                }
                                break;
                            }
                            case 'UPDATE_WRITE_SCHEDULE': {
                                dispatch({ type, payload: data });
                                if (connectionID === ws.userConnectionID) {
                                    notification('success', 'Успех!', 'Запись обновлена.');
                                }
                                break;
                            }
                            case 'UPDATE_WRITE_SCHEDULE_ERROR': {
                                if (connectionID === ws.userConnectionID) {
                                    notification('error', 'Ошибка', message);
                                }
                                break;
                            }
                            case 'DELETE_WRITE_SCHEDULE': {
                                dispatch({ type, payload: data });
                                if (connectionID === ws.userConnectionID) {
                                    notification('success', 'Успех!', 'Запись удалена.');
                                }
                                break;
                            }
                            case 'DELETE_WRITE_SCHEDULE_ERROR': {
                                if (connectionID === ws.userConnectionID) {
                                    notification('error', 'Ошибка', message);
                                }
                                break;
                            }
                            case 'CREATE_TICKET_SCHEDULE': {
                                dispatch({ type, payload: data });
                                if (connectionID === ws.userConnectionID) {
                                    notification('success', 'Успех!', 'Талон создан.');
                                }
                                break;
                            }
                            case 'CREATE_TICKET_SCHEDULE_ERROR': {
                                if (connectionID === ws.userConnectionID) {
                                    notification('error', 'Ошибка', message);
                                }
                                break;
                            }
                            case 'DELETE_TICKET_SCHEDULE': {
                                dispatch({ type, payload: data });
                                if (connectionID === ws.userConnectionID) {
                                    notification('success', 'Успех!', 'Талон удалён.');
                                }
                                break;
                            }
                            case 'DELETE_TICKET_SCHEDULE_ERROR': {
                                if (connectionID === ws.userConnectionID) {
                                    notification('error', 'Ошибка', message);
                                }
                                break;
                            }
                            case 'DIVIDE_TICKET_SCHEDULE': {
                                dispatch({ type, payload: data });
                                if (connectionID === ws.userConnectionID) {
                                    notification('success', 'Успех!', 'Талон разделён.');
                                }
                                break;
                            }
                            case 'DIVIDE_TICKET_SCHEDULE_ERROR': {
                                if (connectionID === ws.userConnectionID) {
                                    notification('error', 'Ошибка', message);
                                }
                                break;
                            }
                            case 'REMOVE_DIVIDE_TICKET_SCHEDULE': {
                                dispatch({ type, payload: data });
                                if (connectionID === ws.userConnectionID) {
                                    notification('success', 'Успех!', 'Разделённый талон удалён.');
                                }
                                break;
                            }
                            case 'REMOVE_DIVIDE_TICKET_SCHEDULE_ERROR': {
                                if (connectionID === ws.userConnectionID) {
                                    notification('error', 'Ошибка', message);
                                }
                                break;
                            }
                            case 'RETIME_TICKET_SCHEDULE': {
                                dispatch({ type, payload: data });
                                if (connectionID === ws.userConnectionID) {
                                    notification('success', 'Успех!', 'Талон изменён.');
                                }
                                break;
                            }
                            case 'RETIME_TICKET_SCHEDULE_ERROR': {
                                dispatch({ type, payload: data });
                                if (connectionID === ws.userConnectionID) {
                                    notification('error', 'Ошибка', message);
                                }
                                break;
                            }
                            case 'HIDE_TICKET_SCHEDULE': {
                                dispatch({ type, payload: data });
                                if (connectionID === ws.userConnectionID) {
                                    notification('success', 'Успех!', 'Талон скрыт.');
                                }
                                break;
                            }
                            case 'OPEN_TICKET_SCHEDULE': {
                                dispatch({ type, payload: data });
                                if (connectionID === ws.userConnectionID) {
                                    notification('success', 'Успех!', 'Талон открыт.');
                                }
                                break;
                            }
                            case 'HIDE_TICKET_SCHEDULE_ERROR':
                            case 'OPEN_TICKET_SCHEDULE_ERROR': {
                                dispatch({ type, payload: data });
                                if (connectionID === ws.userConnectionID) {
                                    notification('error', 'Ошибка', message);
                                }
                                break;
                            }
                            case 'CREATE_WRITE_SCHEDULE_NOTIFICATION': {
                                const dataNotification = data[0];
                                const text = `Запись к врачу ${getFullNameWorker(dataNotification.doctor)} на ${moment(dataNotification.ticket.dateTicket).format('DD.MM.YYYY')} в ${moment(dataNotification.ticket.time[0]).format('HH:mm')}`;
                                notification('info', 'Новая запись', text);
                                playSoundNotification();
                                dispatch({ type, payload: data });
                                break;
                            }
                            case 'REMOVE_WRITE_SCHEDULE_NOTIFICATION': {
                                dispatch({ type, payload: data });
                                break;
                            }
                            case 'COPY_TICKETS_DOCTOR_SCHEDULE_ERROR': {
                                if (connectionID === ws.userConnectionID) {
                                    notification('warning', 'Ошибка', message);
                                }
                                break;
                            }
                            default:
                                break;
                        }
                    };

                    if (schedule.data !== null) {
                        return (
                            <section className="app wrapper">
                                <Layout className="app layout">
                                    <Header />
                                    <Content className="app content">
                                        <Filter {...this.props} />
                                        <div style={styleContent} className="app_schedule">
                                            <Component {...this.props} />
                                        </div>
                                    </Content>
                                    <Footer />
                                </Layout>
                            </section>
                        );
                    }
                    return <Preloader />;
                }
                return <Preloader />;
            }
            return <Preloader />;
        }
    }

    const mapStateToProps = state => ({
        settings: state.settings
    });

    WrapperScheduleChild.propTypes = {
        ws: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired
    };

    return connect(mapStateToProps)(WrapperScheduleChild);
};

export default WrapperSchedule;
