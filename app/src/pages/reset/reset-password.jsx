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

import { REGISTRATION_ROUTE, SCHEDULE_ROUTE } from '../../constans/routes';
import WrapperAuth from '../../components/WrapperAuth';
import Preloader from '../../components/Preloader';
import { resetAction, confirmResetAction } from './actions';
import logo from '../../assets/logo.png';
import './style.scss';

const { Text } = Typography;

class ResetPasswordPage extends Component {
    static pathPage = REGISTRATION_ROUTE;

    static namePage = 'Восстановление пароля';

    state = {
        resetCode: null
    }

    componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        const resetCode = urlParams.get('reset_code');

        if (resetCode) {
            const { dispatch } = this.props;
            this.setState({ resetCode });
            dispatch(confirmResetAction(resetCode));
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { form, dispatch } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                const { email } = values;
                console.log(values);
                dispatch(resetAction(email));
            }
        });
    };

    render() {
        const { form, auth } = this.props;
        const { resetCode } = this.state;
        const { getFieldDecorator } = form;

        if (resetCode && auth.loading) {
            return <Preloader />;
        }

        if (auth.statuses.waitingConfirm) {
            return (
                <Result
                    title={(
                        <p style={{ fontSize: '1rem' }}>
                            На почту&nbsp;
                            <b>{form.getFieldValue('email')}</b>
                            &nbsp;отправлено письмо со сбросом пароля.
                        </p>
                    )}
                />
            );
        }

        if (auth.statuses.successConfirm) {
            return (
                <Result
                    status="success"
                    title="Пароль успешно сброшен!"
                    subTitle="Вам на почту выслан новый пароль для входа в систему."
                />
            );
        }

        return (
            <section className="reset-password page">
                <img src={logo} alt="ВедёмПриём" className="reset-password_logo" />
                <Form onSubmit={this.handleSubmit} className="reset-password-form">
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
                        { auth.error !== '' ? <Text type="danger" style={{ margin: '-14px 0 14px 0', display: 'block', lineHeight: 1.3 }}>{auth.error}</Text> : null }
                        <Button type="primary" htmlType="submit" loading={auth.loading} className="form-button">Восстановить</Button>
                    </Form.Item>
                </Form>
            </section>
        );
    }
}

ResetPasswordPage.propTypes = {
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

export default wrapper(ResetPasswordPage);
