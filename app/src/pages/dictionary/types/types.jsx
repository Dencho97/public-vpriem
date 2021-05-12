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

import { DICTIONARY_TYPES_ROUTE } from '../../../constans/routes';
import { history } from '../../../store';
import Preloader from '../../../components/Preloader';
import WrapperContent from '../../../components/WrapperContent';
import delayUnmounting from '../../../components/delayUnmounting';
import UpdateType from './update';
import {
    getTypesAction,
    createTypeAction,
    removeTypesAction,
    switchDrawer
} from './actions';
import './style.scss';

const DelayUnmountingUpdateType = delayUnmounting(UpdateType);

class TypesPage extends Component {
    static pathPage = DICTIONARY_TYPES_ROUTE;

    static namePage = 'Типы персонала';

    componentDidMount = () => {
        const { pathname } = window.location;
        const { dispatch, auth } = this.props;
        const { token } = auth;

        dispatch(getTypesAction(token));

        if (pathname.search('update') !== -1) {
            dispatch(switchDrawer('show_update'));
        }
    }

    editType = (id) => {
        const { dispatch } = this.props;
        history.push(`${DICTIONARY_TYPES_ROUTE}/update/${id}`);
        dispatch(switchDrawer('show_update', id));
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { form, dispatch, auth } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                const { token } = auth;
                dispatch(createTypeAction(values, token));
                form.resetFields();
            } else {
                console.log('error field');
            }
        });
    }

    onRemove = (id) => {
        const { dispatch, auth } = this.props;
        const { token } = auth;
        dispatch(removeTypesAction(id, token));
    }

    render() {
        const { form, types } = this.props;
        const { getFieldDecorator } = form;
        const { data, loading } = types;
        const columns = [
            {
              title: 'Название типа',
              dataIndex: 'name',
              key: 'name'
            },
            {
              title: 'Действия',
              key: 'actions',
              render: (value, item) => (
                <>
                    {![1, 2, 3, 4].includes(+item.id) ? (
                        <>
                            <Button onClick={() => this.editType(item.id)}><Icon type="edit" /></Button>
                            <Button type="danger" onClick={() => this.onRemove(item.id)}><Icon type="delete" /></Button>
                        </>
                    ) : null}
                </>
              ),
            },
        ];

        if (loading && data === null) {
            return (
                <div className="types page">
                    <Preloader />
                </div>
            );
        }

        return (
            <section className="types page">
                <Divider>Добавить тип персонала</Divider>
                <Form layout="vertical" onSubmit={this.onSubmit}>
                    <Row gutter={15}>
                        <Col span={24}>
                            <Form.Item label="Название типа">
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: 'Заполните это поле!' }]
                                })(
                                    <Input placeholder="Название типа" />
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
                <Divider>Список типов</Divider>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={record => record.id}
                    size="middle"
                    pagination={false}
                    locale={{ emptyText: 'Нет данных' }}
                />
                <DelayUnmountingUpdateType delayTime={300} isMounted={types.drawerUpdate} />
            </section>
        );
    }
}

TypesPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    types: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    types: state.types,
    auth: state.auth,
    ws: state.ws
});

const wrapper = compose(
    connect(mapStateToProps),
    Form.create(),
    WrapperContent
);

export default wrapper(TypesPage);
