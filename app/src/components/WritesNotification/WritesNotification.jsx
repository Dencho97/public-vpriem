/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Icon,
    Badge,
    Popover,
    Comment,
    Divider
} from 'antd';
import moment from 'moment';

import { SCHEDULE_ROUTE } from '../../constans/routes';
import { history } from '../../store';
import {
    switchModalAction,
    setEditingWriteAction,
} from '../../pages/schedule/actions';
import {
    setEditingWriteWSAction,
    removeWriteNotificationWSAction
} from '../../pages/schedule/actionsWS';
import { getFullNameWorker } from '../../helpers';
import { getNotificationsAction } from './actions';
import './style.scss';

moment.locale('ru');

class WritesNotification extends React.Component {
    state = {
        popoverVisible: false
    }

    componentDidMount() {
        const { dispatch, auth } = this.props;
        const { token } = auth;
        dispatch(getNotificationsAction(token));
    }

    openNotification = (id) => {
        const {
            dispatch,
            auth,
            notifications,
            ws
        } = this.props;
        const { popoverVisible } = this.state;
        const { user } = auth;
        const notification = notifications.data.filter(item => +item.id === +id)[0];
        this.setState({ popoverVisible: !popoverVisible });

        dispatch(setEditingWriteAction('SET', notification.ticket, notification.doctor, user.user_id));
        setEditingWriteWSAction('SET', notification.ticket, notification.doctor, user.user_id, ws);
        removeWriteNotificationWSAction('byNotificationID', notification.id, ws);
        history.push(`${SCHEDULE_ROUTE}/${notification.ticket.data.id}/updateWrite`);
        dispatch(switchModalAction('updateWrite'));
    }

    render() {
        const { notifications } = this.props;
        const { popoverVisible } = this.state;

        const content = notifications.data && notifications.data.length ? notifications.data.map((item, i) => (
            <div key={item.id}>
                <Comment
                    author={<span>Новая запись</span>}
                    content={(
                        <button type="button" onClick={() => this.openNotification(item.id)} className="writes-notifications_text">
                            Запись к врачу&nbsp;
                            <strong>{item.doctor ? getFullNameWorker(item.doctor) : 'Неизвестный врач'}</strong>&nbsp;на&nbsp;
                            <strong>{moment(item.ticket.dateTicket).format('DD.MM.YYYY')}</strong>&nbsp;в&nbsp;
                            <strong>{moment(item.ticket.time[0]).format('HH:mm')}</strong>
                        </button>
                    )}
                    datetime={moment(item.created_at).fromNow()}
                />
                {notifications.data.length - 1 !== i ? <Divider /> : null}
            </div>
        )) : '~ Нет новых записей ~';

        return (
            <div className="writes-notifications">
                <Popover
                    placement="bottomRight"
                    title={<span><Icon type="bell" /> Новые записи</span>}
                    content={content}
                    trigger="click"
                    overlayClassName="writes-notifications_popover"
                    visible={popoverVisible}
                >
                    <button type="button" onClick={() => this.setState({ popoverVisible: !popoverVisible })} className="writes-notifications_btn">
                        <Badge count={notifications.data ? notifications.data.length : 0} dot>
                            <Icon type="bell" />
                        </Badge>
                    </button>
                </Popover>
            </div>
        );
    }
}

WritesNotification.propTypes = {
    auth: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    notifications: PropTypes.object.isRequired,
    ws: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    notifications: state.notifications,
    ws: state.ws
});

export default connect(mapStateToProps)(WritesNotification);
