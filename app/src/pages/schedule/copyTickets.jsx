import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Button,
    Modal,
    Form,
    DatePicker,
    Select
} from 'antd';
import moment from 'moment';

import { getFullNameWorker } from '../../helpers';
import { SCHEDULE_ROUTE } from '../../constans/routes';
import localDatePicker from '../../constans/ruLocalePicker';
import { history } from '../../store';
import notification from '../../components/notification';
import { switchModalAction, setCreatingWriteAction } from './actions';
import { copyTicketsDoctorWSAction } from './actionsWS';
import './style.scss';

const { Option } = Select;

class CopyTickets extends Component {
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
                const dataSend = {
                    copyToDate: +moment(values.copy_tickets_date).format('x'),
                    copyToDoctorID: +values.copy_tickets_doctor,
                    copyTickets: null,
                };
                copyTicketsDoctorWSAction(dataSend, ws);
                // dispatch(switchModalAction('copyTickets'));
                // divideTicketWSAction(creating.ticket, creating.doctor.id, values.divide_ticket_duration, ws);
                // setCreatingWriteWSAction('UNSET', creating.ticket, creating.doctor, user.user_id, ws);
                // dispatch(setCreatingWriteAction('UNSET', creating.ticket, creating.doctor, user.user_id));
                // history.push(SCHEDULE_ROUTE);
                // form.resetFields();
            } else {
                console.log('error field');
            }
        });
    }

    onSelectWorker = () => {
        return true;
    }

    onClose = () => {
        const { dispatch, form } = this.props;

        dispatch(switchModalAction('copyTickets'));
        history.push(SCHEDULE_ROUTE);
        form.resetFields();
    }

    disabledDate = current => (current < moment().endOf('day'));

    render() {
        const { schedule, workers, form } = this.props;
        const { modals } = schedule;
        const { getFieldDecorator } = form;

        return (
            <Modal
                title="Копирование талонов"
                centered
                visible={modals.copyTickets}
                onCancel={() => this.onClose()}
                footer={[
                    <Button key="save" icon="save" type="primary" onClick={() => this.onSave()}>
                        Копировать
                    </Button>,
                    <Button key="close" onClick={() => this.onClose()}>
                        Закрыть
                    </Button>,
                ]}
            >
                <Form>
                    <Form.Item label="Выберите дату">
                        {getFieldDecorator('copy_tickets_date', {
                            rules: [{ required: true, message: 'Заполните это поле!' }]
                        })(
                            <DatePicker
                                placeholder="__.__.____"
                                format="DD.MM.YYYY"
                                showToday={false}
                                disabledDate={date => this.disabledDate(date)}
                                locale={localDatePicker}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="Выберите специалиста">
                        {getFieldDecorator('copy_tickets_doctor', {
                            rules: [{ required: true, message: 'Заполните это поле!' }]
                        })(
                            <Select placeholder="Выберите специалиста" loading={workers.loading}>
                                {workers.data && !workers.loading ? workers.data.map((worker) => {
                                    if (+worker.type_id === 1) {
                                        return <Option key={worker.id} value={+worker.id}>{getFullNameWorker(worker)}</Option>;
                                    }
                                    return null;
                                }) : null}
                            </Select>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

CopyTickets.propTypes = {
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    schedule: PropTypes.object.isRequired,
    workers: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    ws: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    schedule: state.schedule,
    auth: state.auth,
    workers: state.workers,
    ws: state.ws
});

const wrapper = compose(
    connect(mapStateToProps),
    Form.create()
);

export default wrapper(CopyTickets);
