/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Layout,
    Menu,
    Button,
    Typography,
    Tooltip,
    Tag,
    Icon,
    Dropdown
} from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';

import {
    ROUTERS_MENU_MAP,
    SCHEDULE_ROUTE,
    SETTINGS_APP_ROUTE,
    SETTINGS_ORGANIZATION_ROUTE,
    TARIFFS_ROUTE,
    PAYMENTS_HISTORY_ROUTE,
    REFERAL_ROUTE,
    HELP_ROUTE
} from '../constans/routes';
import { logOutAction } from '../pages/login/actions';
import { getSettingsAction } from '../pages/settings/app/actions';
import { WritesNotification } from './WritesNotification';

const { Header: HeaderAnt } = Layout;
const { SubMenu } = Menu;
const { Text } = Typography;


class Header extends React.Component {
    componentDidMount() {
        const { auth, dispatch } = this.props;
        dispatch(getSettingsAction(auth.token));
    }

    getAccountName = () => {
        const { auth } = this.props;
        const { user } = auth;

        if (user.id === 1) {
            return '🦄';
        }

        const emailLogin = user.email.split('@')[0];
        const accountName = emailLogin.split('.');

        if (accountName.length === 1) return accountName[0][0];

        return `${accountName[0][0]}${accountName[accountName.length - 1][0]}`;
    }

    getTariffInfo = () => {
        const { auth } = this.props;
        const { tariff } = auth;
        const dataTariff = {
            color: '',
            label: tariff.label,
            text: ''
        };

        switch (tariff.label) {
            case 'ОПЛАЧЕН':
                dataTariff.color = 'green';
                dataTariff.text = <>Оплачен до: <strong>{moment(+tariff.dateEnd).format('DD.MM.YYYY')}</strong></>;
                break;
            case 'НЕ ОПЛАЧЕН':
                dataTariff.color = 'red';
                break;
            case 'TRIAL':
                dataTariff.color = 'orange';
                dataTariff.text = <>Пробный период до: <strong>{moment(+tariff.dateEnd).format('DD.MM.YYYY')}</strong></>;
                break;
            default:
                break;
        }

        return dataTariff;
    }

    render() {
        const { auth, dispatch, settings } = this.props;
        const { user, tariff } = auth;
        const { data: settingsData } = settings;
        const { pathname } = window.location;
        const logo = '//schedule-dist.redken.online/v1/admin/assets/logo.png';
        const organization = settingsData ? settingsData.organization : 'ВедёмПриём';

        const menu = (
            <Menu
                theme="light"
                mode="horizontal"
                style={{ lineHeight: '64px' }}
                className="header__left_menu"
                overflowedIndicator={<Icon type="menu" />}
            >
                {Object.keys(ROUTERS_MENU_MAP).map((route) => {
                    let childrens = ROUTERS_MENU_MAP[route].childrens !== null
                                    ? Object.keys(ROUTERS_MENU_MAP[route].childrens).map((child) => {
                                            if (ROUTERS_MENU_MAP[route].childrens[child].permissions.length && auth.permissions[ROUTERS_MENU_MAP[route].childrens[child].permissions[0]]) {
                                                return (
                                                    <Menu.Item key={child} disabled={!tariff.active}>
                                                        <Link to={child}>
                                                            <Icon type={ROUTERS_MENU_MAP[route].childrens[child].icon} />
                                                            {ROUTERS_MENU_MAP[route].childrens[child].name}
                                                        </Link>
                                                    </Menu.Item>
                                                );
                                            }
                                            if (!ROUTERS_MENU_MAP[route].childrens[child].permissions.length) {
                                                return (
                                                    <Menu.Item key={child} disabled={!tariff.active}>
                                                        <Link to={child}>
                                                            <Icon type={ROUTERS_MENU_MAP[route].childrens[child].icon} />
                                                            {ROUTERS_MENU_MAP[route].childrens[child].name}
                                                        </Link>
                                                    </Menu.Item>
                                                );
                                            }
                                            return null;
                                        })
                                    : null;
                    if (childrens !== null) {
                        childrens = childrens.filter(child => child !== null);
                        if (childrens.length) {
                            return (
                                <SubMenu key={route} title={(<span><Icon type={ROUTERS_MENU_MAP[route].icon} />{ROUTERS_MENU_MAP[route].name}</span>)} disabled={!tariff.active} className={ROUTERS_MENU_MAP[route].selector}>
                                    {childrens}
                                </SubMenu>
                            );
                        }
                        return null;
                    }
                    if (ROUTERS_MENU_MAP[route].permissions.length && auth.permissions[ROUTERS_MENU_MAP[route].permissions[0]] && ROUTERS_MENU_MAP[route].public) {
                        return <Menu.Item key={route} disabled={!tariff.active} className={ROUTERS_MENU_MAP[route].selector}><Link to={route} key={route}><Icon type={ROUTERS_MENU_MAP[route].icon} />{ROUTERS_MENU_MAP[route].name}</Link></Menu.Item>;
                    }
                    if (!ROUTERS_MENU_MAP[route].permissions.length && ROUTERS_MENU_MAP[route].public) {
                        return <Menu.Item key={route} disabled={!tariff.active} className={ROUTERS_MENU_MAP[route].selector}><Link to={route} key={route}><Icon type={ROUTERS_MENU_MAP[route].icon} />{ROUTERS_MENU_MAP[route].name}</Link></Menu.Item>;
                    }
                    return null;
                })}
            </Menu>
        );

        const menuUser = (
            <Menu>
                <p style={{
                    padding: '5px 12px',
                    margin: 0,
                    fontSize: '0.8rem',
                    color: '#59b13f'
                }}
                >
                    {user.email}
                </p>
                <Menu.Item>
                    <Link to={TARIFFS_ROUTE}><Icon type="appstore" />&nbsp;&nbsp;Тарифы</Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to={SETTINGS_ORGANIZATION_ROUTE}><Icon type="audit" />&nbsp;&nbsp;Реквизиты организации</Link>
                </Menu.Item>
                {auth.permissions['pages/payments/history'] ? (
                    <Menu.Item>
                        <Link to={PAYMENTS_HISTORY_ROUTE}><Icon type="history" />&nbsp;&nbsp;История платежей</Link>
                    </Menu.Item>
                ) : null}
                {auth.permissions['pages/referal'] ? (
                    <Menu.Item>
                        <Link to={REFERAL_ROUTE}><Icon type="gift" />&nbsp;&nbsp;Реферальная система</Link>
                    </Menu.Item>
                ) : null}
                <Menu.Item disabled={!tariff.active}>
                    {tariff.active ? <Link to={SETTINGS_APP_ROUTE}><Icon type="control" />&nbsp;&nbsp;Настройки приложения</Link> : 'Настройки приложения'}
                </Menu.Item>
                <Menu.Item>
                    <Link to={HELP_ROUTE}><Icon type="alert" />&nbsp;&nbsp;Помощь</Link>
                </Menu.Item>
                <Menu.Item onClick={() => dispatch(logOutAction())}>
                    <Button type="link" size="small" shape="circle" icon="poweroff" style={{ color: '#ff4d4f' }}>Выйти</Button>
                </Menu.Item>
            </Menu>
        );
        const account = this.getAccountName();
        const tariffInfo = this.getTariffInfo();

        return (
            <HeaderAnt className="header">
                <div className="header__left">
                    {tariff.active ? (
                        <Link to={SCHEDULE_ROUTE}>
                            <img className="header__left_logo" src={logo} alt={organization} />
                        </Link>
                    ) : (
                        <img className="header__left_logo" src={logo} alt={organization} />
                    )}
                    {menu}
                </div>
                <div className="header__right">
                    <div className="header__right_tariff">
                        {tariffInfo.text !== '' ? (
                            <Tooltip placement="left" title={tariffInfo.text}>
                                <Link to={TARIFFS_ROUTE}>
                                    <Tag color={tariffInfo.color} style={{ cursor: 'pointer' }}>{tariffInfo.label}</Tag>
                                </Link>
                            </Tooltip>
                        ) : (
                            <Link to={TARIFFS_ROUTE}>
                                <Tag color={tariffInfo.color} style={{ cursor: 'pointer' }}>{tariffInfo.label}</Tag>
                            </Link>
                        )}
                    </div>
                    {pathname.search(SCHEDULE_ROUTE) !== -1 ? <WritesNotification /> : null}
                    <Dropdown overlay={menuUser} trigger={['click', 'hover']}>
                        <div className="header__right_name">
                            <span>{account}</span>
                        </div>
                    </Dropdown>
                </div>
            </HeaderAnt>
        );
    }
}

Header.propTypes = {
    auth: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    settings: state.settings
});

export default connect(mapStateToProps)(Header);
