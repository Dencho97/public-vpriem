import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Button,
    Modal,
    Form,
    Slider
} from 'antd';

import { SCHEDULE_ROUTE } from '../../constans/routes';
import { history } from '../../store';
import notification from '../../components/notification';
import { switchModalAction, setCreatingWriteAction } from './actions';
import { setCreatingWriteWSAction, divideTicketWSAction } from './actionsWS';
import './style.scss';

class DivideTicket extends Component {
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

        form.validateFields((err, values) => {
            if (!err) {
                if (+values.divide_ticket_duration === 0) {
                    notification('warning', 'Некорректный талон!', 'Невозможно отделить от талона 0 минут.');
                } else {
                    dispatch(switchModalAction('divideTicket'));
                    dispatch(switchModalAction('createWrite'));
                    divideTicketWSAction(creating.ticket, creating.doctor.id, values.divide_ticket_duration, ws);
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

    onClose = () => {
        const { dispatch, form } = this.props;

        dispatch(switchModalAction('divideTicket'));
        history.push(SCHEDULE_ROUTE);
        form.resetFields();
    }

    render() {
        const { schedule, form } = this.props;
        const { modals, creating } = schedule;
        const step = 5;
        const duration = creating ? ((creating.ticket.time[1] - creating.ticket.time[0]) / 1000 / 60) - step : 0;
        const { getFieldDecorator } = form;
        const marks = {};
        const countSteps = (duration / 5);
        for (let i = 1; i <= countSteps; i++) {
            if (countSteps === 1) {
                marks[0] = '';
            }
            marks[i * 5] = '';
        }

        return (
            <Modal
                title="Разделение талона"
                centered
                visible={modals.divideTicket}
                onCancel={() => this.onClose()}
                zIndex={1001}
                footer={[
                    <Button key="save" icon="save" type="primary" onClick={() => this.onSave()}>
                        Разделить
                    </Button>,
                    <Button key="close" onClick={() => this.onClose()}>
                        Закрыть
                    </Button>,
                ]}
            >
                <Form>
                    <Form.Item label="Отделить от талона, мин" style={{ marginTop: '15px' }}>
                        {getFieldDecorator('divide_ticket_duration', {
                            rules: [{ required: true, message: 'Заполните это поле!' }],
                            initialValue: duration
                        })(
                            <Slider
                                min={countSteps === 1 ? 0 : step}
                                max={duration}
                                marks={marks}
                                step={null}
                                tipFormatter={value => <span>{`${value} мин.`}</span>}
                            />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

DivideTicket.propTypes = {
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    schedule: PropTypes.object.isRequired,
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

export default wrapper(DivideTicket);
