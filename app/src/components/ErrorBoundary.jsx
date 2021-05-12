import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Result, Button } from 'antd';

import { SCHEDULE_ROUTE } from '../constans/routes';
import { API_HOST } from '../constans/api';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error) {
        const formData = new FormData();
        formData.append('error', error);
        formData.append('href', window.location.href);

        axios.post(`${API_HOST}log/frontend`, formData);
    }

    render() {
        const { hasError } = this.state;
        const { children } = this.props;

        if (hasError) {
            document.title = 'Упс...';
            return (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%'
                    }}
                >
                    <Result
                        status="500"
                        title="Упс..."
                        subTitle="Извините, что-то пошло не так, мы уже знаем об этой проблеме 😅"
                        extra={<Button type="primary"><a href={SCHEDULE_ROUTE}>Вернуться к расписанию</a></Button>}
                    />
                </div>
            );
        }

        return children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.object.isRequired
};

export default ErrorBoundary;
