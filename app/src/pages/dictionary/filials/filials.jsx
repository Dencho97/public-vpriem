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

import { DICTIONARY_FILIALS_ROUTE } from '../../../constans/routes';
import { history } from '../../../store';
import Preloader from '../../../components/Preloader';
import WrapperContent from '../../../components/WrapperContent';
import delayUnmounting from '../../../components/delayUnmounting';
import UpdateFilial from './update';
import {
    getFilialsAction,
    createFilialAction,
    removeFilialsAction,
    switchDrawer
} from './actions';
import './style.scss';

const DelayUnmountingUpdateFilial = delayUnmounting(UpdateFilial);

class FilialsPage extends Component {
    static pathPage = DICTIONARY_FILIALS_ROUTE;

    static namePage = 'Филиалы';

    componentDidMount = () => {
        const { pathname } = window.location;
        const { dispatch, auth } = this.props;
        const { token } = auth;

        dispatch(getFilialsAction(token));

        if (pathname.search('update') !== -1) {
            dispatch(switchDrawer('show_update'));
        }
    }

    editFilial = (id) => {
        const { dispatch } = this.props;
        history.push(`${DICTIONARY_FILIALS_ROUTE}/update/${id}`);
        dispatch(switchDrawer('show_update', id));
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { form, dispatch, auth } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                const { token } = auth;
                dispatch(createFilialAction(values, token));
                form.resetFields();
            } else {
                console.log('error field');
            }
        });
    }

    onRemove = (id) => {
        const { dispatch, auth } = this.props;
        const { token } = auth;
        dispatch(removeFilialsAction(id, token));
    }

    render() {
        const { form, filials } = this.props;
        const { getFieldDecorator } = form;
        const { data, loading } = filials;
        const columns = [
            {
              title: 'Название филиала',
              dataIndex: 'name',
              key: 'name'
            },
            {
              title: 'Действия',
              key: 'actions',
              render: (item, record) => (
                <>
                    <Button onClick={() => this.editFilial(record.id)}><Icon type="edit" /></Button>
                    <Button type="danger" onClick={() => this.onRemove(record.id)}><Icon type="delete" /></Button>
                </>
              ),
            },
        ];

        if (loading && data === null) {
            return (
                <div className="filials page">
                    <Preloader />
                </div>
            );
        }

        return (
            <section className="filials page">
                <Divider>Добавить филиал</Divider>
                <Form layout="vertical" onSubmit={this.onSubmit}>
                    <Row gutter={15}>
                        <Col span={24}>
                            <Form.Item label="Название филиала">
                                {getFieldDecorator('name', {
                                    rules: [{ required: true, message: 'Заполните это поле!' }]
                                })(
                                    <Input placeholder="Название филиала" />
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
                <Divider>Список филиалов</Divider>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={record => record.id}
                    size="middle"
                    pagination={false}
                    locale={{ emptyText: 'Нет данных' }}
                />
                <DelayUnmountingUpdateFilial delayTime={300} isMounted={filials.drawerUpdate} />
            </section>
        );
    }
}

FilialsPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    filials: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    filials: state.filials,
    auth: state.auth,
    ws: state.ws
});

const wrapper = compose(
    connect(mapStateToProps),
    Form.create(),
    WrapperContent
);

export default wrapper(FilialsPage);
