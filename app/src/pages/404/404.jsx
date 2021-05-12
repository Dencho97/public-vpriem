import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

import { NOT_FOUND_ROUTE, SCHEDULE_ROUTE } from '../../constans/routes';
import './style.scss';

class ForbiddenPage extends Component {
    static pathPage = NOT_FOUND_ROUTE;

    static namePage = 'Страница не найдена';

    componentDidMount() {
        document.title = 'Страница не найдена | ВедёмПриём';
    }

    render() {
        return (
            <section className="not-found page">
                <Result
                    status="404"
                    title="404"
                    subTitle="Страница не найдена."
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
