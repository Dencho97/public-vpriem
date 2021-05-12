import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import {
    Table,
    Icon,
    Button,
    Divider,
    Form,
    Input,
    Select,
    Checkbox,
    Row,
    Col
} from 'antd';

import { DICTIONARY_USERS_ROUTE, DICTIONARY_ROLES_ROUTE } from '../../../constans/routes';
import { history } from '../../../store';
import Preloader from '../../../components/Preloader';
import WrapperContent from '../../../components/WrapperContent';
import delayUnmounting from '../../../components/delayUnmounting';
import UpdateUser from './update';
import { getWorkersAction } from '../workers/actions';
import { getRolesAction } from '../roles/actions';
import { getFullNameWorker } from '../../../helpers';
import {
    switchDrawer,
    getUsersAction,
    createUsersAction,
    removeUsersAction
} from './actions';
import './style.scss';

const { Option } = Select;

const DelayUnmountingUpdateUser = delayUnmounting(UpdateUser);

class UsersPage extends Component {
    static pathPage = DICTIONARY_USERS_ROUTE;

    static namePage = 'Пользователи';

    state = {
        createWorker: false
    }

    componentDidMount() {
        const { pathname } = window.location;
        const { dispatch, auth } = this.props;
        const { token } = auth;

        dispatch(getWorkersAction('', token));
        dispatch(getUsersAction({ withWorkers: 0 }, token));
        dispatch(getRolesAction(token));

        if (pathname.search('update') !== -1) {
            dispatch(switchDrawer('show_update'));
        }
    }

    generatePassword = () => {
        const { form } = this.props;
        let pass = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const lenth = 10;

        for (let i = 0; i < lenth; i++) pass += possible.charAt(Math.floor(Math.random() * possible.length));

        form.setFieldsValue({ password: pass });
    }

    onRemove = (id) => {
        const { dispatch, auth } = this.props;
        const { token } = auth;
        dispatch(removeUsersAction(id, token));
    }

    onEdit = (id) => {
        const { dispatch } = this.props;
        history.push(`${DICTIONARY_USERS_ROUTE}/update/${id}`);
        dispatch(switchDrawer('show_update', id));
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { form, dispatch, auth } = this.props;
        const { createWorker } = this.state;
        form.validateFields((err, values) => {
            if (!err) {
                const { token } = auth;
                dispatch(createUsersAction({ ...values, createWorker }, token));
                form.resetFields();
                this.setState({ createWorker: false });
            } else {
                console.log('error field');
            }
        });
    }

    render() {
        const {
            form,
            workers,
            users,
            roles,
            auth
        } = this.props;
        const { createWorker } = this.state;
        const { getFieldDecorator, getFieldValue } = form;
        const { loadingData: loadingWorkers, data: workersData } = workers;
        const { loading: loadingUsers, data: usersData } = users;
        const { loading: loadingRoles, data: rolesData } = roles;
        const { user } = auth;

        if (
            workersData === null || loadingWorkers
            || usersData === null || loadingUsers
            || rolesData === null || loadingRoles
        ) {
            return (
                <div className="users page">
                    <Preloader />
                </div>
            );
        }

        const columns = [
            {
                title: 'E-mail',
                dataIndex: 'email',
                key: 'email'
            },
            {
                title: 'Роль',
                dataIndex: 'role',
                key: 'role',
                render: roleID => rolesData.filter(role => +role.id === +roleID)[0].name
            },
            {
                title: 'Сотрудник',
                dataIndex: 'worker_id',
                key: 'worker',
                render: workerID => getFullNameWorker(workersData.filter(worker => +worker.id === +workerID)[0])
            },
            {
              title: 'Действия',
              key: 'actions',
              render: (item, record) => (
                <>
                    <Button onClick={() => this.onEdit(record.id)}><Icon type="edit" /></Button>
                    {+user.user_id !== +record.id ? <Button type="danger" onClick={() => this.onRemove(record.id)}><Icon type="delete" /></Button> : null}
                </>
              ),
            },
        ];

        return (
            <section className="users page">
                <Divider>Добавить пользователя</Divider>
                <Form layout="vertical" onSubmit={this.onSubmit}>
                    <Row gutter={15}>
                        <Col span={24} md={12}>
                            <Form.Item label="E-mail">
                                {getFieldDecorator('email', {
                                    rules: [{ required: true, message: 'Заполните это поле!' }]
                                })(
                                    <Input prefix={<Icon type="mail" />} placeholder="E-mail" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Form.Item label="Пароль">
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: 'Введите пароль!' }]
                                })(
                                    <span className="password-input-generate">
                                        <Input prefix={<Icon type="lock" />} placeholder="Пароль" value={getFieldValue('password')} />
                                        <button type="button" onClick={() => this.generatePassword()}><Icon type="key" /></button>
                                    </span>,
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Form.Item label="Роль">
                                {getFieldDecorator('role', {
                                    rules: [{ required: true, message: 'Заполните это поле!' }]
                                })(
                                    <Select placeholder="Выберите роль">
                                        {rolesData ? rolesData.map(role => <Option key={`role-${role.id}`} value={role.id}>{role.name}</Option>) : null}
                                    </Select>
                                )}
                                <Link to={DICTIONARY_ROLES_ROUTE}>Создать роль</Link>
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Row gutter={15}>
                                <Col span={24}>
                                    <Form.Item label="Сотрудник">
                                        {getFieldDecorator('worker', {
                                            rules: [{ required: !createWorker, message: 'Заполните это поле!' }]
                                        })(
                                            <Select placeholder="Выберите сотрудника" disabled={createWorker}>
                                                {workersData ? workersData.map(worker => (
                                                    <Option key={worker.id} value={+worker.id}>{getFullNameWorker(worker)}</Option>
                                                )) : null}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={15}>
                                <Col span={24}>
                                    <Form.Item className="users_checkebox-create-worker">
                                        <Checkbox onChange={e => this.setState({ createWorker: e.target.checked })}>Создать сотрудника</Checkbox>
                                    </Form.Item>
                                </Col>
                            </Row>
                            {createWorker ? (
                                <Row gutter={15}>
                                    <Col lg={8}>
                                        <Form.Item>
                                            {getFieldDecorator('worker_new_last', {
                                                rules: [{ required: true, message: 'Заполните это поле!' }]
                                            })(
                                                <Input placeholder="Фамилия" />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col lg={8}>
                                        <Form.Item>
                                            {getFieldDecorator('worker_new_first', {
                                                rules: [{ required: true, message: 'Заполните это поле!' }]
                                            })(
                                                <Input placeholder="Имя" />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col lg={8}>
                                        <Form.Item>
                                            {getFieldDecorator('worker_new_second', {
                                                rules: [{ required: true, message: 'Заполните это поле!' }]
                                            })(
                                                <Input placeholder="Отчество" />
                                            )}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            ) : null}
                        </Col>
                        <Col span={24} style={{ textAlign: 'center', margin: '30px 0' }}>
                            <Button htmlType="submit" type="primary" size="large" loading={loadingUsers}>
                                Добавить
                                <Icon type="plus" />
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <Divider>Список пользователей</Divider>
                <Table
                    columns={columns}
                    dataSource={usersData}
                    rowKey={record => record.id}
                    size="middle"
                    pagination={false}
                    locale={{ emptyText: 'Нет данных' }}
                />
                <DelayUnmountingUpdateUser delayTime={300} isMounted={users.drawerUpdate} />
            </section>
        );
    }
}

UsersPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    workers: PropTypes.object.isRequired,
    roles: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    users: state.users,
    workers: state.workers,
    auth: state.auth,
    roles: state.roles,
    ws: state.ws
});

const wrapper = compose(
    connect(mapStateToProps),
    Form.create(),
    WrapperContent
);

export default wrapper(UsersPage);
