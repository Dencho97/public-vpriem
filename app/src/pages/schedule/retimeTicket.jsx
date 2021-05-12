import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    TimePicker,
    Form,
    Button,
    Modal
} from 'antd';
import moment from 'moment';

import { SCHEDULE_ROUTE } from '../../constans/routes';
import { history } from '../../store';
import notification from '../../components/notification';
import { switchModalAction, setCreatingWriteAction } from './actions';
import { retimeTicketWSAction, setCreatingWriteWSAction } from './actionsWS';
import './style.scss';

class RetimeTicket extends Component {
    onClose = () => {
        const { dispatch, form } = this.props;
        dispatch(switchModalAction('retimeTicket'));
        form.resetFields();
    }

    onSave = () => {
        const {
            dispatch,
            form,
            schedule,
            auth,
            ws
        } = this.props;
        const { creating } = schedule;
        const { user } = auth;
        const initTimeStart = creating ? +moment(creating.ticket.time[0]).format('x') : null;
        const initTimeEnd = creating ? +moment(creating.ticket.time[1]).format('x') : null;

        form.validateFields((err, values) => {
            if (!err) {
                const newStartTime = +values.ticket_time_start.format('x');
                const newEndTime = +values.ticket_time_end.format('x');

                if (initTimeStart === newStartTime && initTimeEnd === newEndTime) {
                    notification('warning', 'Некорректное время!', 'Время талона совпадает с указанным.');
                } else {
                    dispatch(switchModalAction('retimeTicket'));
                    dispatch(switchModalAction('createWrite'));
                    retimeTicketWSAction(creating.ticket, creating.doctor.id, [newStartTime, newEndTime], ws);
                    setCreatingWriteWSAction('UNSET', creating.ticket, creating.doctor, user.user_id, ws);
                    dispatch(setCreatingWriteAction('UNSET', creating.ticket, creating.doctor, user.user_id));
                    history.push(SCHEDULE_ROUTE);
                    form.resetFields();
                }
            } else {
                console.log('error field');
            }
        });
    }

    onReset = () => {
        const {
            dispatch,
            form,
            schedule,
            auth,
            ws
        } = this.props;
        const { creating } = schedule;
        const { user } = auth;
        const initTimeStart = creating ? +moment(creating.ticket.time[0]).format('x') : null;
        const initTimeEnd = creating ? +moment(creating.ticket.time[1]).format('x') : null;

        dispatch(switchModalAction('retimeTicket'));
        dispatch(switchModalAction('createWrite'));
        retimeTicketWSAction(creating.ticket, creating.doctor.id, [initTimeStart, initTimeEnd], ws);
        setCreatingWriteWSAction('UNSET', creating.ticket, creating.doctor, user.user_id, ws);
        dispatch(setCreatingWriteAction('UNSET', creating.ticket, creating.doctor, user.user_id));
        history.push(SCHEDULE_ROUTE);
        form.resetFields();
    }

    render() {
        const { schedule, form } = this.props;
        const { modals, creating } = schedule;
        const { getFieldDecorator } = form;
        const isRetime = creating ? creating.ticket.isRetime : 0;
        let initTimeStart = creating ? moment(creating.ticket.time[0]) : null;
        let initTimeEnd = creating ? moment(creating.ticket.time[1]) : null;

        if (creating && isRetime) {
            initTimeStart = moment(creating.ticket.reTime[0]);
            initTimeEnd = moment(creating.ticket.reTime[1]);
        }

        // const initTimeStart = creating ? moment(creating.ticket.reTime[0]) : null;
        // const initTimeEnd = creating ? moment(creating.ticket.reTime[1]) : null;

        return (
                <Modal
                    title="Изменить время талона"
                    centered
                    visible={modals.retimeTicket}
                    onOk={() => this.onClose()}
                    onCancel={() => this.onClose()}
                    zIndex={1001}
                    footer={(
                        <>
                            {isRetime ? (
                                <Button key="reset" icon="reload" type="dashed" onClick={() => this.onReset()} loading={schedule.loading}>
                                    Сбросить
                                </Button>
                            ) : null}
                            <Button key="save" icon="save" type="primary" onClick={() => this.onSave()} loading={schedule.loading}>
                                Сохранить
                            </Button>
                        </>
                    )}
                >
                    <Form>
                        <Form.Item label="Время талона" style={{ marginBottom: 0 }}>
                            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                                {getFieldDecorator('ticket_time_start', {
                                    rules: [{ required: true, message: 'Заполните это поле!' }],
                                    initialValue: initTimeStart
                                })(
                                    <TimePicker
                                        format="HH:mm"
                                        placeholder="Начало талона"
                                        minuteStep={5}
                                    />,
                                )}
                            </Form.Item>
                            <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>~</span>
                            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                                {getFieldDecorator('ticket_time_end', {
                                    rules: [{ required: true, message: 'Заполните это поле!' }],
                                    initialValue: initTimeEnd
                                })(
                                    <TimePicker
                                        format="HH:mm"
                                        placeholder="Конец талона"
                                        minuteStep={5}
                                    />,
                                )}
                            </Form.Item>
                        </Form.Item>
                    </Form>
                </Modal>
        );
    }
}

RetimeTicket.propTypes = {
    dispatch: PropTypes.func.isRequired,
    schedule: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    ws: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    schedule: state.schedule,
    auth: state.auth,
    ws: state.ws
});

const wrapper = compose(
    connect(mapStateToProps),
    Form.create()
);

export default wrapper(RetimeTicket);
