import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Table,
    Divider,
    Icon,
    Badge
} from 'antd';

import { PAYMENTS_HISTORY_ROUTE } from '../../../constans/routes';
import Preloader from '../../../components/Preloader';
import WrapperContent from '../../../components/WrapperContent';
import { getPaymentsHistoryAction } from './actions';
import './style.scss';

class PaymentsHistoryPage extends Component {
    static pathPage = PAYMENTS_HISTORY_ROUTE;

    static namePage = 'История платежей';

    componentDidMount = () => {
        const { dispatch, auth } = this.props;
        const { token } = auth;

        dispatch(getPaymentsHistoryAction(token));
    }

    render() {
        const { payments } = this.props;
        const { data, loading } = payments;
        const columns = [
            {
                title: 'Название тарифа',
                dataIndex: 'tariff_name',
                key: 'tariff_name'
            },
            {
                title: 'Кол-во специалистов',
                dataIndex: 'tariff_count_workers',
                key: 'tariff_count_workers'
            },
            {
                title: 'Сумма',
                dataIndex: 'amount',
                key: 'amount',
                render: value => `${value} ₽`
            },
            {
                title: 'Способ оплаты',
                dataIndex: 'type',
                key: 'type',
                render: (value) => {
                    switch (value) {
                        case 'by_card':
                            return 'Банковской картой';
                        case 'by_invoice':
                            return 'По счёту';
                        default:
                            return '';
                    }
                }
            },
            {
                title: 'Статус',
                dataIndex: 'status',
                key: 'status',
                render: (value) => {
                    switch (value) {
                        case 'Ожидание':
                            return <Badge status="processing" text="Ожидание поступления" />;
                        case 'Успешно':
                            return <Badge status="success" text="Зачеслено" />;
                        case 'Отклонён':
                            return <Badge status="error" text="Отклонён" />;
                        case 'Возврат':
                            return <Badge color="purple" text="Возврат" />;
                        default:
                            return '';
                    }
                }
            },
            {
                title: 'Дата',
                dataIndex: 'payment_date',
                key: 'payment_date'
            },
            {
                title: 'Документы',
                dataIndex: 'link',
                key: 'link',
                render: (link, item) => {
                    switch (item.type) {
                        case 'by_invoice':
                            return (
                                <a href={link} target="_blank" rel="noopener noreferrer" download>
                                    <Icon type="download" />
                                    &nbsp;Скачать счёт
                                </a>
                            );
                        default:
                            return '-';
                    }
                }
            }
        ];

        if (loading && data === null) {
            return (
                <div className="payments-history page">
                    <Preloader />
                </div>
            );
        }

        return (
            <section className="payments-history page">
                <Divider>Список платежей</Divider>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey={record => record.id}
                    size="middle"
                    pagination={false}
                    locale={{ emptyText: 'Нет данных' }}
                />
            </section>
        );
    }
}

PaymentsHistoryPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    payments: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    payments: state.payments,
    auth: state.auth,
    ws: state.ws
});

const wrapper = compose(
    connect(mapStateToProps),
    WrapperContent
);

export default wrapper(PaymentsHistoryPage);
