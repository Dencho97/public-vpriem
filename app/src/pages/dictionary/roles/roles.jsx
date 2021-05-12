import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Table,
    Icon,
    Button,
    Divider,
    Form,
    Input,
    Row,
    Switch,
    Typography,
    Col,
    Tag
} from 'antd';

import { DICTIONARY_ROLES_ROUTE } from '../../../constans/routes';
import { PERMISSIONS } from '../../../constans/permissions';
import { history } from '../../../store';
import Preloader from '../../../components/Preloader';
import WrapperContent from '../../../components/WrapperContent';
import delayUnmounting from '../../../components/delayUnmounting';
import UpdateRole from './update';
import {
    getRolesAction,
    createRolesAction,
    removeRolesAction,
    switchDrawer
} from './actions';
import './style.scss';

const { Title } = Typography;

const DelayUnmountingUpdateRoles = delayUnmounting(UpdateRole);

class RolesPage extends Component {
    static pathPage = DICTIONARY_ROLES_ROUTE;

    static namePage = 'Список ролей';

    componentDidMount = () => {
        const { pathname } = window.location;
        const { dispatch, auth } = this.props;
        const { token, user } = auth;

        dispatch(getRolesAction(token));

        if (pathname.search('update') !== -1) {
            const arrPath = pathname.split('/');
            const id = +arrPath[arrPath.length - 1];
            if (id === 1 || id === +user.role_id) {
                history.push(`${DICTIONARY_ROLES_ROUTE}`);
            } else {
                dispatch(switchDrawer('show_update'));
            }
        }
    }

    editRole = (id) => {
        const { dispatch } = this.props;
        history.push(`${DICTIONARY_ROLES_ROUTE}/update/${id}`);
        dispatch(switchDrawer('show_update', id));
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { form, dispatch, auth } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                const { token } = auth;
                dispatch(createRolesAction(values, token));
                form.resetFields();
            } else {
                console.log('error field');
            }
        });
    }

    onRemove = (id) => {
        const { dispatch, auth } = this.props;
        const { token } = auth;
        dispatch(removeRolesAction(id, token));
    }

    render() {
        const { form, roles, auth } = this.props;
        const { getFieldDecorator } = form;
        const { data, loading } = roles;
        const { user, permissions } = auth;

        const columns = [
            {
              title: 'Название роли',
              dataIndex: 'name',
              key: 'name',
              width: 40,
            },
            {
                title: 'Привилегии',
                dataIndex: 'permissions',
                key: 'permissions',
                width: 40,
                render: (text, record) => {
                    const { permissions: permissionRole } = record;
                    let names = [];
                    for (const key in permissionRole) {
                        if (permissionRole[key]) {
                        names = [...names, <Tag key={key} color={PERMISSIONS[key].color}>{PERMISSIONS[key].label}</Tag>];
                        }
                    }
                    return names;
                }
              },
            {
              title: 'Действия',
              key: 'actions',
              width: 10,
              render: (text, record) => {
                  if (+record.id !== 1) {
                    if ([2, 3].includes(+record.id)) return null;
                    if (permissions['dictionary/roles']) {
                        if (+user.role_id === +record.id) return null;
                        return (
                            <>
                                <Button onClick={() => this.editRole(record.id)}><Icon type="edit" /></Button>
                                <Button type="danger" onClick={() => this.onRemove(record.id)}><Icon type="delete" /></Button>
                            </>
                        );
                    }
                  }
                  return null;
              },
            },
        ];

        if (loading && data === null) {
            return (
                <div className="roles page">
                    <Preloader />
                </div>
            );
        }

        return (
            <section className="roles page">
                <Divider>Добавить роль</Divider>
                <Form layout="vertical" onSubmit={this.onSubmit}>
                    <Row gutter={15}>
                        <Col span={24}>
                            <Form.Item label="Название роли">
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: 'Заполните это поле!' }]
                                })(
                                    <Input placeholder="Название роли" />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={15} className="roles__form_permissions-fileds">
                        <Col lg={6}>
                            <Title level={4}>Талоны</Title>
                            <Form.Item label="Создание/разделение:">
                                {getFieldDecorator('tickets/create', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }]
                                })(
                                    <Switch />
                                )}
                            </Form.Item>
                            <Form.Item label="Удаление:">
                                {getFieldDecorator('tickets/delete', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }]
                                })(
                                    <Switch />
                                )}
                            </Form.Item>
                        </Col>
                        <Col lg={6}>
                            <Title level={4}>Записи</Title>
                            <Form.Item label="Создание:">
                                {getFieldDecorator('writes/create', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }]
                                })(
                                    <Switch />
                                )}
                            </Form.Item>
                            <Form.Item label="Редактирование:">
                                {getFieldDecorator('writes/update', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }]
                                })(
                                    <Switch />
                                )}
                            </Form.Item>
                            <Form.Item label="Удаление:">
                                {getFieldDecorator('writes/delete', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }]
                                })(
                                    <Switch />
                                )}
                            </Form.Item>
                            <Form.Item label="Показывать номер телефона:">
                                {getFieldDecorator('writes/fields/phone', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }]
                                })(
                                    <Switch />
                                )}
                            </Form.Item>
                        </Col>
                        <Col lg={6}>
                            <Title level={4}>Справочники</Title>
                            <Form.Item label="Пользователи:">
                                {getFieldDecorator('dictionary/users', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }]
                                })(
                                    <Switch />
                                )}
                            </Form.Item>
                            <Form.Item label="Филиалы:">
                                {getFieldDecorator('dictionary/filials', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }]
                                })(
                                    <Switch />
                                )}
                            </Form.Item>
                            <Form.Item label="Типы персонала:">
                                {getFieldDecorator('dictionary/types', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }]
                                })(
                                    <Switch />
                                )}
                            </Form.Item>
                            <Form.Item label="Сотрудники:">
                                {getFieldDecorator('dictionary/workers', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }]
                                })(
                                    <Switch />
                                )}
                            </Form.Item>
                            <Form.Item label="Услуги:">
                                {getFieldDecorator('dictionary/services', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }]
                                })(
                                    <Switch />
                                )}
                            </Form.Item>
                            <Form.Item label="Роли:">
                                {getFieldDecorator('dictionary/roles', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }]
                                })(
                                    <Switch />
                                )}
                            </Form.Item>
                        </Col>
                        <Col lg={6}>
                            <Title level={4}>Страницы</Title>
                            <Form.Item label="Отчёты:">
                                {getFieldDecorator('pages/report', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }]
                                })(
                                    <Switch />
                                )}
                            </Form.Item>
                            <Form.Item label="Настройки приложения:">
                                {getFieldDecorator('pages/settings/app', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }]
                                })(
                                    <Switch />
                                )}
                            </Form.Item>
                            <Form.Item label="Реквизиты организации:">
                                {getFieldDecorator('pages/settings/organization', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }]
                                })(
                                    <Switch />
                                )}
                            </Form.Item>
                            <Form.Item label="История платежей:">
                                {getFieldDecorator('pages/payments/history', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }]
                                })(
                                    <Switch />
                                )}
                            </Form.Item>
                            <Form.Item label="Реферальная система:">
                                {getFieldDecorator('pages/referal', {
                                    rules: [{ required: false, message: 'Заполните это поле!' }]
                                })(
                                    <Switch />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={15}>
                        <Col span={24} style={{ textAlign: 'center', marginBottom: 30, marginTop: 30 }}>
                            <Button htmlType="submit" type="primary" size="large" loading={loading}>
                                Добавить
                                <Icon type="plus" />
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <Divider>Список ролей</Divider>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={record => record.id}
                    size="middle"
                    pagination={false}
                    locale={{ emptyText: 'Нет данных' }}
                />
                <DelayUnmountingUpdateRoles delayTime={300} isMounted={roles.drawerUpdate} />
            </section>
        );
    }
}

RolesPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    roles: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    roles: state.roles,
    auth: state.auth,
    ws: state.ws
});

const wrapper = compose(
    connect(mapStateToProps),
    Form.create(),
    WrapperContent
);

export default wrapper(RolesPage);
