import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Form,
    Icon,
    Input,
    Button,
    Typography,
    Result
} from 'antd';
import { Redirect } from 'react-router-dom';

import { REGISTRATION_ROUTE, SCHEDULE_ROUTE } from '../../constans/routes';
import WrapperAuth from '../../components/WrapperAuth';
import Preloader from '../../components/Preloader';
import { registrationAction, confirmRegistrationAction } from './actions';
import logo from '../../assets/logo.png';
import './style.scss';

const { Text } = Typography;

class RegistrationPage extends Component {
    static pathPage = REGISTRATION_ROUTE;

    static namePage = 'Регистрация';

    state = {
        confirmCode: null
    }

    componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        const confirmCode = urlParams.get('confirm_code');

        if (confirmCode) {
            const { dispatch } = this.props;
            this.setState({ confirmCode });
            dispatch(confirmRegistrationAction(confirmCode));
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { form, dispatch } = this.props;

        form.validateFields((err, values) => {
            if (!err) {
                const { password, password_retry: passwordRetry } = values;
                if (password !== passwordRetry) {
                    form.setFields({
                        password_retry: {
                            value: passwordRetry,
                            errors: [new Error('Пароли не совпадают')],
                        },
                    });
                } else {
                    const urlParams = new URLSearchParams(window.location.search);
                    const referal = urlParams.get('referal') ? urlParams.get('referal') : '';
                    dispatch(registrationAction({ ...values, referal }));
                }
            }
        });
    };

    render() {
        const { form, auth } = this.props;
        const { confirmCode } = this.state;
        const { getFieldDecorator } = form;

        if (confirmCode && auth.loading) {
            return <Preloader />;
        }

        if (auth.statuses.waitingConfirm) {
            return (
                <Result
                    title={(
                        <p style={{ fontSize: '1rem' }}>
                            На почту&nbsp;
                            <b>{form.getFieldValue('email')}</b>
                            &nbsp;отправлено письмо с подверждением регистрации.
                        </p>
                    )}
                />
            );
        }

        if (auth.statuses.successConfirm) {
            return (
                <Result
                    status="success"
                    title="Учетная запись подтверждена!"
                    subTitle="Вы будете автоматически перенаправлены на страницу авторизации."
                />
            );
        }

        if (auth.statuses.errorConfirm) {
            return (
                <Result
                    status="error"
                    title="Ошибка!"
                    subTitle="При подверждении учетной записи произошла ошибка."
                />
            );
        }

        return (
            <section className="registration page">
                <img src={logo} alt="ВедёмПриём" className="registration_logo" />
                <Form onSubmit={this.handleSubmit} className="registration-form">
                    <Form.Item>
                        {getFieldDecorator('email', {
                            rules: [{ required: true, message: 'Заполните поле!' }],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="E-mail"
                                readOnly
                                onFocus={e => e.target.removeAttribute('readonly')}
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Заполните поле!' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Придумайте пароль"
                                readOnly
                                onFocus={e => e.target.removeAttribute('readonly')}
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password_retry', {
                            rules: [{ required: true, message: 'Заполните поле!' }],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="Повторите пароль"
                                readOnly
                                onFocus={e => e.target.removeAttribute('readonly')}
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        { auth.error !== '' ? <Text type="danger" style={{ margin: '-14px 0 14px 0', display: 'block', lineHeight: 1.3 }}>{auth.error}</Text> : null }
                        <Button type="primary" htmlType="submit" loading={auth.loading} className="form-button">Зарегистрироваться</Button>
                    </Form.Item>
                </Form>
            </section>
        );
    }
}

RegistrationPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    ws: state.ws,
    settings: state.settings
});

const wrapper = compose(
    connect(mapStateToProps),
    Form.create(),
    WrapperAuth
);

export default wrapper(RegistrationPage);
