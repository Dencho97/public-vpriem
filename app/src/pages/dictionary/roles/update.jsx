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
    Icon,
    Button,
    Switch,
    Typography
} from 'antd';

import { history } from '../../../store';
import { DICTIONARY_ROLES_ROUTE } from '../../../constans/routes';
import {
    switchDrawer,
    editRolesAction
} from './actions';

const { Title } = Typography;

class UpdateRole extends Component {
    onSubmit = (e, id) => {
        e.preventDefault();
        const { form, dispatch, auth } = this.props;
        const { token } = auth;
        form.validateFields((err, values) => {
            if (!err) {
                dispatch(editRolesAction({ ...values, id }, token));
            }
        });
    }

    onClose = () => {
        const { dispatch } = this.props;
        dispatch(switchDrawer('hide_update'));
        setTimeout(() => { history.push(DICTIONARY_ROLES_ROUTE); }, 300);
    }

    getRole = () => {
        const { roles } = this.props;
        const id = this.getRoleId();

        return roles.data.filter(item => item.id === id)[0];
    }

    getRoleId = () => {
        const { roles } = this.props;
        const url = window.location.pathname.split('/');

        return roles.editing ? +roles.editing : +url[url.length - 1];
    }

    render() {
        const isMobile = window.matchMedia('(max-width: 991px)').matches;
        const {
            form,
            roles
        } = this.props;
        const { getFieldDecorator } = form;

        const role = this.getRole();
        const { permissions } = role;

        return (
            <Drawer
                title={`Изменить роль "${role.name}"`}
                width={isMobile ? '100%' : '50%'}
                onClose={this.onClose}
                visible={roles.drawerUpdate}
            >
                <Form layout="vertical" className="roles__form" onSubmit={e => this.onSubmit(e, role.id)}>
                    <Row gutter={15}>
                        <Col span={24}>
                            <Form.Item label="Название услуги">
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: 'Заполните это поле!' }],
                                    initialValue: role ? role.name : ''
                                })(
                                    <Input placeholder="Название услуги" />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={15} className="roles__form_permissions-fileds">
                        <Col lg={12} className="roles__form_category">
                            <Title level={4}>Талоны</Title>
                            <Form.Item label="Создание/разделение:">
                                {getFieldDecorator('tickets/create', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }],
                                    initialValue: role && permissions['tickets/create']
                                })(
                                    <Switch defaultChecked={role && permissions['tickets/create']} />
                                )}
                            </Form.Item>
                            <Form.Item label="Удаление:">
                                {getFieldDecorator('tickets/delete', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }],
                                    initialValue: role && permissions['tickets/delete']
                                })(
                                    <Switch defaultChecked={role && permissions['tickets/delete']} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col lg={12} className="roles__form_category">
                            <Title level={4}>Записи</Title>
                            <Form.Item label="Создание:">
                                {getFieldDecorator('writes/create', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }],
                                    initialValue: role && permissions['writes/create']
                                })(
                                    <Switch defaultChecked={role && permissions['writes/create']} />
                                )}
                            </Form.Item>
                            <Form.Item label="Редактирование:">
                                {getFieldDecorator('writes/update', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }],
                                    initialValue: role && permissions['writes/update']
                                })(
                                    <Switch defaultChecked={role && permissions['writes/update']} />
                                )}
                            </Form.Item>
                            <Form.Item label="Удаление:">
                                {getFieldDecorator('writes/delete', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }],
                                    initialValue: role && permissions['writes/delete']
                                })(
                                    <Switch defaultChecked={role && permissions['writes/delete']} />
                                )}
                            </Form.Item>
                            <Form.Item label="Показывать номер телефона:">
                                {getFieldDecorator('writes/fields/phone', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }],
                                    initialValue: role && permissions['writes/fields/phone']
                                })(
                                    <Switch defaultChecked={role && permissions['writes/fields/phone']} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col lg={12} className="roles__form_category">
                            <Title level={4}>Справочники</Title>
                            <Form.Item label="Пользователи:">
                                {getFieldDecorator('dictionary/users', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }],
                                    initialValue: role && permissions['dictionary/users']
                                })(
                                    <Switch defaultChecked={role && permissions['dictionary/users']} />
                                )}
                            </Form.Item>
                            <Form.Item label="Филиалы:">
                                {getFieldDecorator('dictionary/filials', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }],
                                    initialValue: role && permissions['dictionary/filials']
                                })(
                                    <Switch defaultChecked={role && permissions['dictionary/filials']} />
                                )}
                            </Form.Item>
                            <Form.Item label="Типы персонала:">
                                {getFieldDecorator('dictionary/types', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }],
                                    initialValue: role && permissions['dictionary/types']
                                })(
                                    <Switch defaultChecked={role && permissions['dictionary/types']} />
                                )}
                            </Form.Item>
                            <Form.Item label="Сотрудники:">
                                {getFieldDecorator('dictionary/workers', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }],
                                    initialValue: role && permissions['dictionary/workers']
                                })(
                                    <Switch defaultChecked={role && permissions['dictionary/workers']} />
                                )}
                            </Form.Item>
                            <Form.Item label="Услуги:">
                                {getFieldDecorator('dictionary/services', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }],
                                    initialValue: role && permissions['dictionary/services']
                                })(
                                    <Switch defaultChecked={role && permissions['dictionary/services']} />
                                )}
                            </Form.Item>
                            <Form.Item label="Роли:">
                                {getFieldDecorator('dictionary/roles', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }],
                                    initialValue: role && permissions['dictionary/roles']
                                })(
                                    <Switch defaultChecked={role && permissions['dictionary/roles']} />
                                )}
                            </Form.Item>
                        </Col>
                        <Col lg={12} className="roles__form_category">
                            <Title level={4}>Страницы</Title>
                            <Form.Item label="Отчёты:">
                                {getFieldDecorator('pages/report', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }],
                                    initialValue: role && permissions['pages/report']
                                })(
                                    <Switch defaultChecked={role && permissions['pages/report']} />
                                )}
                            </Form.Item>
                            <Form.Item label="Настройки приложения:">
                                {getFieldDecorator('pages/settings/app', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }],
                                    initialValue: role && permissions['pages/settings/app']
                                })(
                                    <Switch defaultChecked={role && permissions['pages/settings/app']} />
                                )}
                            </Form.Item>
                            <Form.Item label="Реквизиты организации:">
                                {getFieldDecorator('pages/settings/organization', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }],
                                    initialValue: role && permissions['pages/settings/organization']
                                })(
                                    <Switch defaultChecked={role && permissions['pages/settings/organization']} />
                                )}
                            </Form.Item>
                            <Form.Item label="История платежей:">
                                {getFieldDecorator('pages/payments/history', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }],
                                    initialValue: role && permissions['pages/payments/history']
                                })(
                                    <Switch defaultChecked={role && permissions['pages/payments/history']} />
                                )}
                            </Form.Item>
                            <Form.Item label="Реферальная система:">
                                {getFieldDecorator('pages/referal', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }],
                                    initialValue: role && permissions['pages/referal']
                                })(
                                    <Switch defaultChecked={role && permissions['pages/referal']} />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={15}>
                        <Col span={24} style={{ textAlign: 'center', margin: '0 0 30px 0' }}>
                            <Button htmlType="submit" type="primary" size="large" loading={roles.loading}>
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

UpdateRole.propTypes = {
    form: PropTypes.object.isRequired,
    roles: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    roles: state.roles,
    auth: state.auth
});

const wrappedComponent = compose(
    connect(mapStateToProps),
    Form.create()
);

export default wrappedComponent(UpdateRole);
