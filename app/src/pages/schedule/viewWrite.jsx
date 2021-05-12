import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Typography,
    Button,
    Modal
} from 'antd';
import moment from 'moment';

import { switchModalAction, setViewingWriteAction } from './actions';
import { getFullNameWorker } from '../../helpers';
import { SCHEDULE_ROUTE } from '../../constans/routes';
import { STATUSES } from '../../constans/statuses-writes';
import { PAYMENTS } from '../../constans/payments';
import { history } from '../../store';
import './style.scss';

moment.locale('ru');

const { Text } = Typography;

class ViewWrite extends Component {
    onClose = () => {
        const { dispatch } = this.props;
        dispatch(switchModalAction('viewWrite'));
        dispatch(setViewingWriteAction('UNSET'));
        history.push(SCHEDULE_ROUTE);
    }

    render() {
        const { schedule, auth } = this.props;
        const { modals, viewing } = schedule;
        const timeWrite = viewing ? `${moment(viewing.ticket.data.date_write).format('D MMMM YYYY')} ${moment(viewing.ticket.time[0]).format('HH:mm')}-${moment(viewing.ticket.time[1]).format('HH:mm')}` : '';
        const doctorFIO = viewing ? getFullNameWorker(viewing.doctor) : '';
        const patientFIO = viewing ? `${viewing.ticket.data.patient_last_name} ${viewing.ticket.data.patient_first_name} ${viewing.ticket.data.patient_second_name}` : '';
        const status = viewing ? STATUSES[viewing.ticket.data.status].name : '';
        const payment = viewing ? PAYMENTS.filter(item => +item.value === +viewing.ticket.data.patient_type_payment)[0].name : '';
        const filial = viewing ? viewing.doctor.filial.name : '';
        const createdWrite = viewing ? moment(viewing.ticket.data.created_at).format('D MMMM HH:mm') : '';
        const dateWrite = viewing ? `${moment(viewing.ticket.data.date_write).format('D MMMM')} ${moment(+viewing.ticket.data.time_start).format('HH:mm')}-${moment(+viewing.ticket.data.time_end).format('HH:mm')}` : '';

        return (
                <Modal
                    title={`Просмотр записи ${timeWrite}`}
                    centered
                    visible={modals.viewWrite}
                    onOk={() => this.onClose()}
                    onCancel={() => this.onClose()}
                    footer={[
                        <Button key="close" onClick={() => this.onClose()}>
                            Закрыть
                        </Button>
                    ]}
                >
                    <div style={{ margin: '20px 0 0 0' }}>
                        <Text strong>Статус:&nbsp;</Text>
                        <Text>{status}</Text>
                    </div>
                    <div>
                        <Text strong>Администратор:&nbsp;</Text>
                        <Text>-</Text>
                    </div>
                    <div>
                        <Text strong>Ф.И.О. пациента:&nbsp;</Text>
                        <Text>{patientFIO}</Text>
                    </div>
                    {auth.permissions['writes/fields/phone'] ? (
                        <div>
                            <Text strong>Телефон:&nbsp;</Text>
                            <Text>{viewing ? viewing.ticket.data.patient_phone : ''}</Text>
                        </div>
                    ) : null}
                    <div>
                        <Text strong>Дата рождения:&nbsp;</Text>
                        <Text>{viewing ? moment(+viewing.ticket.data.patient_birthday).format('DD.MM.YYYY') : ''}</Text>
                    </div>
                    <div>
                        <Text strong>Способ оплаты:&nbsp;</Text>
                        <Text>{payment}</Text>
                    </div>
                    <div>
                        <Text strong>Филиал:&nbsp;</Text>
                        <Text>{filial}</Text>
                    </div>
                    <div>
                        <Text strong>Врач:&nbsp;</Text>
                        <Text>{doctorFIO}</Text>
                    </div>
                    <div>
                        <Text strong>Дата и время приёма:&nbsp;</Text>
                        <Text>{dateWrite}</Text>
                    </div>
                    <div>
                        <Text strong>Комментарий:&nbsp;</Text>
                        <Text>{viewing ? viewing.ticket.data.patient_comment : ''}</Text>
                    </div>
                    <div>
                        <Text strong>Дата и время создания записи:&nbsp;</Text>
                        <Text>{createdWrite}</Text>
                    </div>
                </Modal>
        );
    }
}

ViewWrite.propTypes = {
    dispatch: PropTypes.func.isRequired,
    schedule: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    schedule: state.schedule,
    auth: state.auth
});

const wrapper = compose(
    connect(mapStateToProps)
);

export default wrapper(ViewWrite);
