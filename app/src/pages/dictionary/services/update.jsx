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
    Button
} from 'antd';

import { history } from '../../../store';
import { DICTIONARY_SERVICES_ROUTE } from '../../../constans/routes';
import {
    switchDrawer,
    editServiceAction
} from './actions';

const { TextArea } = Input;

class UpdateService extends Component {
    onSubmit = (e, id) => {
        e.preventDefault();
        const { form, dispatch, auth } = this.props;
        const { token } = auth;
        form.validateFields((err, values) => {
            if (!err) {
                dispatch(editServiceAction({ ...values, id }, token));
            }
        });
    }

    onClose = () => {
        const { dispatch } = this.props;
        dispatch(switchDrawer('hide_update'));
        setTimeout(() => { history.push(DICTIONARY_SERVICES_ROUTE); }, 300);
    }

    getService = () => {
        const { services } = this.props;
        const id = this.getServiceId();

        return services.data.filter(item => item.id === id)[0];
    }

    getServiceId = () => {
        const { services } = this.props;
        const url = window.location.pathname.split('/');

        return services.editing ? +services.editing : +url[url.length - 1];
    }

    render() {
        const isMobile = window.matchMedia('(max-width: 991px)').matches;
        const {
            form,
            services
        } = this.props;
        const { getFieldDecorator } = form;

        const service = this.getService();

        return (
            <Drawer
                title={`Изменить услугу "${service.name}"`}
                width={isMobile ? '100%' : '50%'}
                onClose={this.onClose}
                visible={services.drawerUpdate}
            >
                <Form layout="vertical" onSubmit={e => this.onSubmit(e, service.id)}>
                    <Row gutter={15}>
                        <Col span={24}>
                            <Form.Item label="Название услуги">
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: 'Заполните это поле!' }],
                                    initialValue: service ? service.name : ''
                                })(
                                    <Input placeholder="Название услуги" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Ссылка на услугу">
                                {getFieldDecorator('link', {
                                    rules: [{ required: false }],
                                    initialValue: service ? service.link : ''
                                })(
                                    <Input placeholder="Ссылка на услугу" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Ссылка на изображение">
                                {getFieldDecorator('image', {
                                    rules: [{ required: false }],
                                    initialValue: service ? service.image : ''
                                })(
                                    <Input placeholder="Ссылка на изображение" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Описание услуги">
                                {getFieldDecorator('description', {
                                    rules: [{ required: false }],
                                    initialValue: service ? service.description : ''
                                })(
                                    <TextArea placeholder="Описание услуги" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24} style={{ textAlign: 'center', margin: '0 0 30px 0' }}>
                            <Button htmlType="submit" type="primary" size="large">
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

UpdateService.propTypes = {
    form: PropTypes.object.isRequired,
    services: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    services: state.services,
    auth: state.auth
});

const wrappedComponent = compose(
    connect(mapStateToProps),
    Form.create()
);

export default wrappedComponent(UpdateService);
