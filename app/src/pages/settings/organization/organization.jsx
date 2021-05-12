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
    Button,
    Icon,
    Tabs,
    Upload,
    Select
} from 'antd';
import moment from 'moment';

import { SETTINGS_ORGANIZATION_ROUTE } from '../../../constans/routes';
import WrapperContent from '../../../components/WrapperContent';
import Preloader from '../../../components/Preloader';
import { getSettingsOrganizationAction, updateSettingsOrganizationAction } from './actions';
import './style.scss';

moment.locale('ru');

const { Option } = Select;
const { TabPane } = Tabs;

class SettingsOrganizationPage extends Component {
    static pathPage = SETTINGS_ORGANIZATION_ROUTE;

    static namePage = 'Настройки организации';

    state = {
        type: 1,
        urBasedName: null,
    }

    componentDidMount() {
        const { dispatch, auth } = this.props;
        dispatch(getSettingsOrganizationAction(auth.token));
    }

    onSubmit = () => {
        const { form, dispatch, auth } = this.props;
        const { type } = this.state;
        const { token } = auth;

        form.validateFields((err, values) => {
            if (!err) {
                dispatch(updateSettingsOrganizationAction({ ...values, type }, token));
            }
        });
    }

    onTabs = (key) => {
        this.setState({ type: +key });
    }

    onSelect = (name, value) => {
        // console.log(name, value);
    }

    copyAddress = (fromField, toField) => {
        const { form } = this.props;
        form.setFieldsValue({ [toField]: form.getFieldValue(fromField) });
    }

    render() {
        const {
            organization,
            form
        } = this.props;
        const { urBasedName } = this.state;
        const { loading, data } = organization;
        const { getFieldDecorator, getFieldValue } = form;
        const notEdit = Boolean(data && +data.type);

        if (loading && data === null) {
            return (
                <div className="settings page">
                    <Preloader />
                </div>
            );
        }

        return (
            <section className="settings page">
                <Tabs defaultActiveKey="1" onChange={this.onTabs}>
                    <TabPane tab="Юр. лицо" key="1">
                        <Form className="settings__form">
                            <Row gutter={15}>
                                <Col span={24}>
                                    <Divider>Основная информация</Divider>
                                </Col>
                                <Col lg={8}>
                                    <Form.Item label="Краткое наименование">
                                        {getFieldDecorator('ur-short-name', {
                                            rules: [{ required: true, message: 'Заполните поле' }],
                                            initialValue: data && data.short_name ? data.short_name : ''
                                        })(
                                            <Input placeholder="ООО «‎ВедёмПриём»" disabled={notEdit} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col lg={8}>
                                    <Form.Item label="Полное наименование">
                                        {getFieldDecorator('ur-name', {
                                            rules: [{ required: true, message: 'Заполните поле' }],
                                            initialValue: data && data.name ? data.name : ''
                                        })(
                                            <Input placeholder="Общество с ограниченной ответственностью «‎ВедёмПриём»" disabled={notEdit} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col lg={8}>
                                    <Form.Item label="Телефон">
                                        {getFieldDecorator('ur-phone', {
                                            rules: [{ required: true, message: 'Заполните поле' }],
                                            initialValue: data && data.phone ? data.phone : ''
                                        })(
                                            <Input placeholder="8 (800) 201-61-37" disabled={notEdit} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col lg={12}>
                                    <Form.Item label="Юридический адрес">
                                        {getFieldDecorator('ur-address', {
                                            rules: [{ required: true, message: 'Заполните поле' }],
                                            initialValue: data && data.ur_address ? data.ur_address : ''
                                        })(
                                            <Input placeholder="160000, г. Вологда, ул. Ленина, д. 11, эт. 3, офис 306" disabled={notEdit} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col lg={12}>
                                    <Form.Item label="Почтовый адрес">
                                        {getFieldDecorator('ur-post-address', {
                                            rules: [{ required: true, message: 'Заполните поле' }],
                                            initialValue: data && data.post_address ? data.post_address : ''
                                        })(
                                            <Input placeholder="160000, г. Вологда, ул. Ленина, д. 11, эт. 3, офис 306" disabled={notEdit} />
                                        )}
                                        <Button type="link" style={{ padding: 0 }} onClick={() => this.copyAddress('ur-address', 'ur-post-address')} disabled={notEdit}>Совпадает с юр. адресом</Button>
                                    </Form.Item>
                                </Col>
                                <Col lg={8}>
                                    <Form.Item label="ИНН">
                                        {getFieldDecorator('ur-inn', {
                                            rules: [{ required: true, message: 'Заполните поле' }],
                                            initialValue: data && data.inn ? data.inn : ''
                                        })(
                                            <Input placeholder="3525455331" disabled={notEdit} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col lg={8}>
                                    <Form.Item label="КПП">
                                        {getFieldDecorator('ur-kpp', {
                                            rules: [{ required: true, message: 'Заполните поле' }],
                                            initialValue: data && data.kpp ? data.kpp : ''
                                        })(
                                            <Input placeholder="352501001" disabled={notEdit} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col lg={8}>
                                    <Form.Item label="ОГРН">
                                        {getFieldDecorator('ur-ogrn', {
                                            rules: [{ required: true, message: 'Заполните поле' }],
                                            initialValue: data && data.ogrn ? data.ogrn : ''
                                        })(
                                            <Input placeholder="1203500006445" disabled={notEdit} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Divider>Подписант</Divider>
                                </Col>
                                <Col lg={8}>
                                    <Form.Item label="Предстватиель организации">
                                        {getFieldDecorator('ur-representative-type', {
                                            rules: [{ required: true, message: 'Заполните поле' }],
                                            initialValue: data && data.representative_type ? +data.representative_type : undefined
                                        })(
                                            <Select onChange={(value => this.onSelect('ur-representative-type', value))} placeholder="Выберите представителя" disabled={notEdit}>
                                                <Option value={1}>Единоличный исполнителнительный орган</Option>
                                                <Option value={2}>Доверенное лицо (На основании доверенности)</Option>
                                                <Option value={3}>Коллегиальный исполнительный орган</Option>
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                {getFieldValue('ur-representative-type') !== undefined && +getFieldValue('ur-representative-type') === 2 ? (
                                    <>
                                        <Col lg={8}>
                                            <Form.Item label="Должность представителя">
                                                {getFieldDecorator('ur-representative-position', {
                                                    rules: [{ required: true, message: 'Заполните поле' }],
                                                    initialValue: data && data.representative_position ? data.representative_position : ''
                                                })(
                                                    <Input placeholder="Генеральный директор" disabled={notEdit} />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col lg={8}>
                                            <Form.Item label="На основании">
                                                {getFieldDecorator('ur-based', {
                                                    rules: [{ required: true, message: 'Заполните поле' }],
                                                    initialValue: data && data.based ? data.based : ''
                                                })(
                                                    <Upload beforeUpload={(file) => {
                                                        this.setState({ urBasedName: file.name });
                                                        return false;
                                                    }}
                                                    >
                                                        <Button disabled={notEdit}>
                                                            <Icon type="upload" />
                                                            {urBasedName || 'Загрузить'}
                                                        </Button>
                                                    </Upload>
                                                )}
                                            </Form.Item>
                                        </Col>
                                    </>
                                ) : null}
                                <Col span={24}>
                                    <Divider>Банковские реквизиты</Divider>
                                </Col>
                                <Col lg={6}>
                                    <Form.Item label="БИК">
                                        {getFieldDecorator('ur-bik', {
                                            rules: [{ required: true, message: 'Заполните поле' }],
                                            initialValue: data && data.bik ? data.bik : ''
                                        })(
                                            <Input placeholder="044525974" disabled={notEdit} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col lg={6}>
                                    <Form.Item label="Наименование банка">
                                        {getFieldDecorator('ur-bank', {
                                            rules: [{ required: true, message: 'Заполните поле' }],
                                            initialValue: data && data.bank ? data.bank : ''
                                        })(
                                            <Input placeholder="АО «Тинькофф Банк»" disabled={notEdit} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col lg={6}>
                                    <Form.Item label="Корреспондентский счёт">
                                        {getFieldDecorator('ur-сorrespondent-number', {
                                            rules: [{ required: true, message: 'Заполните поле' }],
                                            initialValue: data && data.сorrespondent_number ? data.сorrespondent_number : ''
                                        })(
                                            <Input placeholder="30101810145250000974" disabled={notEdit} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col lg={6}>
                                    <Form.Item label="Расчётный счёт">
                                        {getFieldDecorator('ur-payment-number', {
                                            rules: [{ required: true, message: 'Заполните поле' }],
                                            initialValue: data && data.payment_number ? data.payment_number : ''
                                        })(
                                            <Input placeholder="30232810100000000004" disabled={notEdit} />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Divider>Закрывающие документы</Divider>
                                </Col>
                                <Col lg={8}>
                                    <Form.Item label="Способ получения">
                                        {getFieldDecorator('ur-getting-type', {
                                            rules: [{ required: true, message: 'Заполните поле' }],
                                            initialValue: data && data.getting_type ? +data.getting_type : undefined
                                        })(
                                            <Select onChange={(value => this.onSelect('ur-getting-type', value))} placeholder="Выберите способ" disabled={notEdit}>
                                                <Option value={1}>В офисе</Option>
                                                <Option value={2}>По почте</Option>
                                                <Option value={3} disabled>ЭДО</Option>
                                                <Option value={4}>Не требуется</Option>
                                            </Select>
                                        )}
                                        {getFieldValue('ur-getting-type') !== undefined && +getFieldValue('ur-getting-type') === 1 ? <span>Офис по адресу: г. Вологда, ул. Ленина, д. 11, эт. 3, офис 306</span> : null}
                                    </Form.Item>
                                </Col>
                                {getFieldValue('ur-getting-type') !== undefined && +getFieldValue('ur-getting-type') === 2 ? (
                                    <Col lg={8}>
                                        <Form.Item label="Адрес получения">
                                            {getFieldDecorator('ur-address-docs', {
                                                rules: [{ required: true, message: 'Заполните поле' }],
                                                initialValue: data && data.docs_address ? data.docs_address : ''
                                            })(
                                                <Input placeholder="160000, г. Вологда, ул. Ленина, д. 11, эт. 3, офис 306" disabled={notEdit} />
                                            )}
                                            <Button type="link" style={{ padding: 0 }} onClick={() => this.copyAddress('ur-post-address', 'ur-address-docs')}>Совпадает с почтовым адресом</Button>
                                        </Form.Item>
                                    </Col>
                                ) : null}
                                {!notEdit ? (
                                    <Col span={24} style={{ textAlign: 'center', margin: '30px 0' }}>
                                        <Button htmlType="submit" type="primary" size="large" onClick={() => this.onSubmit()} loading={loading}>
                                            Сохранить
                                        </Button>
                                    </Col>
                                ) : null}
                            </Row>
                        </Form>
                    </TabPane>
                    <TabPane tab="Физ. лицо" disabled key="2">В разработке...</TabPane>
                </Tabs>
            </section>
        );
    }
}

SettingsOrganizationPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    organization: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    organization: state.organization,
    auth: state.auth,
    ws: state.ws
});

const wrapper = compose(
    connect(mapStateToProps),
    Form.create(),
    WrapperContent
);

export default wrapper(SettingsOrganizationPage);
