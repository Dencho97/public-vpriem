import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Typography,
    Icon,
    Tooltip
} from 'antd';
import moment from 'moment';

import {
    switchModalAction,
    setCreatingWriteAction,
    setEditingWriteAction,
    setViewingWriteAction
} from './actions';
import {
    setCreatingWriteWSAction,
    setEditingWriteWSAction,
    removeWriteWSAction,
    removeWriteNotificationWSAction
} from './actionsWS';
import { SCHEDULE_ROUTE } from '../../constans/routes';
import { history } from '../../store';
import { PAYMENTS } from '../../constans/payments';
import { TYPE_RECEPTIONS } from '../../constans/type-receptions';
import { STATUSES } from '../../constans/statuses-writes';

moment.locale('ru');

const types = {
    free: 'free',
    busy: 'busy',
    notAvailable: 'not-available',
    custom: 'custom',
    hidden: 'hidden',
    first: 'first'
};
const status = {
    [STATUSES.confirmed.value]: (
        <Tooltip placement="bottom" title="Подтверждённый талон">
            <Icon type="check-circle" className="schedule__tickets__item_status" />
        </Tooltip>
    ),
    [STATUSES.notConfirmed.value]: (
        <Tooltip placement="bottom" title="Неподтверждённый талон">
            <Icon type="stop" className="schedule__tickets__item_status" />
        </Tooltip>
    ),
    editing: (
        <Tooltip placement="bottom" title="Талон редактируется">
            <div className="schedule__tickets__item_status editing">
                <span>.</span>
                <span>.</span>
                <span>.</span>
            </div>
        </Tooltip>
    ),
    client: (
        <Tooltip placement="bottom" title="Талон редактирует клиент">
            <div className="schedule__tickets__item_status editing">
                <span>.</span>
                <span>.</span>
                <span>.</span>
            </div>
        </Tooltip>
    )
};

const { Text } = Typography;

const ActionsTicket = ({
                           onView, onUpdate, onRemove, permissions, isLastDays, isSuperadmin, ...props
                       }) => {
    if (!isSuperadmin && !isLastDays) {
        return (
            <div className="schedule__tickets__item__actions">
                <button
                    type="button"
                    className="schedule__tickets__item__actions_action"
                    onClick={() => onView()}
                >
                    <Tooltip placement="bottom" title="Просмотр">
                        <Icon type="eye" />
                    </Tooltip>
                </button>
                {permissions['writes/update'] ? (
                    <button
                        type="button"
                        className="schedule__tickets__item__actions_action"
                        onClick={() => onUpdate()}
                    >
                        <Tooltip placement="bottom" title="Редактировать">
                            <Icon type="edit" />
                        </Tooltip>
                    </button>
                ) : null}
                {permissions['writes/delete'] ? (
                    <button
                        type="button"
                        className="schedule__tickets__item__actions_action"
                        onClick={() => onRemove()}
                    >
                        <Tooltip placement="bottom" title="Удалить">
                            <Icon type="delete" />
                        </Tooltip>
                    </button>
                ) : null}
            </div>
        );
    }
    if (isSuperadmin) {
        return (
            <div className="schedule__tickets__item__actions">
                <button
                    type="button"
                    className="schedule__tickets__item__actions_action"
                    onClick={() => onView()}
                >
                    <Tooltip placement="bottom" title="Просмотр">
                        <Icon type="eye" />
                    </Tooltip>
                </button>
                <button
                    type="button"
                    className="schedule__tickets__item__actions_action"
                    onClick={() => onUpdate()}
                >
                    <Tooltip placement="bottom" title="Редактировать">
                        <Icon type="edit" />
                    </Tooltip>
                </button>
                <button
                    type="button"
                    className="schedule__tickets__item__actions_action"
                    onClick={() => onRemove()}
                >
                    <Tooltip placement="bottom" title="Удалить">
                        <Icon type="delete" />
                    </Tooltip>
                </button>
            </div>
        );
    }

    return (
        <div className="schedule__tickets__item__actions">
            <button
                type="button"
                className="schedule__tickets__item__actions_action"
                onClick={() => onView()}
            >
                <Tooltip placement="bottom" title="Просмотр">
                    <Icon type="eye" />
                </Tooltip>
            </button>
        </div>
    );
};

class TicketItem extends Component {
    openModal = (type) => {
        const {
            dispatch,
            doctor,
            originalTicket,
            ticket,
            auth,
            ws,
            notifications
        } = this.props;
        const { user } = auth;

        switch (type) {
            case 'createWrite':
                dispatch(setCreatingWriteAction('SET', originalTicket ? {
                    ...ticket,
                    originalTicket
                } : ticket, doctor, user));
                setCreatingWriteWSAction('SET', originalTicket ? {
                    ...ticket,
                    originalTicket
                } : ticket, doctor, user, ws);
                history.push(`${SCHEDULE_ROUTE}/${doctor.id}/${type}`);
                dispatch(switchModalAction(type));
                break;
            case 'viewWrite':
                dispatch(setViewingWriteAction('SET', doctor, ticket, user));
                history.push(`${SCHEDULE_ROUTE}/${ticket.data.id}/${type}`);
                dispatch(switchModalAction(type));
                break;
            case 'updateWrite': {
                const hasInNotifications = notifications.data.filter(item => +item.ticket.data.id === +ticket.data.id).length;
                if (hasInNotifications) removeWriteNotificationWSAction('byWriteID', ticket.data.id, ws);

                dispatch(setEditingWriteAction('SET', ticket, doctor, user));
                setEditingWriteWSAction('SET', ticket, doctor, user, ws);
                history.push(`${SCHEDULE_ROUTE}/${ticket.data.id}/${type}`);
                dispatch(switchModalAction(type));
                break;
            }
            default:
                break;
        }
    };

    onRemove = (writeID, doctorID, isPart, date) => {
        const { ws, notifications } = this.props;
        const hasInNotifications = notifications.data.filter(item => +item.ticket.data.id === +writeID).length;
        if (hasInNotifications) removeWriteNotificationWSAction('byWriteID', writeID, ws);

        removeWriteWSAction(writeID, doctorID, isPart, date, ws);
    };

    render() {
        const {
            ticket,
            doctor,
            auth,
            isSuperadmin,
            isLastDays
        } = this.props;
        const time = [
            moment(ticket.time[0]).format('HH:mm'),
            moment(ticket.time[1]).format('HH:mm')
        ];
        const reTime = ticket.isRetime ? [moment(ticket.reTime[0]).format('HH:mm'), moment(ticket.reTime[1]).format('HH:mm')] : null;
        const { data } = ticket;
        const FIO = data ? `${data.patient_last_name} ${data.patient_first_name} ${data.patient_second_name}` : '';
        const typePayment = data ? PAYMENTS.filter(payment => +payment.value === +data.patient_type_payment)[0] : null;
        const ticketAvailable = data && data.status === 'editing' ? 'type-not-available' : '';
        const ticketDisabled = !auth.permissions['writes/create'] ? 'disabled' : '';
        const ticketHidden = +ticket.isHidden ? 'type-hidden' : '';
        const phone = data ? data.patient_phone : '';
        const isClientWrite = data && +data.recorded_from_site ? 'type-client' : '';

        switch (ticket.type) {
            case types.busy: {
                return (
                    <div
                        className={`schedule__tickets__item type-busy ${ticketAvailable} ${isClientWrite} ${ticketDisabled}`}
                    >
                        <Text className="schedule__tickets__item_time" strong>{`${time[0]}-${time[1]}`}</Text>
                        <br />
                        <Text className="schedule__tickets__item_patient">{FIO}</Text>
                        {auth.permissions['writes/fields/phone'] ? (
                            <>
                                <br />
                                <Text className="schedule__tickets__item_phone" strong>{phone}</Text>
                            </>
                        ) : null}
                        <br />
                        <Text
                            className="schedule__tickets__item_type-payment"
                        >
                            {typePayment ? typePayment.name : ''}
                        </Text>
                        {data && data.status ? status[data.status] : null}
                        {data.status && data.status === 'editing' ? null : (
                            <ActionsTicket
                                onView={() => this.openModal('viewWrite')}
                                onUpdate={() => this.openModal('updateWrite')}
                                onRemove={() => this.onRemove(data.id, doctor.id, ticket.isPart, ticket.dateTicket)}
                                permissions={auth.permissions}
                                isSuperadmin={isSuperadmin}
                                isLastDays={isLastDays}
                            />
                        )}
                    </div>
                );
            }
            case types.free: {
                return (
                    <button
                        type="button"
                        className={`schedule__tickets__item type-free ${ticketAvailable} ${ticketDisabled} ${ticketHidden}`}
                        onClick={ticketAvailable === '' && auth.permissions['writes/create'] ? () => this.openModal('createWrite') : () => null}
                        disabled={!auth.permissions['writes/create'] || (!isSuperadmin && isLastDays)}
                    >
                        <Text className="schedule__tickets__item_time" strong>{`${time[0]}-${time[1]}`}</Text>
                        {data && data.status ? status[data.status] : null}
                    </button>
                );
            }
            case types.custom: {
                if (data && ticket.isBusy) {
                    return (
                        <div
                            className={`schedule__tickets__item type-custom ${ticket.isBusy ? 'type-busy' : ''} ${+ticket.isPart ? 'part' : ''} fill ${ticketAvailable} ${isClientWrite} ${ticketDisabled}`}
                        >
                            <Text className="schedule__tickets__item_time" strong>
                                {reTime ? `${reTime[0]}-${reTime[1]}` : `${time[0]}-${time[1]}`}
                            </Text>
                            <br />
                            <Text className="schedule__tickets__item_patient">{FIO}</Text>
                            {auth.permissions['writes/fields/phone'] ? (
                                <>
                                    <br />
                                    <Text className="schedule__tickets__item_phone" strong>{phone}</Text>
                                </>
                            ) : null}
                            <br />
                            <Text className="schedule__tickets__item_type-payment">
                                {typePayment ? typePayment.name : ''}
                            </Text>
                            {data && data.status ? status[data.status] : null}
                            {data.status && data.status === 'editing' ? null : (
                                <ActionsTicket
                                    onView={() => this.openModal('viewWrite')}
                                    onUpdate={() => this.openModal('updateWrite')}
                                    onRemove={() => this.onRemove(data.id, doctor.id, ticket.isPart)}
                                    permissions={auth.permissions}
                                    isSuperadmin={isSuperadmin}
                                    isLastDays={isLastDays}
                                />
                            )}
                        </div>
                    );
                }
                return (
                    <button
                        type="button"
                        className={`schedule__tickets__item type-custom ${+ticket.isPart ? 'part' : ''} ${ticketAvailable} ${ticketDisabled} ${ticketHidden}`}
                        onClick={ticketAvailable === '' && auth.permissions['writes/create'] ? () => this.openModal('createWrite') : () => null}
                        disabled={!auth.permissions['writes/create']}
                    >
                        <Text className="schedule__tickets__item_time" strong>
                            {reTime ? `${reTime[0]}-${reTime[1]}` : `${time[0]}-${time[1]}`}
                        </Text>
                        {data && data.status ? status[data.status] : null}
                    </button>
                );
            }
            default:
                return null;
        }
    }
}

ActionsTicket.propTypes = {
    onView: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    permissions: PropTypes.object.isRequired,
    isSuperadmin: PropTypes.bool.isRequired,
    isLastDays: PropTypes.bool.isRequired
};

TicketItem.defaultProps = {
    originalTicket: null
};

TicketItem.propTypes = {
    dispatch: PropTypes.func.isRequired,
    ticket: PropTypes.object.isRequired,
    originalTicket: PropTypes.object,
    doctor: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    ws: PropTypes.object.isRequired,
    notifications: PropTypes.object.isRequired,
    isSuperadmin: PropTypes.bool.isRequired,
    isLastDays: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    ws: state.ws,
    auth: state.auth,
    notifications: state.notifications
});

export default connect(mapStateToProps)(TicketItem);
