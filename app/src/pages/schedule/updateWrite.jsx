import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Button,
    Modal,
    Form,
    Input,
    Select,
    DatePicker
} from 'antd';
import moment from 'moment';

import InputMask from '../../components/InputMask';
import { SCHEDULE_ROUTE } from '../../constans/routes';
import { PAYMENTS } from '../../constans/payments';
import { TYPE_RECEPTIONS } from '../../constans/type-receptions';
import { STATUSES } from '../../constans/statuses-writes';
import { history } from '../../store';
import { switchModalAction, setEditingWriteAction } from './actions';
import { editWriteWSAction, setEditingWriteWSAction } from './actionsWS';
import './style.scss';

moment.locale('ru');

const { TextArea } = Input;
const { Option } = Select;

class UpdateWrite extends Component {
    onSave = () => {
        const {
            dispatch,
            schedule,
            form,
            auth,
            ws
        } = this.props;
        const { editing } = schedule;
        const { user } = auth;

        form.validateFields((err, values) => {
            if (!err) {
                dispatch(switchModalAction('updateWrite'));
                history.push(SCHEDULE_ROUTE);
                form.resetFields();
                setEditingWriteAction('UNSET', editing.ticket, editing.doctor, user.user_id, ws);

                const newValues = values;
                newValues.patient_phone = auth.permissions['writes/fields/phone'] ? values.patient_phone : editing.ticket.data.patient_phone;
                editWriteWSAction(newValues, editing, ws);
            } else {
                console.log('error field');
            }
        });
    }

    onClose = () => {
        const {
            dispatch,
            form,
            schedule,
            auth,
            ws
        } = this.props;
        const { editing } = schedule;
        const { user } = auth;

        dispatch(switchModalAction('updateWrite'));
        history.push(SCHEDULE_ROUTE);
        form.resetFields();
        setEditingWriteWSAction('UNSET', editing.ticket, editing.doctor, user.user_id, ws);
        dispatch(setEditingWriteAction('UNSET', editing.ticket, editing.doctor, user.user_id));
    }

    render() {
        const { schedule, form, auth } = this.props;
        const { modals, editing } = schedule;
        const { getFieldDecorator } = form;
        const timeWrite = editing ? `${moment(editing.ticket.data.date_write).format('D MMMM YYYY')} ${moment(editing.ticket.time[0]).format('HH:mm')}-${moment(editing.ticket.time[1]).format('HH:mm')}` : '';

        return (
            <Modal
                title={`Редактирование записи ${timeWrite}`}
                centered
                visible={modals.updateWrite}
                onCancel={() => this.onClose()}
                footer={[
                    <Button key="save" icon="save" type="primary" onClick={() => this.onSave()} loading={schedule.loading}>
                        Сохранить
                    </Button>,
                    <Button key="close" onClick={() => this.onClose()}>
                        Закрыть
                    </Button>,
                ]}
            >
                <Form>
                    <Form.Item label="Статус">
                        {getFieldDecorator('write_status', {
                            rules: [{ required: true, message: 'Заполните это поле!' }],
                            initialValue: editing ? editing.ticket.data.status : undefined
                        })(
                            <Select placeholder="Выберите статус">
                                {Object.keys(STATUSES).map(key => <Option key={STATUSES[key].value} value={STATUSES[key].value}>{STATUSES[key].name}</Option>)}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="Ф.И.О. пациента">
                        {getFieldDecorator('patient_last_name', {
                            rules: [{ required: true, message: 'Заполните это поле!' }],
                            initialValue: editing ? editing.ticket.data.patient_last_name : ''
                        })(
                            <Input placeholder="Фамилия" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('patient_first_name', {
                            rules: [{ required: true, message: 'Заполните это поле!' }],
                            initialValue: editing ? editing.ticket.data.patient_first_name : ''
                        })(
                            <Input placeholder="Имя" />
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('patient_second_name', {
                            rules: [{ required: true, message: 'Заполните это поле!' }],
                            initialValue: editing ? editing.ticket.data.patient_second_name : ''
                        })(
                            <Input placeholder="Отчество" />
                        )}
                    </Form.Item>
                    {auth.permissions['writes/fields/phone'] ? (
                        <Form.Item label="Телефон пациента">
                            {getFieldDecorator('patient_phone', {
                                rules: [{ required: true, message: 'Заполните это поле!' }],
                                initialValue: editing ? editing.ticket.data.patient_phone : ''
                            })(
                                <InputMask mask="+7(999)999-99-99" maskChar="_" name="testPhone" placeholder="+7(___)___-__-__" />
                            )}
                        </Form.Item>
                    ) : null}
                    <Form.Item label="Дата рождения пациента">
                        {getFieldDecorator('patient_birthday', {
                            rules: [{ required: true, message: 'Заполните это поле!' }],
                            initialValue: editing ? moment(+editing.ticket.data.patient_birthday) : undefined
                        })(
                            <DatePicker placeholder="__.__.____" format="DD.MM.YYYY" showToday={false} />
                        )}
                    </Form.Item>
                    <Form.Item label="Вариант оплаты">
                        {getFieldDecorator('patient_type-payment', {
                            rules: [{ required: true, message: 'Заполните это поле!' }],
                            initialValue: editing ? +editing.ticket.data.patient_type_payment : undefined
                        })(
                            <Select placeholder="Выберите оплату">
                                {PAYMENTS.map(item => <Option key={item.value} value={item.value}>{item.name}</Option>)}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="Вариант приема">
                        {getFieldDecorator('patient_type-reception', {
                            rules: [{ required: true, message: 'Заполните это поле!' }],
                            initialValue: editing ? +editing.ticket.data.patient_type_reception : undefined
                        })(
                            <Select placeholder="Выберите вариант приёма">
                                {TYPE_RECEPTIONS.map(item => <Option key={item.value} value={item.value}>{item.name}</Option>)}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label="Комментарий">
                        {getFieldDecorator('patient_comment', {
                            rules: [{ required: false }],
                            initialValue: editing ? editing.ticket.data.patient_comment : ''
                        })(
                            <TextArea placeholder="Комментарий к записи" autosize={{ minRows: 2, maxRows: 6 }} />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

UpdateWrite.propTypes = {
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

export default wrapper(UpdateWrite);
