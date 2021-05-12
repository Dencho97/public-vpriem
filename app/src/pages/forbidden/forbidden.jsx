import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

import { FORBIDDEN_ROUTE, SCHEDULE_ROUTE } from '../../constans/routes';
import './style.scss';

class ForbiddenPage extends Component {
    static pathPage = FORBIDDEN_ROUTE;

    static namePage = 'Нет доступа';

    componentDidMount() {
        document.title = 'Нет доступа | ВедёмПриём';
    }

    render() {
        return (
            <section className="forbidden page">
                <Result
                    status="403"
                    title="403"
                    subTitle="У вас нет доступа к этой странице."
                    extra={<Button type="primary"><Link to={SCHEDULE_ROUTE}>Вернуться к расписанию</Link></Button>}
                />
            </section>
        );
    }
}


const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(ForbiddenPage);
