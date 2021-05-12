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
import { DICTIONARY_FILIALS_ROUTE } from '../../../constans/routes';
import {
    switchDrawer,
    editFilialAction
} from './actions';

class UpdateFilial extends Component {
    onSubmit = (e, id) => {
        e.preventDefault();
        const { form, dispatch, auth } = this.props;
        const { token } = auth;
        form.validateFields((err, values) => {
            if (!err) {
                dispatch(editFilialAction({ ...values, id }, token));
            }
        });
    }

    onClose = () => {
        const { dispatch } = this.props;
        dispatch(switchDrawer('hide_update'));
        setTimeout(() => { history.push(DICTIONARY_FILIALS_ROUTE); }, 300);
    }

    getFilial = () => {
        const { filials } = this.props;
        const id = this.getFilialId();

        return filials.data.filter(item => item.id === id)[0];
    }

    getFilialId = () => {
        const { filials } = this.props;
        const url = window.location.pathname.split('/');

        return filials.editing ? +filials.editing : +url[url.length - 1];
    }

    render() {
        const isMobile = window.matchMedia('(max-width: 991px)').matches;
        const {
            form,
            filials
        } = this.props;
        const { getFieldDecorator } = form;

        const filial = this.getFilial();

        return (
            <Drawer
                title={`Изменить филиал "${filial.name}"`}
                width={isMobile ? '100%' : '50%'}
                onClose={this.onClose}
                visible={filials.drawerUpdate}
            >
                <Form layout="vertical" onSubmit={e => this.onSubmit(e, filial.id)}>
                    <Row gutter={15}>
                        <Col span={24}>
                            <Form.Item label="Название филиала">
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: 'Заполните это поле!' }],
                                    initialValue: filial ? filial.name : ''
                                })(
                                    <Input placeholder="Название филиала" />
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

UpdateFilial.propTypes = {
    form: PropTypes.object.isRequired,
    filials: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    filials: state.filials,
    auth: state.auth
});

const wrappedComponent = compose(
    connect(mapStateToProps),
    Form.create()
);

export default wrappedComponent(UpdateFilial);
