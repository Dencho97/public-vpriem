import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Divider,
    Row,
    Col,
    Form,
    Input,
    Upload,
    Button,
    Icon
} from 'antd';
import moment from 'moment';
import SyntaxHighlighter from 'react-syntax-highlighter';
import codeTheme from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark';
import ChromePicker from 'react-color/es/Chrome';

import { SETTINGS_APP_ROUTE } from '../../../constans/routes';
import WrapperContent from '../../../components/WrapperContent';
import Preloader from '../../../components/Preloader';
import { updateSettingsAction } from './actions';
import './style.scss';

moment.locale('ru');

class SettingsAppPage extends Component {
    static pathPage = SETTINGS_APP_ROUTE;

    static namePage = 'Настройки';

    state = {
        previewImageLogo: null,
        previewImagePlaceholder: null,
        mainColor: '#55AB3A',
        secondColor: '#73D258'
    }

    componentDidUpdate(prevProps) {
        const { settings: prevSettings } = prevProps;
        const { settings } = this.props;
        if (prevSettings.data === null && settings.data !== prevSettings.data) {
            this.setState({
                mainColor: settings.data.main_color,
                secondColor: settings.data.second_color
            });
        }
    }

    onChangeColor = (type, color) => {
        this.setState({ [type]: color.hex });
    }

    onSubmit = () => {
        const { form, dispatch, auth } = this.props;
        const { token } = auth;

        form.validateFields((err, values) => {
            dispatch(updateSettingsAction(values, token));
        });
    }

    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    render() {
        const {
            settings,
            form
        } = this.props;
        const {
            previewImageLogo,
            previewImagePlaceholder,
            mainColor,
            secondColor
        } = this.state;
        const { loading, data } = settings;
        const { getFieldDecorator, setFieldsValue } = form;

        if (loading && data === null) {
            return (
                <div className="log page">
                    <Preloader />
                </div>
            );
        }

        const rootElemID = btoa(`${data ? data.token_widget : ''}`).slice(0, 20);
        let logoImage = data && data.logo ? data.logo : null;
        let placeholderImage = data && data.placeholder ? data.placeholder : null;
        if (previewImageLogo) {
            logoImage = previewImageLogo;
        }
        if (previewImagePlaceholder) {
            placeholderImage = previewImagePlaceholder;
        }

        return (
            <section className="settings page">
                <Form className="settings__form">
                    <Divider>Конструктор виджета</Divider>
                    <Row gutter={15}>
                        <Col lg={8}>
                            <Form.Item label="Название приложения">
                                {getFieldDecorator('setting-app-name', {
                                    rules: [{ required: false }],
                                    initialValue: data && data.app ? data.app : ''
                                })(
                                    <Input placeholder="ВедёмПриём" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col lg={6}>
                            <div className="settings__form__logo-preview">
                                <div className="settings__form__logo-preview_image" style={{ backgroundImage: `url('${logoImage || '//schedule-dist.redken.online/v1/admin/assets/logo.png'}')` }} />
                                <Form.Item label="Логотип">
                                    {getFieldDecorator('setting-logo', {
                                        rules: [{ required: false }]
                                    })(
                                        <Upload
                                            name="logo"
                                            beforeUpload={(file) => {
                                                this.getBase64(file, (fileInBase64) => {
                                                    setFieldsValue({ 'setting-logo': { file, fileInBase64 } });
                                                    this.setState({ previewImageLogo: fileInBase64 });
                                                });
                                                return false;
                                              }
                                            }
                                        >
                                            <Button>
                                                <Icon type="upload" />
                                                Загрузить лого
                                            </Button>
                                        </Upload>,
                                    )}
                                </Form.Item>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="settings__form__logo-preview">
                                <div className="settings__form__logo-preview_image" style={{ backgroundImage: `url('${placeholderImage || '//schedule-dist.redken.online/v1/admin/assets/placeholder.jpg'}')` }} />
                                <Form.Item label="Заглушка">
                                    {getFieldDecorator('setting-placeholder', {
                                        rules: [{ required: false }]
                                    })(
                                        <Upload
                                            name="logo"
                                            beforeUpload={(file) => {
                                                this.getBase64(file, (fileInBase64) => {
                                                    setFieldsValue({ 'setting-placeholder': { file, fileInBase64 } });
                                                    this.setState({ previewImagePlaceholder: fileInBase64 });
                                                });
                                                return false;
                                              }
                                            }
                                        >
                                            <Button>
                                                <Icon type="upload" />
                                                Загрузить заглушку
                                            </Button>
                                        </Upload>,
                                    )}
                                </Form.Item>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <Row>
                                <Col lg={12}>
                                    <Form.Item label="Основной цвет">
                                        {getFieldDecorator('setting-main-color', {
                                            rules: [{ required: false }],
                                            initialValue: mainColor
                                        })(
                                            <ChromePicker disableAlpha color={mainColor} onChange={color => this.onChangeColor('mainColor', color)} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col lg={12}>
                                    <Form.Item label="Дополнительный цвет">
                                        {getFieldDecorator('setting-second-color', {
                                            rules: [{ required: false }],
                                            initialValue: secondColor
                                        })(
                                            <ChromePicker disableAlpha color={secondColor} onChange={color => this.onChangeColor('secondColor', color)} />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={12}>
                            <Form.Item label="Код виджета">
                                <SyntaxHighlighter language="htmlbars" wrapLongLines style={codeTheme} customStyle={{ lineHeight: 1.5 }}>
{`<div id="vpriem-root-${rootElemID}"></div>
<script type="text/javascript" src="https://module.vpriem.ru/widget.js"></script>
<script>
    vpriemInitWidget({
        rootElemID: 'vpriem-root-${rootElemID}',
        colors: { primary: "${mainColor}", second: "${secondColor}" },
        token: '${data ? data.token_widget : ''}',
        params: {}
    });
</script>`}
                                </SyntaxHighlighter>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={15}>
                        <Col lg={8}>
                            <Divider>Интеграция c VK Mini Apps</Divider>
                            <Form.Item label="Секретный ключ приложения">
                                {getFieldDecorator('setting-secret-vk', {
                                    rules: [{ required: false }],
                                    initialValue: data && data.vk_secret ? data.vk_secret : ''
                                })(
                                    <Input placeholder="mYXNIR3YF6gvrxnD91vY" />
                                )}
                            </Form.Item>
                        </Col>
                        <Col lg={8}>
                            <Divider>Настройки уведомлений</Divider>
                            <Form.Item label="Почта для заявок">
                                {getFieldDecorator('setting-mails-recipients', {
                                    rules: [{ required: false }],
                                    initialValue: data && data.mail_recipients ? data.mail_recipients : ''
                                })(
                                    <Input placeholder="info@vpriem.ru" />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={15}>
                        <Col span={24} style={{ textAlign: 'center', margin: '30px 0' }}>
                            <Button htmlType="submit" type="primary" size="large" onClick={() => this.onSubmit()} loading={loading}>
                                Сохранить
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </section>
        );
    }
}

SettingsAppPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    settings: state.settings,
    auth: state.auth,
    ws: state.ws
});

const wrapper = compose(
    connect(mapStateToProps),
    Form.create(),
    WrapperContent
);

export default wrapper(SettingsAppPage);
