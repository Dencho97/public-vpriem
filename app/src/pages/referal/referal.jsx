import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Divider,
    Typography,
    Tooltip,
    Row,
    Col,
    Table,
    Button,
    Form,
    Input,
    InputNumber,
    Icon
} from 'antd';

import notification from '../../components/notification';
import { REFERAL_ROUTE, REGISTRATION_ROUTE } from '../../constans/routes';
import Preloader from '../../components/Preloader';
import WrapperContent from '../../components/WrapperContent';
import { getReferalsAction, withdrawReferalsAction, switchPaneReferalsAction } from './actions';
import './style.scss';

const { Paragraph, Title } = Typography;

class ReferalPage extends Component {
    static pathPage = REFERAL_ROUTE;

    static namePage = 'Реферальная система';

    state = {
        tooltipText: 'Копировать'
    }

    componentDidMount = () => {
        const { dispatch, auth } = this.props;
        const { token } = auth;

        dispatch(getReferalsAction(token));
    }

    onCopy = (e) => {
        const copyText = e.target.innerText;
        this.setState({ tooltipText: 'Скопировано!' });

        const el = document.createElement('textarea');
        el.value = copyText;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    onVisibleChange = (visible) => {
        if (!visible) {
            this.setState({ tooltipText: 'Копировать' });
        }
    }

    onWithdraw = () => {
        const { referals, dispatch } = this.props;
        const { totalReward } = referals;

        if (+totalReward >= 1000) {
            dispatch(switchPaneReferalsAction('withdraw'));
        } else {
            notification('warning', 'Недостаточно средств', 'Сумма вывода вознагражения должна быть не меньше 1000 ₽');
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {
            dispatch,
            auth,
            form
        } = this.props;

        form.validateFields((err, values) => {
            if (!err) {
                dispatch(withdrawReferalsAction(values, auth.token));
            }
        });
    }

    render() {
        const { referals, form, auth } = this.props;
        const { data, loading, pane } = referals;
        const { getFieldDecorator } = form;
        const { tooltipText } = this.state;
        const columns = [
            {
                title: 'Организация',
                dataIndex: 'organization',
                key: 'organization'
            },
            {
                title: 'Оплачено/₽',
                dataIndex: 'amount',
                key: 'amount'
            },
            {
                title: 'Ваша награда / ₽',
                dataIndex: 'reward',
                key: 'reward'
            },
            {
                title: 'Процент от суммы / %',
                dataIndex: 'percent',
                key: 'percent'
            },
            {
                title: 'Дата',
                dataIndex: 'date',
                key: 'date'
            }
        ];

        if (loading && data === null) {
            return (
                <div className="referal page">
                    <Preloader />
                </div>
            );
        }

        const {
            accrualsHistory,
            totalReward,
            percent,
            firstPercent,
            referal
        } = data;

        switch (pane) {
            case 'referal':
                return (
                    <section className="referal page">
                        <Divider>Реферальная система</Divider>
                        <Title level={2}>Ваша реферальная ссылка:</Title>
                        <Tooltip placement="bottom" title={tooltipText} onVisibleChange={visible => this.onVisibleChange(visible)}>
                            <Paragraph mark onClick={e => this.onCopy(e)}>{`${window.location.origin}${REGISTRATION_ROUTE}?referal=${referal}`}</Paragraph>
                        </Tooltip>
                        <Row gutter={15} style={{ marginTop: 30 }}>
                            <Col span={24} lg={8}>
                                <Title level={3}>Ваш основной процент:</Title>
                                <Title level={3} className="referal_value">{`${percent} %`}</Title>
                            </Col>
                            <Col span={24} lg={8}>
                                <Title level={3}>Ваш процент за первую оплату:</Title>
                                <Title level={3} className="referal_value">{`${firstPercent} %`}</Title>
                            </Col>
                            <Col span={24} lg={8}>
                                <Title level={3}>Ваш доход:</Title>
                                <Title level={3} className="referal_value">{`${totalReward} ₽`}</Title>
                            </Col>
                        </Row>
                        <Row gutter={15} style={{ marginTop: 30, marginBottom: 30 }}>
                            <Col span={24}>
                                <Button htmlType="button" className="referal_withdraw-btn" type="primary" size="large" icon="dollar" onClick={() => this.onWithdraw()}>Вывести средства</Button>
                            </Col>
                        </Row>
                        <Divider>История начислений</Divider>
                        <Table
                            columns={columns}
                            dataSource={accrualsHistory}
                            rowKey={record => record.id}
                            size="middle"
                            pagination={false}
                            locale={{ emptyText: 'Нет данных' }}
                        />
                    </section>
                );
            case 'withdraw':
                return (
                    <section className="referal page">
                        <Divider>Вывести средства</Divider>
                        <Form onSubmit={this.handleSubmit} className="referal__form">
                            <Form.Item label="E-mail для связи">
                                {getFieldDecorator('email', {
                                    rules: [{ required: true, message: 'Заполните поле!' }],
                                    initialValue: auth.user.email
                                })(
                                    <Input
                                        prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="E-mail"
                                        readOnly
                                        onFocus={e => e.target.removeAttribute('readonly')}
                                    />,
                                )}
                            </Form.Item>
                            <Form.Item label="Сумма вывода">
                                {getFieldDecorator('summ', {
                                    rules: [{ required: true, message: 'Заполните поле!' }],
                                    initialValue: 1000
                                })(
                                    <InputNumber
                                        placeholder="1000"
                                        min={1000}
                                    />,
                                )}
                            </Form.Item>
                            <Button type="primary" htmlType="submit" className="referal__form_btn" loading={loading}>Запросить вывод</Button>
                        </Form>
                    </section>
                );
            default:
                return null;
        }
    }
}

ReferalPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    referals: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    referals: state.referals,
    auth: state.auth,
    ws: state.ws
});

const wrapper = compose(
    connect(mapStateToProps),
    Form.create(),
    WrapperContent
);

export default wrapper(ReferalPage);
