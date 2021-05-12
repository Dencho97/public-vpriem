import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Divider,
    Form,
    Input,
    Button
} from 'antd';

import { HELP_ROUTE } from '../../constans/routes';
import WrapperContent from '../../components/WrapperContent';
import { sendSupportMesageAction } from './actions';
import './style.scss';

const { TextArea } = Input;

class HelpPage extends Component {
    static pathPage = HELP_ROUTE;

    static namePage = 'Помощь';

    onSubmit = () => {
        const { form, dispatch, auth } = this.props;
        const { token } = auth;

        form.validateFields((err, values) => {
            dispatch(sendSupportMesageAction(values, form, token));
        });
    }

    render() {
        const {
            help,
            form
        } = this.props;
        const { loading } = help;
        const { getFieldDecorator } = form;

        return (
            <section className="help page">
                <Divider>Помощь</Divider>
                <Form className="help__form">
                    <Form.Item label="Ваш вопрос">
                        {getFieldDecorator('message', {
                            rules: [{ required: true, message: 'Заполните поле!' }]
                        })(
                            <TextArea placeholder="Опишите Ваш вопрос или проблему максимально подробно" />
                        )}
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        <Button htmlType="submit" type="primary" size="large" onClick={() => this.onSubmit()} loading={loading}>Отправить</Button>
                    </div>
                </Form>
            </section>
        );
    }
}

HelpPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    help: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    help: state.writes,
    auth: state.auth,
    ws: state.ws
});

const wrapper = compose(
    connect(mapStateToProps),
    Form.create(),
    WrapperContent
);

export default wrapper(HelpPage);
