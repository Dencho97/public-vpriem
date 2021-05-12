import React, { Component } from 'react';
import { Result } from 'antd';

import { PAYMENTS_SUCCESS_ROUTE, SCHEDULE_ROUTE } from '../../constans/routes';
import './style.scss';

class SuccessPage extends Component {
    static pathPage = PAYMENTS_SUCCESS_ROUTE;

    static namePage = 'Успешная оплата';

    componentDidMount() {
        document.title = 'Успешная оплата | ВедёмПриём';
        setTimeout(() => {
            window.location.href = `${window.location.origin}${SCHEDULE_ROUTE}`;
        }, 3000);
    }

    render() {
        return (
            <section className="success page">
                <Result
                    status="success"
                    title="Оплата прошла успешно!"
                    subTitle="Сейчас Вы будете автоматически перенаправлены на главную страницу."
                />
            </section>
        );
    }
}

export default SuccessPage;
