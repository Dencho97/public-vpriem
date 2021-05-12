import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Button,
    Modal,
    Form,
    TimePicker
} from 'antd';
import moment from 'moment';

import { SCHEDULE_ROUTE } from '../../constans/routes';
import { history } from '../../store';
import { checkAvailibleTicket, getWorkerIdFromUrl, getDateFromUrl } from '../../helpers';
import { switchModalAction } from './actions';
import { createTicketWSAction } from './actionsWS';
import './style.scss';

moment.locale('ru');

class CreateTicket extends Component {
    state = {
        timePickerTicket: {
            start: false,
            end: false
        },
    }

    getDoctorItem = () => {
        const { schedule } = this.props;
        const id = getWorkerIdFromUrl();
        const doctorItem = schedule.data.filter(item => +item.id === +id)[0];

        return doctorItem || null;
    }

    getPositionFromURL = () => {
        const { pathname } = window.location;
        const arrayURL = pathname.split('/');

        return arrayURL[arrayURL.length - 1];
    }

    getLastAndStartTicket = () => {
        const doctorItem = this.getDoctorItem();
        const tickets = doctorItem ? doctorItem.tickets : null;
        if (tickets === null || !tickets[0].data.length) return null;
        const date = getDateFromUrl();
        const position = this.getPositionFromURL();
        const dayTickets = tickets.filter(day => moment(day.date).format('DD.MM.YYYY') === moment(date).format('DD.MM.YYYY'))[0].data;
        if (!dayTickets.length) return null;
        const lastTicketFinalTime = dayTickets[dayTickets.length - 1].time[1];
        const firstTicketStartTime = dayTickets[0].time[0];

        const lastTicketTime = {
            hour: moment(lastTicketFinalTime).hour(),
            minute: moment(lastTicketFinalTime).minutes()
        };
        const firstTicketTime = {
            hour: moment(firstTicketStartTime).hour(),
            minute: moment(firstTicketStartTime).minutes()
        };

        const endTimeUnix = +moment().set({ hour: lastTicketTime.hour, minute: lastTicketTime.minute }).format('x');
        const startTimeUnix = +moment().set({ hour: firstTicketTime.hour, minute: firstTicketTime.minute }).format('x');

        switch (position) {
            case 'toStart':
                return startTimeUnix;
            case 'toEnd':
                return endTimeUnix;
            default:
                return 0;
        }
    }

    onSave = () => {
        const {
            dispatch,
            form,
            ws
        } = this.props;

        form.validateFields((err, values) => {
            if (!err) {
                const currentDoctor = this.getDoctorItem();
                const date = getDateFromUrl();
                const position = this.getPositionFromURL();
                const currentDateTickets = currentDoctor.tickets.filter(day => moment(day.date).format('DD.MM.YYYY') === moment(date).format('DD.MM.YYYY'))[0];
                const availibleTicket = checkAvailibleTicket(values.ticket_time_start, values.ticket_time_end, currentDateTickets.data, position);
                if (availibleTicket) {
                    createTicketWSAction(values, currentDoctor.id, date, position, ws);
                    dispatch(switchModalAction('createTicket'));
                    history.push(SCHEDULE_ROUTE);
                    form.resetFields();
                }
            } else {
                console.log('error field');
            }
        });
    }

    onClose = () => {
        const { dispatch, form } = this.props;

        dispatch(switchModalAction('createTicket'));
        history.push(SCHEDULE_ROUTE);
        form.resetFields();
    }

    onTimeChange = (type) => {
        const { timePickerTicket } = this.state;
        this.setState(prevState => ({
            ...prevState,
            timePickerTicket: { ...timePickerTicket, [type]: !timePickerTicket[type] }
        }));
    }

    render() {
        const { schedule, form } = this.props;
        const { timePickerTicket } = this.state;
        const { modals } = schedule;
        const { getFieldDecorator } = form;
        const position = modals.createTicket ? this.getPositionFromURL() : null;
        const baseTicket = modals.createTicket ? this.getLastAndStartTicket() : null;

        return (
            <Modal
                title="Создание талона"
                centered
                visible={modals.createTicket}
                onCancel={() => this.onClose()}
                footer={[
                    <Button key="save" icon="save" type="primary" onClick={() => this.onSave()}>
                        Создать
                    </Button>,
                    <Button key="close" onClick={() => this.onClose()}>
                        Закрыть
                    </Button>,
                ]}
            >
                <Form>
                    <Form.Item label="Время начала">
                        {getFieldDecorator('ticket_time_start', {
                            rules: [{ required: true, message: 'Заполните это поле!' }],
                            initialValue: position === 'toEnd' && baseTicket ? moment(baseTicket) : null
                        })(
                            <TimePicker
                                format="HH:mm"
                                placeholder="Выберите время"
                                minuteStep={5}
                                open={timePickerTicket.start}
                                onOpenChange={() => this.onTimeChange('start')}
                                disabled={Boolean(position === 'toEnd' && baseTicket)}
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label="Время окончания">
                        {getFieldDecorator('ticket_time_end', {
                            rules: [{ required: true, message: 'Заполните это поле!' }],
                            initialValue: position === 'toStart' && baseTicket ? moment(baseTicket) : null
                        })(
                            <TimePicker
                                format="HH:mm"
                                placeholder="Выберите время"
                                minuteStep={5}
                                open={timePickerTicket.end}
                                onOpenChange={() => this.onTimeChange('end')}
                                disabled={Boolean(position === 'toStart' && baseTicket)}
                            />,
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

CreateTicket.propTypes = {
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    schedule: PropTypes.object.isRequired,
    ws: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    schedule: state.schedule,
    ws: state.ws
});

const wrapper = compose(
    connect(mapStateToProps),
    Form.create()
);

export default wrapper(CreateTicket);
