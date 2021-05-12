import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Timeline,
    Divider,
    Form,
    DatePicker,
    Row,
    Col,
    Select,
    Empty
} from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { LOG_ROUTE } from '../../constans/routes';
import WrapperContent from '../../components/WrapperContent';
import Preloader from '../../components/Preloader';
import localePicker from '../../constans/ruLocalePicker';
import { getLogAction, changeFilterAction } from './actions';
import { getUsersAction } from '../dictionary/users/actions';
import { getFullNameWorker } from '../../helpers';
import './style.scss';

moment.locale('ru');

const { Option } = Select;
const { RangePicker } = DatePicker;

class LogPage extends Component {
    static pathPage = LOG_ROUTE;

    static namePage = 'Лог действий';

    componentDidMount() {
        const { dispatch, auth, log } = this.props;
        const { token } = auth;
        dispatch(getLogAction(log.filter, token));
        dispatch(getUsersAction({ withWorkers: 1 }, token));
    }

    wordAction = (action) => {
        switch (action) {
            case 'delete':
                return 'удалил';
            case 'create':
                return 'создал';
            case 'update':
                return 'обновил';
            default:
                return '';
        }
    }

    changeFilter = (field, value) => {
        const { dispatch, log, auth } = this.props;
        const { token } = auth;
        dispatch(changeFilterAction(field, value));

        const newParams = {
            ...log.filter,
            [field]: value
        };

        dispatch(getLogAction(newParams, token));
    }

    render() {
        const { log, users, form } = this.props;
        const { data: dataLog, loading: loadingLog, filter } = log;
        const { data: dataUsers, loading: loadingUsers } = users;
        const { getFieldDecorator } = form;

        if (loadingLog || dataLog === null || loadingUsers || dataUsers === null) {
            return (
                <div className="log page">
                    <Preloader />
                </div>
            );
        }

        return (
            <section className="log page">
                <Divider>Фильтр</Divider>
                <Form className="log__filter">
                    <Row gutter={15}>
                        <Col md={12}>
                            <Form.Item label="Период">
                                {getFieldDecorator('log__filter_date', {
                                    rules: [{ required: false }],
                                    initialValue: filter.date
                                })(
                                    <RangePicker
                                        placeholder={['Начало', 'Конец']}
                                        showTime={{ format: 'HH:mm' }}
                                        format="DD.MM.YYYY HH:mm"
                                        onOk={date => this.changeFilter('date', date)}
                                        allowClear={false}
                                        locale={localePicker}
                                        style={{ width: '100%' }}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col md={12}>
                            <Form.Item label="Сотрудник">
                                {getFieldDecorator('log__filter_user', {
                                    rules: [{ required: false }],
                                    initialValue: filter.user
                                })(
                                    <Select placeholder="Выберите сотрудника" allowClear onChange={value => this.changeFilter('user', value)}>
                                        <Option value={0}>Все сотрудники</Option>
                                        {dataUsers.map(user => <Option key={user.id} value={user.id}>{getFullNameWorker(user.worker[0])}</Option>)}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Divider>Лог действий</Divider>
                <br />
                {dataLog.length ? (
                    <Timeline>
                        {dataLog.map((item, i) => (
                            <Timeline.Item key={`${item.date}-${i}`} className={`log_item ${item.action}`}>
                                <b>{`${moment(item.date).format('DD.MM.YY HH:mm:ss')}`}</b>
                                &nbsp;
                                пользователь
                                &nbsp;
                                <b>{`${item.worker.fio}`}</b>
                                &nbsp;
                                {`${this.wordAction(item.action)}`}
                                &nbsp;
                                <b>{`${item.resource_name}`}</b>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                ) : <Empty description="Нет данных за выбранный период" image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </section>
        );
    }
}

LogPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    log: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    log: state.log,
    auth: state.auth,
    users: state.users,
    ws: state.ws
});

const wrapper = compose(
    connect(mapStateToProps),
    Form.create(),
    WrapperContent
);

export default wrapper(LogPage);
