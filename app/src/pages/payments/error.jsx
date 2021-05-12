import React, { Component } from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

import { PAYMENTS_ERROR_ROUTE, SCHEDULE_ROUTE } from '../../constans/routes';
import './style.scss';

class ErrorPage extends Component {
    static pathPage = PAYMENTS_ERROR_ROUTE;

    static namePage = 'Ошибка оплаты';

    componentDidMount() {
        document.title = 'Ошибка оплаты | ВедёмПриём';
    }

    render() {
        const urlParams = new URLSearchParams(window.location.search);
        const errorMessageBank = urlParams.get('Message');

        return (
            <section className="success page">
                <Result
                    status="error"
                    title="Ошибка оплаты"
                    subTitle={`В процессе оплаты произшла ошибка. ${errorMessageBank || ''}`}
                    extra={[
                        <Button type="primary" key="console">
                            <Link to={SCHEDULE_ROUTE}>Вернуться на главную</Link>
                        </Button>
                    ]}
                />
            </section>
        );
    }
}

export default ErrorPage;
