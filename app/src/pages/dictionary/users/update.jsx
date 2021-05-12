import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Drawer,
    Form,
    Input,
    Select,
    Icon,
    Button
} from 'antd';

import { history } from '../../../store';
import { DICTIONARY_USERS_ROUTE } from '../../../constans/routes';
import { getFullNameWorker } from '../../../helpers';
import {
    switchDrawer,
    editUsersAction
} from './actions';

const { Option } = Select;

class UpdateUser extends Component {
    generatePassword = () => {
        const { form } = this.props;
        let pass = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const lenth = 10;

        for (let i = 0; i < lenth; i++) pass += possible.charAt(Math.floor(Math.random() * possible.length));

        form.setFieldsValue({ password: pass });
    }

    onSubmit = (e, id) => {
        e.preventDefault();
        const { form, dispatch, auth } = this.props;
        const { token } = auth;
        form.validateFields((err, values) => {
            if (!err) {
                dispatch(editUsersAction({ ...values, id }, token));
            }
        });
    }

    onClose = () => {
        const { dispatch } = this.props;
        dispatch(switchDrawer('hide_update'));
        setTimeout(() => { history.push(DICTIONARY_USERS_ROUTE); }, 300);
    }

    getUser = () => {
        const { users } = this.props;
        const id = this.getUserId();

        return users.data.filter(item => item.id === id)[0];
    }

    getUserId = () => {
        const { users } = this.props;
        const url = window.location.pathname.split('/');

        return users.editing ? +users.editing : +url[url.length - 1];
    }

    render() {
        const isMobile = window.matchMedia('(max-width: 991px)').matches;
        const {
            form,
            users,
            workers,
            roles
        } = this.props;
        const { getFieldDecorator, getFieldValue } = form;
        const { data: workersData } = workers;
        const { data: rolesData } = roles;

        const user = this.getUser();

        return (
            <Drawer
                title={`Изменить пользователя "${user.email}"`}
                width={isMobile ? '100%' : '50%'}
                onClose={this.onClose}
                visible={users.drawerUpdate}
            >
                <Form layout="vertical" onSubmit={e => this.onSubmit(e, user.id)}>
                    <Row gutter={15}>
                        <Col span={12}>
                            <Form.Item label="E-mail">
                                {getFieldDecorator('email', {
                                    rules: [{ required: true, message: 'Заполните это поле!' }],
                                    initialValue: user.email
                                })(
                                    <Input prefix={<Icon type="mail" />} placeholder="E-mail" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Пароль">
                                {getFieldDecorator('password', {
                                    rules: [{ required: false }]
                                })(
                                    <span className="password-input-generate">
                                        <Input prefix={<Icon type="lock" />} placeholder="Пароль" value={getFieldValue('password')} />
                                        <button type="button" onClick={() => this.generatePassword()}><Icon type="key" /></button>
                                    </span>,
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Роль">
                                {getFieldDecorator('role', {
                                    rules: [{ required: true, message: 'Заполните это поле!' }],
                                    initialValue: +user.role
                                })(
                                    <Select placeholder="Выберите роль">
                                        {rolesData ? rolesData.map(role => <Option key={`role-${role.id}`} value={+role.id}>{role.name}</Option>) : null}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Сотрудник">
                                {getFieldDecorator('worker', {
                                    rules: [{ required: true, message: 'Заполните это поле!' }],
                                    initialValue: +user.worker_id
                                })(
                                    <Select placeholder="Выберите сотрудника">
                                        {workersData ? workersData.map(worker => (
                                            <Option key={worker.id} value={+worker.id}>{getFullNameWorker(worker)}</Option>
                                        )) : null}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24} style={{ textAlign: 'center', margin: '0 0 30px 0' }}>
                            <Button htmlType="submit" type="primary" size="large" loading={users.loading}>
                                Сохранить
                                <Icon type="save" />
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        );
    }
}

UpdateUser.propTypes = {
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    users: PropTypes.object.isRequired,
    workers: PropTypes.object.isRequired,
    roles: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    users: state.users,
    workers: state.workers,
    roles: state.roles,
    auth: state.auth
});

const wrappedComponent = compose(
    connect(mapStateToProps),
    Form.create()
);

export default wrappedComponent(UpdateUser);
