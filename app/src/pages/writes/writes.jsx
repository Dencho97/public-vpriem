import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Divider,
    Table,
    Row,
    Col,
    Form,
    Input,
    DatePicker,
    Button,
    Icon
} from 'antd';
import moment from 'moment';

import { WRITES_ROUTE } from '../../constans/routes';
import WrapperContent from '../../components/WrapperContent';
import Preloader from '../../components/Preloader';
import InputMask from '../../components/InputMask';
import localePicker from '../../constans/ruLocalePicker';
import { getWritesAction } from './actions';
import './style.scss';

moment.locale('ru');

class WritesPage extends Component {
    static pathPage = WRITES_ROUTE;

    static namePage = 'Записи';

    onSubmit = () => {
        const { form, dispatch, auth } = this.props;
        const { token } = auth;

        form.validateFields((err, values) => {
            dispatch(getWritesAction(values, token));
        });
    }

    render() {
        const {
            writes,
            form
        } = this.props;
        const { loading, data } = writes;
        const { getFieldDecorator } = form;
        const columnsTable = [
            {
              title: 'Пациент',
              dataIndex: 'patient',
            },
            {
                title: 'Врач',
                dataIndex: 'doctor',
            },
            {
              title: 'Администратор',
              dataIndex: 'admin',
            },
            {
              title: 'Телефон',
              dataIndex: 'phone',
            },
            {
              title: 'Время талона',
              dataIndex: 'time',
            },
            {
                title: 'Запись с сайта',
                dataIndex: 'from_site',
            },
            {
                title: 'Комментарий',
                dataIndex: 'comment',
            },
            {
              title: 'Дата',
              dataIndex: 'date',
            }
        ];

        return (
            <section className="writes page">
                <Form className="writes__filter">
                    <Row gutter={15}>
                        <Col md={12} lg={6}>
                            <Form.Item label="Фамилия">
                                {getFieldDecorator('last-name', {
                                    rules: [{ required: false }]
                                })(
                                    <Input placeholder="Фамилия" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col md={12} lg={6}>
                            <Form.Item label="Имя">
                                {getFieldDecorator('first-name', {
                                    rules: [{ required: false }]
                                })(
                                    <Input placeholder="Имя" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col md={12} lg={6}>
                            <Form.Item label="Телефон">
                                {getFieldDecorator('phone', {
                                    rules: [{ required: false }]
                                })(
                                    <InputMask mask="+7(999)999-99-99" maskChar="_" placeholder="+7(___)___-__-__" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col md={12} lg={6}>
                            <Form.Item label="Дата записи">
                                {getFieldDecorator('date', {
                                    rules: [{ required: false }]
                                })(
                                    <DatePicker
                                        placeholder="__.__.____"
                                        format="DD.MM.YYYY"
                                        allowClear={false}
                                        locale={localePicker}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24} style={{ textAlign: 'center', marginBottom: 30 }}>
                            <Button htmlType="submit" type="primary" size="large" onClick={() => this.onSubmit()} loading={loading}>
                                Найти
                                <Icon type="search" />
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <Divider>Записи</Divider>
                <Table
                    rowKey="id"
                    columns={columnsTable}
                    dataSource={data}
                    size="middle"
                    pagination={false}
                    style={{ marginTop: 30 }}
                    locale={{ emptyText: 'Нет результатов' }}
                />
            </section>
        );
    }
}

WritesPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    writes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    writes: state.writes,
    auth: state.auth,
    ws: state.ws
});

const wrapper = compose(
    connect(mapStateToProps),
    Form.create(),
    WrapperContent
);

export default wrapper(WritesPage);
