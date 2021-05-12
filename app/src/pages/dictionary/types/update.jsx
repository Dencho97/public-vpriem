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
import { DICTIONARY_TYPES_ROUTE } from '../../../constans/routes';
import {
    switchDrawer,
    editTypeAction
} from './actions';

class UpdateType extends Component {
    onSubmit = (e, id) => {
        e.preventDefault();
        const { form, dispatch, auth } = this.props;
        const { token } = auth;
        form.validateFields((err, values) => {
            if (!err) {
                dispatch(editTypeAction({ ...values, id }, token));
            }
        });
    }

    onClose = () => {
        const { dispatch } = this.props;
        dispatch(switchDrawer('hide_update'));
        setTimeout(() => { history.push(DICTIONARY_TYPES_ROUTE); }, 300);
    }

    getType = () => {
        const { types } = this.props;
        const id = this.getTypeId();

        return types.data.filter(item => item.id === id)[0];
    }

    getTypeId = () => {
        const { types } = this.props;
        const url = window.location.pathname.split('/');

        return types.editing ? +types.editing : +url[url.length - 1];
    }

    render() {
        const isMobile = window.matchMedia('(max-width: 991px)').matches;
        const {
            form,
            types
        } = this.props;
        const { getFieldDecorator } = form;

        const type = this.getType();

        return (
            <Drawer
                title={`Изменить тип "${type.name}"`}
                width={isMobile ? '100%' : '50%'}
                onClose={this.onClose}
                visible={types.drawerUpdate}
            >
                <Form layout="vertical" onSubmit={e => this.onSubmit(e, type.id)}>
                    <Row gutter={15}>
                        <Col span={24}>
                            <Form.Item label="Название типа">
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: 'Заполните это поле!' }],
                                    initialValue: type ? type.name : ''
                                })(
                                    <Input placeholder="Название типа" />
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

UpdateType.propTypes = {
    form: PropTypes.object.isRequired,
    types: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    types: state.types,
    auth: state.auth
});

const wrappedComponent = compose(
    connect(mapStateToProps),
    Form.create()
);

export default wrappedComponent(UpdateType);
