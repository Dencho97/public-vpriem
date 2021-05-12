/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Row,
    Col,
    Typography,
    Icon,
    Button,
    Divider,
    Popover,
    Tooltip,
    Modal
} from 'antd';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import TrackVisibility from 'react-on-screen';

import { API_HOST } from '../../constans/api';
import { SCHEDULE_ROUTE } from '../../constans/routes';
import WrapperSchedule from '../../components/WrapperSchedule';
import { history } from '../../store';
import ViewWrite from './viewWrite';
import CreateWrite from './createWrite';
import UpdateWrite from './updateWrite';
import CreateTicket from './createTicket';
import DivideTicket from './divideTicket';
import RetimeTicket from './retimeTicket';
import CopyTickets from './copyTickets';
import TicketItem from './ticket';
import { switchModalAction, setCreatingWriteAction, setEditingWriteAction } from './actions';
import { getFullNameWorker } from '../../helpers';
import { Tutorial } from '../../components/Tutorial';
import { setTutorialAction } from '../../components/Tutorial/actions';
import './style.scss';

moment.locale('ru');

const { Title, Text } = Typography;
const { confirm } = Modal;

class SchedulePage extends Component {
    static pathPage = SCHEDULE_ROUTE;

    static namePage = 'Расписание';

    componentDidMount() {
        const { pathname } = window.location;
        const { dispatch, schedule, tutorial } = this.props;
        const { creating, editing } = schedule;
        const isMobile = window.matchMedia('(max-width: 991px)').matches;

        if (tutorial.active && tutorial.lastTutorial === null && !isMobile) {
            confirm({
                title: 'Добро пожаловать в сервис «ВедёмПриём»!',
                content: 'Вы хотите пройти начальное обучение по работе с сервисом?',
                centered: true,
                okText: 'Да',
                cancelText: 'Нет',
                icon: <Icon type="compass" style={{ color: '#55ab3a' }} />,
                onOk() {
                    dispatch(setTutorialAction('start', true));
                },
                onCancel() {
                    dispatch(setTutorialAction(null, false));
                },
            });
        }

        if (
            pathname.search('createWrite') !== -1
            || pathname.search('viewWrite') !== -1
            || pathname.search('updateWrite') !== -1
            || pathname.search('createTicket') !== -1
            || pathname.search('copyTickets') !== -1
        ) {
            history.replace(SCHEDULE_ROUTE);
            if (creating) {
                dispatch(setCreatingWriteAction('UNSET', creating.ticket, creating.doctor, 0));
                dispatch(switchModalAction('createWrite'));
            } else if (editing) {
                dispatch(setEditingWriteAction('UNSET', editing.ticket, editing.doctor, 0));
                dispatch(switchModalAction('updateWrite'));
            }
        }
    }

    openModal = (type, doctorID, dateTicket, position) => {
        const { dispatch } = this.props;
        history.push(`${SCHEDULE_ROUTE}/${doctorID}/${moment(dateTicket).format('YYYY-MM-DD')}/${type}/${position}`);
        dispatch(switchModalAction(type));
    }

    onPrint = (doctorID, date) => {
        const { auth } = this.props;
        const { token } = auth;

        const windowPrint = window.open(`${API_HOST}print/${doctorID}/${date}?token=${token}`, '111', 'height=400,width=900');
        windowPrint.print();

        return true;
    }

    onCopy = (copyDoctorID, copyDate) => {
        const { dispatch, schedule } = this.props;
        const { data } = schedule;
        const copyDoctor = data.filter(item => +item.id === +copyDoctorID)[0];
        console.log(copyDoctor);
        history.push(`${SCHEDULE_ROUTE}/copyTickets`);
        dispatch(switchModalAction('copyTickets'));
    }

    filterData = () => {
        const { schedule, auth, settings } = this.props;
        const { filter } = schedule;
        let filteredData = [];
        const { user } = auth;
        const isSuperadmin = user.last_name === 'Superadmin';

        switch (filter.typeView) {
            case 0: {
                const isLastDays = +moment().hour(0).minute(0).second(0)
                .format('X')
                > +moment(filter.currentDate).hour(0).minute(0).second(0)
                .format('X');
                filteredData = schedule.data.map((doctor) => {
                    if (filter.doctors.length && !filter.doctors.includes(+doctor.id)) return null;
                    if (!doctor.tickets[0].data.length && !filter.showHolidays) return null;
                    if (!doctor.tickets[0].data.length && filter.showHolidays) {
                        return (
                            <Col span={12} md={7} lg={5} xl={4} xxl={3} key={`test-${doctor.id}`} className="schedule_wrapper-col">
                                <div className="schedule__header">
                                    <Popover
                                        content={(
                                            <div>
                                                <span>
                                                    <b>Специальность:</b>
                                                    &nbsp;
                                                    {doctor.services.length ? <Text className="schedule__header_services">{doctor.services.join(', ')}</Text> : null}
                                                </span>
                                                <br />
                                                <span>
                                                    <b>Филиал:</b>
                                                    &nbsp;
                                                    {doctor.filial.name}
                                                </span>
                                            </div>
                                        )}
                                        title={getFullNameWorker(doctor)}
                                    >
                                        <Title level={4} className="schedule__header_name">{getFullNameWorker(doctor)}</Title>
                                    </Popover>
                                    <div className="schedule__header__info">
                                        <div className="schedule__header_actions">
                                        <Tooltip placement="bottom" title="Печать">
                                            <button type="button" onClick={() => this.onPrint(doctor.id, doctor.tickets[0].date)}><Icon type="printer" /></button>
                                        </Tooltip>
                                        {/* <Tooltip placement="bottom" title="Копировать талоны">
                                            <button type="button" onClick={() => this.onCopy(+doctor.id, filter.currentDate)}><Icon type="block" /></button>
                                        </Tooltip> */}
                                        </div>
                                        <Divider className="schedule__header_divider" />
                                    </div>
                                </div>
                                <div className="schedule__tickets">
                                    {doctor.tickets[0].data.length && auth.permissions['tickets/create'] ? (
                                        <Button
                                            type="dashed"
                                            className="schedule__tickets_add"
                                            onClick={() => this.openModal('createTicket', doctor.id, doctor.tickets[0].date, 'toStart')}
                                            disabled={isLastDays && !isSuperadmin}
                                        >
                                            <Icon type="plus-circle" />
                                            Создать талон
                                        </Button>
                                    ) : null}
                                    {doctor.tickets[0].data.length ? doctor.tickets[0].data.map((ticket, i) => {
                                        if (ticket.type !== 'break' && ticket.parts.length) {
                                            return ticket.parts.map((divideTicket, j) => (
                                                <TicketItem
                                                    key={`ticket-${doctor.id}-${i + 1}-${j + 1}`}
                                                    originalTicket={ticket}
                                                    ticket={divideTicket}
                                                    doctor={doctor}
                                                    isSuperadmin={isSuperadmin}
                                                    isLastDays={isLastDays}
                                                />
                                            ));
                                        }
                                        return (
                                            <TicketItem
                                                key={`ticket-${doctor.id}-${i + 1}`}
                                                ticket={ticket}
                                                doctor={doctor}
                                                isSuperadmin={isSuperadmin}
                                                isLastDays={isLastDays}
                                            />
                                        );
                                    }) : null}
                                    {!doctor.tickets[0].data.length ? (
                                        <b className="schedule__tickets_holiday">Выходной</b>
                                    ) : null}
                                    {auth.permissions['tickets/create'] ? (
                                        <Button
                                            type="dashed"
                                            className="schedule__tickets_add"
                                            onClick={() => this.openModal('createTicket', doctor.id, doctor.tickets[0].date, 'toEnd')}
                                            disabled={isLastDays && !isSuperadmin}
                                        >
                                            <Icon type="plus-circle" />
                                            Создать талон
                                        </Button>
                                    ) : null}
                                </div>
                            </Col>
                        );
                    }

                    return (
                        <Col span={12} md={7} lg={5} xl={4} xxl={3} key={`${doctor.id}`} className="schedule_wrapper-col">
                            <div className="schedule__header">
                                <Popover
                                    placement="bottom"
                                    overlayClassName="doctor-popover"
                                    content={(
                                        <div>
                                            <span>
                                                <b>Специальность:</b>
                                                <br />
                                                {doctor.services.length ? <Text className="schedule__header_services">{doctor.services.join(', ')}</Text> : null}
                                            </span>
                                            <br />
                                            <span>
                                                <b>Филиал:</b>
                                                <br />
                                                <Text className="schedule__header_filial">{doctor.filial.name}</Text>
                                            </span>
                                        </div>
                                    )}
                                    title={getFullNameWorker(doctor)}
                                >
                                    <Title level={4} className="schedule__header_name">{getFullNameWorker(doctor)}</Title>
                                </Popover>
                                <div className="schedule__header__info">
                                    <div className="schedule__header_actions">
                                        <Tooltip placement="bottom" title="Печать">
                                            <button type="button" onClick={() => this.onPrint(doctor.id, doctor.tickets[0].date)}><Icon type="printer" /></button>
                                        </Tooltip>
                                        {/* <Tooltip placement="bottom" title="Копировать талоны">
                                            <button type="button" onClick={() => this.onCopy(+doctor.id, filter.currentDate)}><Icon type="block" /></button>
                                        </Tooltip> */}
                                    </div>
                                </div>
                            </div>
                            <div className="schedule__tickets">
                                {doctor.tickets[0].data.length && auth.permissions['tickets/create'] ? (
                                    <Button
                                        type="dashed"
                                        className="schedule__tickets_add"
                                        onClick={() => this.openModal('createTicket', doctor.id, doctor.tickets[0].date, 'toStart')}
                                        disabled={isLastDays && !isSuperadmin}
                                    >
                                        <Icon type="plus-circle" />
                                        Создать талон
                                    </Button>
                                ) : null}
                                {doctor.tickets[0].data.length ? doctor.tickets[0].data.map((ticket, i) => {
                                    if (ticket.type !== 'break' && ticket.parts.length) {
                                        return ticket.parts.map((divideTicket, j) => (
                                            <TicketItem
                                                key={`ticket-${doctor.id}-${i + 1}-${j + 1}`}
                                                originalTicket={ticket}
                                                ticket={divideTicket}
                                                doctor={doctor}
                                                isSuperadmin={isSuperadmin}
                                                isLastDays={isLastDays}
                                            />
                                        ));
                                    }
                                    return (
                                        <TicketItem
                                            key={`ticket-${doctor.id}-${i + 1}`}
                                            ticket={ticket}
                                            doctor={doctor}
                                            isSuperadmin={isSuperadmin}
                                            isLastDays={isLastDays}
                                        />
                                    );
                                }) : null}
                                {!doctor.tickets[0].data.length ? (
                                    <b className="schedule__tickets_holiday">Выходной</b>
                                ) : null}
                                {auth.permissions['tickets/create'] ? (
                                    <Button
                                        type="dashed"
                                        className="schedule__tickets_add"
                                        onClick={() => this.openModal('createTicket', doctor.id, doctor.tickets[0].date, 'toEnd')}
                                        disabled={isLastDays && !isSuperadmin}
                                    >
                                        <Icon type="plus-circle" />
                                        Создать талон
                                    </Button>
                                ) : null}
                            </div>
                        </Col>
                    );
                });
                break;
            }
            case 1: {
                filteredData = schedule.data.map((doctor) => {
                    const { data: settingsData } = settings;
                    const placeholder = settingsData && settingsData.placeholder ? `${window.location.origin}${settingsData.placeholder}` : '//schedule-dist.redken.online/v1/admin/assets/placeholder.jpg';

                    if (filter.doctors.length && !filter.doctors.includes(+doctor.id)) return null;
                    return (
                        <React.Fragment key={doctor.id}>
                            <TrackVisibility once partialVisibility offset={300}>
                                {({ isVisible }) => isVisible && (
                                <div className="schedule_week-row">
                                    <Row gutter={5} className="schedule_wrapper-row type-view-week">
                                        <Col span={24} className="schedule_wrapper-col">
                                            <div className="schedule__header type-view-week">
                                                <div className="schedule__header_photo" style={{ backgroundImage: `url('${doctor.photo !== '' ? doctor.photo : placeholder}')` }} />
                                                <div>
                                                    <Title level={4} className="schedule__header_name">{getFullNameWorker(doctor)}</Title>
                                                    <div className="schedule__header__info">
                                                        <Text className="schedule__header_filial">{doctor.filial.name}</Text>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col span={24} className="schedule_wrapper-col-content">
                                            <div className="schedule__tickets type-view-week">
                                                {doctor.tickets.map((dayTickets, n) => {
                                                    const isLastDays = +moment().hour(0).minute(0).second(0)
                                                    .format('X')
                                                    > +moment(dayTickets.date).hour(0).minute(0).second(0)
                                                    .format('X');
                                                    return (
                                                        <div className="schedule__tickets__day" key={dayTickets.date}>
                                                            <div className="schedule__tickets__day__header">
                                                                <Text className="schedule__tickets__day__header_title">{moment(dayTickets.date).format('dd, DD MMMM')}</Text>
                                                                <div className="schedule__tickets__day__header_print">
                                                                    <button type="button" onClick={() => this.onPrint(doctor.id, dayTickets.date)}><Icon type="printer" /></button>
                                                                </div>
                                                                <Divider className="schedule__header_divider" />
                                                            </div>
                                                            {dayTickets.data.length && auth.permissions['tickets/create'] ? (
                                                                <Button
                                                                    type="dashed"
                                                                    className="schedule__tickets_add"
                                                                    onClick={() => this.openModal('createTicket', doctor.id, dayTickets.date, 'toStart')}
                                                                    disabled={isLastDays && !isSuperadmin}
                                                                >
                                                                    <Icon type="plus-circle" />
                                                                    Создать талон
                                                                </Button>
                                                            ) : null}
                                                            {dayTickets.data.length ? dayTickets.data.map((ticket, i) => {
                                                                if (ticket.type !== 'break' && ticket.parts.length) {
                                                                    return ticket.parts.map((divideTicket, j) => (
                                                                        <TicketItem
                                                                            key={`ticket-${doctor.id}-${i + 1}-${j + 1}`}
                                                                            originalTicket={ticket}
                                                                            ticket={divideTicket}
                                                                            doctor={doctor}
                                                                            isLastDays={isLastDays}
                                                                            isSuperadmin={isSuperadmin}
                                                                        />
                                                                    ));
                                                                }
                                                                return (
                                                                    <TicketItem
                                                                        key={`ticket-${doctor.id}-${i + 1}-${n + 1}`}
                                                                        ticket={ticket}
                                                                        doctor={doctor}
                                                                        isLastDays={isLastDays}
                                                                        isSuperadmin={isSuperadmin}
                                                                    />
                                                                );
                                                            }) : null}
                                                            {!dayTickets.data.length ? (
                                                                <b className="schedule__tickets_holiday">Выходной</b>
                                                            ) : null}
                                                            {auth.permissions['tickets/create'] ? (
                                                                <Button
                                                                    type="dashed"
                                                                    className="schedule__tickets_add"
                                                                    onClick={() => this.openModal('createTicket', doctor.id, dayTickets.date, 'toEnd')}
                                                                    disabled={isLastDays && !isSuperadmin}
                                                                >
                                                                    <Icon type="plus-circle" />
                                                                    Создать талон
                                                                </Button>
                                                            ) : null}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </Col>
                                        <Divider className="schedule__header_divider" />
                                    </Row>
                                </div>
                                )}
                            </TrackVisibility>
                        </React.Fragment>
                    );
                });
                break;
            }
            default:
                return filteredData;
        }

        const isEmptyData = filteredData.filter(item => item !== null);

        return isEmptyData.length ? filteredData : isEmptyData;
    }

    render() {
        const { schedule } = this.props;
        const { filter } = schedule;
        const data = this.filterData();

        const windowHeight = window.innerHeight;
        const filterHeight = document.getElementsByClassName('filter').length ? document.getElementsByClassName('filter')[0].offsetHeight : 0;
        const headerHeight = document.getElementsByClassName('header').length ? document.getElementsByClassName('header')[0].offsetHeight : 0;
        const footerHeight = document.getElementsByClassName('ant-layout-footer').length ? document.getElementsByClassName('ant-layout-footer')[0].offsetHeight : 0;
        const othersOffset = 70;
        const pageScheduleHeight = windowHeight - (filterHeight + headerHeight + footerHeight + othersOffset);

        switch (filter.typeView) {
            case 0:
                return (
                    <section className="schedule page" style={{ height: pageScheduleHeight }}>
                        {data.length ? (
                            <>
                                <Row gutter={5} className="schedule_wrapper-row" style={{ margin: 0 }}>
                                    <Scrollbars
                                        renderView={props => <div {...props} className="schedule_scroll-view" />}
                                        renderTrackHorizontal={({ style, ...props }) => <div {...props} className="schedule__scrollbar-x" />}
                                        renderThumbHorizontal={props => <div {...props} className="schedule__scrollbar-x_thumb" />}
                                        renderTrackVertical={({ style, ...props }) => <div {...props} className="schedule__scrollbar-y" />}
                                        renderThumbVertical={props => <div {...props} className="schedule__scrollbar-y_thumb" />}
                                        autoHide
                                    >
                                        {data}
                                    </Scrollbars>
                                </Row>
                                <ViewWrite />
                                <CreateWrite />
                                <UpdateWrite />
                                <CreateTicket />
                                <DivideTicket />
                                <RetimeTicket />
                                <CopyTickets />
                            </>
                        ) : (
                            <Title level={3} style={{ margin: '50px 0', textAlign: 'center' }}>~ Нет расписания ~</Title>
                        )}
                        <Tutorial />
                    </section>
                );
            case 1:
                return (
                    <section className="schedule page">
                        {data.length ? (
                            <>
                                {data}
                                <ViewWrite />
                                <CreateWrite />
                                <UpdateWrite />
                                <CreateTicket />
                                <DivideTicket />
                                <RetimeTicket />
                                <CopyTickets />
                            </>
                        ) : (
                            <Title level={3} style={{ margin: '50px 0', textAlign: 'center' }}>~ Нет расписания ~</Title>
                        )}
                        <Tutorial />
                    </section>
                );
            default:
                return null;
        }
    }
}

SchedulePage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    schedule: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    tutorial: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    schedule: state.schedule,
    auth: state.auth,
    ws: state.ws,
    settings: state.settings,
    tutorial: state.tutorial
});

const wrapper = compose(
    connect(mapStateToProps),
    WrapperSchedule
);

export default wrapper(SchedulePage);
