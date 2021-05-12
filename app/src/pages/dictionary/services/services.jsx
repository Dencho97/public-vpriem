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
    Col
} from 'antd';

import { DICTIONARY_SERVICES_ROUTE } from '../../../constans/routes';
import { history } from '../../../store';
import Preloader from '../../../components/Preloader';
import WrapperContent from '../../../components/WrapperContent';
import delayUnmounting from '../../../components/delayUnmounting';
import UpdateService from './update';
import {
    getServicesAction,
    createServiceAction,
    removeServicesAction,
    switchDrawer
} from './actions';
import './style.scss';

const { TextArea } = Input;

const DelayUnmountingUpdateService = delayUnmounting(UpdateService);

class ServicesPage extends Component {
    static pathPage = DICTIONARY_SERVICES_ROUTE;

    static namePage = 'Список услуг';

    componentDidMount = () => {
        const { pathname } = window.location;
        const { dispatch, auth } = this.props;
        const { token } = auth;

        dispatch(getServicesAction(token));

        if (pathname.search('update') !== -1) {
            dispatch(switchDrawer('show_update'));
        }
    }

    editService = (id) => {
        const { dispatch } = this.props;
        history.push(`${DICTIONARY_SERVICES_ROUTE}/update/${id}`);
        dispatch(switchDrawer('show_update', id));
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { form, dispatch, auth } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                const { token } = auth;
                dispatch(createServiceAction(values, token));
                form.resetFields();
            } else {
                console.log('error field');
            }
        });
    }

    onRemove = (id) => {
        const { dispatch, auth } = this.props;
        const { token } = auth;
        dispatch(removeServicesAction(id, token));
    }

    render() {
        const { form, services } = this.props;
        const { getFieldDecorator } = form;
        const { data, loading } = services;
        const columns = [
            {
              title: 'Название услуги',
              dataIndex: 'name',
              key: 'name'
            },
            {
              title: 'Действия',
              key: 'actions',
              render: (text, record) => (
                <>
                    <Button onClick={() => this.editService(record.id)}><Icon type="edit" /></Button>
                    <Button type="danger" onClick={() => this.onRemove(record.id)}><Icon type="delete" /></Button>
                </>
              ),
            },
        ];

        if (loading && data === null) {
            return (
                <div className="services page">
                    <Preloader />
                </div>
            );
        }

        return (
            <section className="services page">
                <Divider>Добавить услугу</Divider>
                <Form layout="vertical" onSubmit={this.onSubmit}>
                    <Row gutter={15}>
                        <Col lg={8}>
                            <Form.Item label="Название услуги">
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: 'Заполните это поле!' }]
                                })(
                                    <Input placeholder="Название услуги" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col lg={8}>
                            <Form.Item label="Ссылка на услугу">
                                {getFieldDecorator('link', {
                                    rules: [{ required: false }]
                                })(
                                    <Input placeholder="Ссылка на услугу" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col lg={8}>
                            <Form.Item label="Ссылка на изображение">
                                {getFieldDecorator('image', {
                                    rules: [{ required: false }]
                                })(
                                    <Input placeholder="Ссылка на изображение" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Описание услуги">
                                {getFieldDecorator('description', {
                                    rules: [{ required: false }]
                                })(
                                    <TextArea placeholder="Описание услуги" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24} style={{ textAlign: 'center', marginBottom: 30 }}>
                            <Button htmlType="submit" type="primary" size="large" loading={loading}>
                                Добавить
                                <Icon type="plus" />
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <Divider>Список услуг</Divider>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={record => record.id}
                    size="middle"
                    pagination={false}
                    locale={{ emptyText: 'Нет данных' }}
                />
                <DelayUnmountingUpdateService delayTime={300} isMounted={services.drawerUpdate} />
            </section>
        );
    }
}

ServicesPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    services: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    services: state.services,
    auth: state.auth,
    ws: state.ws
});

const wrapper = compose(
    connect(mapStateToProps),
    Form.create(),
    WrapperContent
);

export default wrapper(ServicesPage);
