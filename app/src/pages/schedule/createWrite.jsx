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
    DatePicker,
    Menu,
    Dropdown,
    Icon
} from 'antd';
import moment from 'moment';

import InputMask from '../../components/InputMask';
import { SCHEDULE_ROUTE } from '../../constans/routes';
import { history } from '../../store';
import { switchModalAction, setCreatingWriteAction, switchHideTicketAction } from './actions';
import {
    createWriteWSAction,
    setCreatingWriteWSAction,
    removeCustomTicketWSAction,
    removeDivideTicketWSAction,
    hiddenTicketWSAction,
    openTicketWSAction
} from './actionsWS';
import { PAYMENTS } from '../../constans/payments';
import { TYPE_RECEPTIONS } from '../../constans/type-receptions';
import './style.scss';

moment.locale('ru');

const { TextArea } = Input;
const { Option } = Select;

class CreateWrite extends Component {
    state = {
        editingHidden: false
    }

    onSave = () => {
        const {
            dispatch,
            schedule,
            form,
            auth,
            ws
        } = this.props;
        const { creating } = schedule;
        const { user } = auth;

        if (!creating.ticket.isHidden) {
            form.validateFields((err, values) => {
                if (!err) {
                    setCreatingWriteWSAction('UNSET', creating.ticket, creating.doctor, user.user_id, ws);
                    createWriteWSAction(values, creating, ws);
                    dispatch(switchModalAction('createWrite'));
                    history.push(SCHEDULE_ROUTE);
                    form.resetFields();
                } else {
                    console.log('error field');
                }
            });
        } else {
            form.validateFields((err, values) => {
                const comment = values.patient_comment !== undefined ? values.patient_comment : '';

                this.setState({ editingHidden: false });
                hiddenTicketWSAction(creating.ticket, +creating.doctor.id, comment, ws);
                setCreatingWriteWSAction('UNSET', creating.ticket, creating.doctor, user.user_id, ws);
                dispatch(switchModalAction('createWrite'));
                history.push(SCHEDULE_ROUTE);
                form.resetFields();
            });
        }
    }

    onDivide = () => {
        const { dispatch } = this.props;
        dispatch(switchModalAction('divideTicket'));
    }

    onRetime = () => {
        const { dispatch } = this.props;
        dispatch(switchModalAction('retimeTicket'));
    }

    onHide = () => {
        const {
            schedule,
            form,
            dispatch,
            auth,
            ws
        } = this.props;
        const { editingHidden } = this.state;
        const { creating } = schedule;
        const { user } = auth;

        form.resetFields();

        if (+creating.ticket.isHidden) {
            this.setState({ editingHidden: false });
            dispatch(switchHideTicketAction(creating.doctor.id, { ...creating.ticket, isHidden: false }));
        } else {
            this.setState({ editingHidden: true });
            dispatch(switchHideTicketAction(creating.doctor.id, { ...creating.ticket, isHidden: true }));
        }

        if (+creating.ticket.isHidden && !editingHidden) {
            this.setState({ editingHidden: false });
            dispatch(switchModalAction('createWrite'));
            openTicketWSAction(creating.ticket, +creating.doctor.id, '', ws);
            setCreatingWriteWSAction('UNSET', creating.ticket, creating.doctor, user.user_id, ws);
            history.push(SCHEDULE_ROUTE);
        }
    }

    onRemove = () => {
        const {
            dispatch,
            form,
            schedule,
            auth,
            ws
        } = this.props;
        const { creating } = schedule;
        const { user } = auth;

        if (creating.ticket.isPart) {
            removeDivideTicketWSAction(creating.ticket, creating.doctor.id, ws);
        } else {
            removeCustomTicketWSAction(creating.ticket.id, creating.doctor.id, creating.ticket.dateTicket, ws);
        }

        dispatch(switchModalAction('createWrite'));
        history.push(SCHEDULE_ROUTE);
        form.resetFields();
        setCreatingWriteWSAction('UNSET', creating.ticket, creating.doctor, user.user_id, ws);
        dispatch(setCreatingWriteAction('UNSET', creating.ticket, creating.doctor, user.user_id));
    }

    onClose = () => {
        const {
            dispatch,
            form,
            schedule,
            auth,
            ws
        } = this.props;
        const { creating } = schedule;
        const { user } = auth;

        this.setState({ editingHidden: false });
        dispatch(switchModalAction('createWrite'));
        dispatch(switchHideTicketAction(creating.doctor.id, { ...creating.ticket, isHidden: creating.ticket.isHidden }));
        history.push(SCHEDULE_ROUTE);
        form.resetFields();
        setCreatingWriteWSAction('UNSET', creating.ticket, creating.doctor, user.user_id, ws);
        dispatch(setCreatingWriteAction('UNSET', creating.ticket, creating.doctor, user.user_id));
    }

    isAvailibleRemove = () => {
        const { schedule } = this.props;
        const { creating } = schedule;
        if (creating && creating.ticket.originalTicket !== undefined) {
            const { ticket } = creating;
            const { originalTicket } = ticket;
            let actualPartTickets = schedule.data.filter(doctor => doctor.id === +creating.doctor.id)[0];
            actualPartTickets = actualPartTickets.tickets.filter(day => moment(+day.date).format('DD.MM.YYYY') === moment(+creating.ticket.dateTicket).format('DD.MM.YYYY'))[0].data;
            actualPartTickets = actualPartTickets.filter(t => +t.time[0] === +originalTicket.time[0] && +t.time[1] === +originalTicket.time[1])[0].parts;

            let idx = null;
            actualPartTickets.forEach((item, i) => {
                if (+ticket.id === +item.id) {
                    idx = i;
                }
            });

            if (
                idx === 0 && actualPartTickets.length > 1
                && actualPartTickets[idx + 1].data
                && actualPartTickets[idx + 1].data.status
            ) {
                return false;
            }
            if (
                idx > 0
                && actualPartTickets[idx - 1].data
                && actualPartTickets[idx - 1].data.status
            ) {
                return false;
            }
            return true;
        }

        return true;
    }

    onActionMenuClick = (e) => {
        switch (e.key) {
            case 'divide':
                this.onDivide();
                break;
            case 'retime':
                this.onRetime();
                break;
            case 'remove':
                this.onRemove();
                break;
            case 'hide':
                this.onHide();
                break;
            default:
                break;
        }
    }

    render() {
        const { schedule, form, auth } = this.props;
        const { editingHidden } = this.state;
        const { modals, creating } = schedule;
        const { getFieldDecorator } = form;
        const isAvailibleRemove = this.isAvailibleRemove();
        let timeType = [];
        let timeWrite = '';
        let typeTicket = '';
        let durationTicket = null;

        if (creating) {
            const { ticket } = creating;
            const { isHidden } = ticket;
            timeType = ticket.isRetime ? [ticket.reTime[0], ticket.reTime[1]] : [ticket.time[0], ticket.time[1]];
            timeWrite = `${moment(ticket.dateTicket).format('D MMMM YYYY')} ${moment(timeType[0]).format('HH:mm')}-${moment(timeType[1]).format('HH:mm')}`;
            typeTicket = ticket.type;
            durationTicket = (+ticket.time[1] - +ticket.time[0]) / 1000 / 60;

            const menu = () => (
                <Menu onClick={this.onActionMenuClick}>
                    {typeTicket === 'free' || (typeTicket === 'custom' && ticket.isRetime) ? (
                        <Menu.Item key="retime">
                            <Icon type="clock-circle" />
                            Изменить время
                        </Menu.Item>
                    ) : null}
                    {typeTicket === 'free' || +ticket.isPart ? (
                        <Menu.Item key="hide">
                            <Icon type="eye-invisible" />
                            Скрыть талон
                        </Menu.Item>
                    ) : null}
                    {durationTicket !== 5 && !ticket.isRetime && auth.permissions['tickets/create'] ? (
                        <Menu.Item key="divide">
                            <Icon type="arrows-alt" />
                            Разделить
                        </Menu.Item>
                    ) : null}
                    {typeTicket === 'custom' && isAvailibleRemove && !ticket.isRetime && auth.permissions['tickets/delete'] ? (
                        <Menu.Item key="remove">
                            <Icon type={ticket.isPart ? 'shrink' : 'delete'} />
                            {ticket.isPart ? 'Соединить' : 'Удалить'}
                        </Menu.Item>
                    ) : null}
                </Menu>
            );

            return (
                <Modal
                    title={`Создание записи на ${timeWrite}`}
                    centered
                    visible={modals.createWrite}
                    onCancel={() => this.onClose()}
                    footer={(
                        <>
                            {!+isHidden ? (
                                <Dropdown overlay={menu}>
                                    <Button>
                                        Действия
                                        <Icon type="ellipsis" />
                                    </Button>
                                </Dropdown>
                            ) : null}
                            {editingHidden || !+isHidden ? (
                                <Button key="save" icon="save" type="primary" onClick={() => this.onSave()} loading={schedule.loading}>
                                    Сохранить
                                </Button>
                            ) : (
                                <Button key="save" icon="eye" type="primary" onClick={() => this.onHide()} loading={schedule.loading}>
                                    Открыть талон
                                </Button>
                            )}
                        </>
                    )}
                >
                    <Form>
                        {!isHidden ? (
                            <>
                                <Form.Item label="Ф.И.О. пациента">
                                    {getFieldDecorator('patient_last_name', {
                                        rules: [{ required: true, message: 'Заполните это поле!' }]
                                    })(
                                        <Input placeholder="Фамилия" />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('patient_first_name', {
                                        rules: [{ required: true, message: 'Заполните это поле!' }]
                                    })(
                                        <Input placeholder="Имя" />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('patient_second_name', {
                                        rules: [{ required: true, message: 'Заполните это поле!' }]
                                    })(
                                        <Input placeholder="Отчество" />
                                    )}
                                </Form.Item>
                                <Form.Item label="Телефон пациента">
                                    {getFieldDecorator('patient_phone', {
                                        rules: [{ required: true, message: 'Заполните это поле!' }],
                                        initialValue: ''
                                    })(
                                        <InputMask mask="+7(999)999-99-99" maskChar="_" placeholder="+7(___)___-__-__" />
                                    )}
                                </Form.Item>
                                <Form.Item label="Дата рождения пациента">
                                    {getFieldDecorator('patient_birthday', {
                                        rules: [{ required: true, message: 'Заполните это поле!' }]
                                    })(
                                        <DatePicker placeholder="__.__.____" format="DD.MM.YYYY" showToday={false} />
                                    )}
                                </Form.Item>
                                <Form.Item label="Вариант оплаты">
                                    {getFieldDecorator('patient_type-payment', {
                                        rules: [{ required: true, message: 'Заполните это поле!' }]
                                    })(
                                        <Select placeholder="Выберите оплату">
                                            {PAYMENTS.map(item => <Option key={item.value} value={item.value}>{item.name}</Option>)}
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item label="Вариант приема">
                                    {getFieldDecorator('patient_type-reception', {
                                        rules: [{ required: true, message: 'Заполните это поле!' }]
                                    })(
                                        <Select placeholder="Выберите вариант приёма">
                                            {TYPE_RECEPTIONS.map(item => <Option key={item.value} value={item.value}>{item.name}</Option>)}
                                        </Select>
                                    )}
                                </Form.Item>
                            </>
                        ) : null}
                        <Form.Item label="Комментарий">
                            {getFieldDecorator('patient_comment', {
                                rules: [{ required: false }],
                                initialValue: isHidden ? ticket.comment : ''
                            })(
                                <TextArea placeholder={isHidden ? 'Причина скрытия талона' : 'Комментарий к записи'} autosize={{ minRows: 2, maxRows: 6 }} />
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            );
        }

        return null;
    }
}

CreateWrite.propTypes = {
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

export default wrapper(CreateWrite);
