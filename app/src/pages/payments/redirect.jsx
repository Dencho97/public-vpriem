import React, { Component } from 'react';
import { Result } from 'antd';

import { PAYMENTS_REDIRECT_ROUTE } from '../../constans/routes';
import './style.scss';

class RedirectPage extends Component {
    static pathPage = PAYMENTS_REDIRECT_ROUTE;

    static namePage = 'Перенаправление...';

    componentDidMount() {
        document.title = 'Перенаправление... | ВедёмПриём';
    }

    render() {
        return (
            <section className="redirect page">
                <Result
                    title="Сейчас Вы будете перенаравлены на страницу оплаты"
                />
            </section>
        );
    }
}

export default RedirectPage;
