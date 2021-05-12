import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { useHistory } from 'react-router-dom';
import {
    Typography,
    Icon,
    Alert,
    Steps,
    Tooltip,
    Form,
    Input,
    Button,
    InputNumber,
    Popover
} from 'antd';

import { TARIFFS_ROUTE } from '../../constans/routes';
import WrapperContent from '../../components/WrapperContent';
import Preloader from '../../components/Preloader';
import { numWord, gradeNumber } from '../../helpers';
import {
    getTariffsAction,
    changeTariffAction,
    selectPaymentAction
} from './actions';
import { getWorkersAction } from '../dictionary/workers/actions';
import './style.scss';

const { Title } = Typography;
const { Step } = Steps;

class TariffsPage extends Component {
    static pathPage = TARIFFS_ROUTE;

    static namePage = 'Тарифы';

    state = {
        pane: 'selectTariff',
        paymentType: ''
    }

    componentDidMount() {
        const { dispatch, auth } = this.props;
        const { tariff } = auth;

        if (tariff.id !== 1 && tariff.active) {
            this.setState({ pane: 'tariffInfo' });
        }

        dispatch(getWorkersAction('', auth.token));
        dispatch(getTariffsAction(auth.token));
    }

    componentDidUpdate(prevProps) {
        const { workers, dispatch } = this.props;
        const { data } = workers;
        const { workers: prevWorkers } = prevProps;
        const { data: prevData } = prevWorkers;

        if (prevData === null && data) {
            const countDoctors = data.filter(item => +item.type_id === 2).length;
            if (countDoctors > 5) dispatch(changeTariffAction('factorWorkers', 2));
            if (countDoctors > 10) dispatch(changeTariffAction('factorWorkers', 3));
            if (countDoctors > 20) dispatch(changeTariffAction('factorWorkers', 4));
            if (countDoctors > 50) dispatch(changeTariffAction('factorWorkers', 'custom'));
        }
    }

    onChangeWorkers = (factor) => {
        const { dispatch } = this.props;
        dispatch(changeTariffAction('factorWorkers', factor));
    }

    onSelectTariff = (id) => {
        const { dispatch } = this.props;
        this.setState({ pane: 'selectPayment' });
        dispatch(changeTariffAction('tariffID', id));
    }

    onSelectPayment = (type) => {
        const { tariffs, dispatch, auth } = this.props;
        const { selected } = tariffs;
        this.setState({ pane: 'enterEmail', paymentType: type });

        // if (type === 'by_card') {
        //     this.setState({ pane: 'paymentByCard', paymentType: type });
        // } else if (type === 'by_invoice') {
        //     this.setState({ pane: 'paymentByInvoice', paymentType: type });
        //     dispatch(selectPaymentAction(type, selected, {}, auth.token));
        // }
    }

    factorToWorkersText = (factor) => {
        const { auth } = this.props;
        const { tariff } = auth;
        switch (factor) {
            case 1: return '5';
            case 2: return '10';
            case 3: return '20';
            case 4: return '50';
            case 'custom': return tariff.countWorkers;
            default: return '∞';
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {
            tariffs,
            dispatch,
            auth,
            form,
            history
        } = this.props;
        const { paymentType } = this.state;
        const { selected } = tariffs;

        form.validateFields((err, values) => {
            if (!err) {
                if (paymentType === 'by_card') {
                    history.push('/payments/redirect');
                }
                dispatch(selectPaymentAction(paymentType, selected, values, auth.token));
            }
        });
    };

    render() {
        const {
            tariffs,
            workers,
            auth,
            form
        } = this.props;
        const { data, loading, selected } = tariffs;
        const { getFieldDecorator } = form;
        const { data: dataWorkers, loading: loadingWorkers } = workers;
        const { tariff: currentTariff } = auth;
        const { pane, paymentType } = this.state;
        const isMobile = window.matchMedia('(max-width: 767px)').matches;

        if ((loading || data === null) || (loadingWorkers || dataWorkers === null)) {
            return (
                <div className="tariffs page">
                    <Preloader />
                </div>
            );
        }

        const countDoctors = dataWorkers ? dataWorkers.filter(item => +item.type_id === 2).length : 0;

        switch (pane) {
            case 'selectTariff': {
                return (
                    <section className="tariffs page">
                        {!currentTariff.active ? (
                            <Alert
                                message="Тарифный план истёк."
                                description={`Действие вашего тарифного плана истекло. ${currentTariff.id === 1 ? 'Выберите новый тарифный план.' : 'Выберите новый тарифный план или продлите текущий.'}`}
                                showIcon
                                type="warning"
                            />
                        ) : null}
                        <Steps progressDot current={0} className="tariffs_steps" direction={isMobile ? 'vertical' : 'horizontal'}>
                            <Step title="Выбор тарифа" />
                            <Step title="Способ оплаты" />
                            <Step title="Завершение оплаты" />
                        </Steps>
                        <Title level={4} className="tariffs__select-workers_title">Выберите количество специалистов</Title>
                        <div className="tariffs__select-workers">
                            {countDoctors <= 5 ? (
                                <button
                                    type="button"
                                    onClick={countDoctors <= 5 ? () => this.onChangeWorkers(1) : null}
                                    className={`tariffs__select-workers_item ${selected.factorWorkers === 1 && countDoctors <= 5 ? 'active' : ''} ${countDoctors > 5 ? 'disabled' : ''}`}
                                >
                                    До 5
                                </button>
                            ) : (
                                <Tooltip placement="bottom" title={`Этот тариф недоступен, поскольку у Вас на данный момент заведено ${countDoctors} специалистов в расписании. Выберите расширенный тариф или измените колличество специалистов в расписании.`}>
                                    <button
                                        type="button"
                                        onClick={countDoctors <= 5 ? () => this.onChangeWorkers(1) : null}
                                        className={`tariffs__select-workers_item ${selected.factorWorkers === 1 && countDoctors <= 5 ? 'active' : ''} ${countDoctors > 5 ? 'disabled' : ''}`}
                                    >
                                        До 5
                                    </button>
                                </Tooltip>
                            )}
                            {countDoctors <= 10 ? (
                                <button
                                    type="button"
                                    onClick={countDoctors <= 10 ? () => this.onChangeWorkers(2) : null}
                                    className={`tariffs__select-workers_item ${selected.factorWorkers === 2 && countDoctors <= 10 ? 'active' : ''} ${countDoctors > 10 ? 'disabled' : ''}`}
                                >
                                    До 10
                                </button>
                            ) : (
                                <Tooltip placement="bottom" title={`Этот тариф недоступен, поскольку у Вас на данный момент заведено ${countDoctors} специалистов в расписании. Выберите расширенный тариф или измените колличество специалистов в расписании.`}>
                                    <button
                                        type="button"
                                        onClick={countDoctors <= 10 ? () => this.onChangeWorkers(2) : null}
                                        className={`tariffs__select-workers_item ${selected.factorWorkers === 2 && countDoctors <= 10 ? 'active' : ''} ${countDoctors > 10 ? 'disabled' : ''}`}
                                    >
                                        До 10
                                    </button>
                                </Tooltip>
                            )}
                            {countDoctors <= 20 ? (
                                <button
                                    type="button"
                                    onClick={countDoctors <= 20 ? () => this.onChangeWorkers(3) : null}
                                    className={`tariffs__select-workers_item ${selected.factorWorkers === 3 && countDoctors <= 20 ? 'active' : ''} ${countDoctors > 20 ? 'disabled' : ''}`}
                                >
                                    До 20
                                </button>
                            ) : (
                                <Tooltip placement="bottom" title={`Этот тариф недоступен, поскольку у Вас на данный момент заведено ${countDoctors} специалистов в расписании. Выберите расширенный тариф или измените колличество специалистов в расписании.`}>
                                    <button
                                        type="button"
                                        onClick={countDoctors <= 20 ? () => this.onChangeWorkers(3) : null}
                                        className={`tariffs__select-workers_item ${selected.factorWorkers === 3 && countDoctors <= 20 ? 'active' : ''} ${countDoctors > 20 ? 'disabled' : ''}`}
                                    >
                                        До 20
                                    </button>
                                </Tooltip>
                            )}
                            {countDoctors <= 50 ? (
                                <button
                                    type="button"
                                    onClick={countDoctors <= 50 ? () => this.onChangeWorkers(4) : null}
                                    className={`tariffs__select-workers_item ${selected.factorWorkers === 4 && countDoctors <= 50 ? 'active' : ''} ${countDoctors > 50 ? 'disabled' : ''}`}
                                >
                                    До 50
                                </button>
                            ) : (
                                <Tooltip placement="bottom" title={`Этот тариф недоступен, поскольку у Вас на данный момент заведено ${countDoctors} специалистов в расписании. Выберите расширенный тариф или измените колличество специалистов в расписании.`}>
                                    <button
                                        type="button"
                                        onClick={countDoctors <= 50 ? () => this.onChangeWorkers(4) : null}
                                        className={`tariffs__select-workers_item ${selected.factorWorkers === 4 && countDoctors <= 50 ? 'active' : ''} ${countDoctors > 50 ? 'disabled' : ''}`}
                                    >
                                        До 50
                                    </button>
                                </Tooltip>
                            )}
                            <button type="button" onClick={() => this.onChangeWorkers('custom')} className={`tariffs__select-workers_item ${selected.factorWorkers === 'custom' ? 'active' : ''}`}>Персональный</button>
                        </div>
                        {selected.factorWorkers !== 'custom' ? (
                            <div className="tariffs__items">
                                {data.map((tariff) => {
                                    if ((currentTariff.id === 1 && tariff.id === currentTariff.id && !currentTariff.active) || (currentTariff.id !== 1 && tariff.id === 1)) return null;
                                    if (tariff.type === 'by_workers') {
                                        return (
                                            <div className="tariffs__items__tariff" key={tariff.id}>
                                                <div className="tariffs__items__tariff__period">
                                                    <span className="tariffs__items__tariff__period_priced">{tariff.name}</span>
                                                    {tariff.gift_months ? (
                                                        <span className="tariffs__items__tariff__period_gift">
                                                            +&nbsp;
                                                            {tariff.gift_months}
                                                            &nbsp;
                                                            {numWord(tariff.gift_months, ['месяц', 'месяца', 'месяцев'])}
                                                            &nbsp;в подарок
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <span className="tariffs__items__tariff_price">
                                                    {tariff.price * selected.factorWorkers}
                                                    &nbsp;₽*&nbsp;
                                                    <span>
                                                        в месяц
                                                    </span>
                                                </span>
                                                <div className="tariffs__items__tariff__total">
                                                    {tariff.gift_months ? (
                                                        <span className="tariffs__items__tariff__total_old">
                                                            {gradeNumber(((tariff.price * selected.factorWorkers) * (tariff.months + tariff.gift_months)) * 2)}
                                                            &nbsp;₽*
                                                        </span>
                                                    ) : null}
                                                    <span className="tariffs__items__tariff__total_price">
                                                        {gradeNumber((tariff.price * selected.factorWorkers) * (tariff.months + tariff.gift_months))}
                                                        &nbsp;₽* за&nbsp;
                                                        {tariff.months + tariff.gift_months}
                                                        &nbsp;
                                                        {numWord(tariff.months + tariff.gift_months, ['месяц', 'месяца', 'месяцев'])}
                                                    </span>
                                                </div>
                                                {tariff.id !== 1 ? <button type="button" onClick={() => this.onSelectTariff(tariff.id)} className="tariffs__items__tariff_select">Выбрать</button> : <button type="button" disabled className="tariffs__items__tariff_select current">Активен</button>}
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        ) : (
                            <>
                                <div className="tariffs__items">
                                    {data.map((tariff) => {
                                        if ((currentTariff.id === 1 && tariff.id === currentTariff.id && !currentTariff.active) || (currentTariff.id !== 1 && tariff.id === 1)) return null;
                                        if (tariff.type === 'by_workers_custom') {
                                            return (
                                                <div className="tariffs__items__tariff" key={tariff.id}>
                                                    <div className="tariffs__items__tariff__period">
                                                        <span className="tariffs__items__tariff__period_priced">{tariff.name}</span>
                                                        {tariff.gift_months ? (
                                                            <span className="tariffs__items__tariff__period_gift">
                                                                +&nbsp;
                                                                {tariff.gift_months}
                                                                &nbsp;
                                                                {numWord(tariff.gift_months, ['месяц', 'месяца', 'месяцев'])}
                                                                &nbsp;в подарок
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                    <span className="tariffs__items__tariff_price">
                                                        {tariff.price}
                                                        &nbsp;₽&nbsp;
                                                        <span>
                                                            в месяц
                                                        </span>
                                                    </span>
                                                    <div className="tariffs__items__tariff__total">
                                                        {tariff.gift_months ? (
                                                            <span className="tariffs__items__tariff__total_old">
                                                                {gradeNumber(tariff.price * (tariff.months + tariff.gift_months))}
                                                                &nbsp;₽
                                                            </span>
                                                        ) : null}
                                                        <span className="tariffs__items__tariff__total_price">
                                                            {gradeNumber(tariff.price * tariff.months)}
                                                            &nbsp;₽ за&nbsp;
                                                            {tariff.months + tariff.gift_months}
                                                            &nbsp;
                                                            {numWord(tariff.months + tariff.gift_months, ['месяц', 'месяца', 'месяцев'])}
                                                        </span>
                                                    </div>
                                                    {tariff.id !== 1 ? <button type="button" onClick={() => this.onSelectTariff(tariff.id)} className="tariffs__items__tariff_select">Выбрать</button> : <button type="button" disabled className="tariffs__items__tariff_select current">Активен</button>}
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                                <Title level={4} className="tariffs__select-workers_title">Расчитать персональный тарифный план:</Title>
                                <Form onSubmit={this.handleSubmit} className="tariffs__form">
                                    <Form.Item label="Кол-во сотрудников">
                                        {getFieldDecorator('count_workers', {
                                            rules: [{ required: true, message: 'Заполните поле!' }],
                                            initialValue: 100
                                        })(
                                            <InputNumber
                                                placeholder="Кол-во"
                                                min={55}
                                            />,
                                        )}
                                    </Form.Item>
                                    <Button type="primary" htmlType="submit" className="tariffs__form_btn">Отправить заявку</Button>
                                </Form>
                            </>
                        )}
                    </section>
                );
            }
            case 'tariffInfo': {
                let bonusReferal = null;
                if (currentTariff.referalBonuses && currentTariff.referalBonuses[0].availibleTariffs.includes(currentTariff.id)) {
                    let operation = '';
                    switch (currentTariff.referalBonuses[0].operation) {
                        case 'multiply':
                            operation = 'x';
                            break;
                        case 'increment':
                            operation = '+';
                            break;
                        default:
                            break;
                    }
                    bonusReferal = (
                        <>
                            &nbsp;
                            {`${operation}${currentTariff.referalBonuses[0].operationValue}`}
                            &nbsp;
                            <Popover placement="top" title="Награда за регистрацию по реферальной ссылке" content={currentTariff.referalBonuses[0].name} trigger="hover">
                                <Icon type="question-circle" className="tariffs__items__tariff__period_bonus-referal" />
                            </Popover>
                        </>
                    );
                }
                return (
                    <section className="tariffs page">
                        <Title level={3} className="tariffs__select-workers_title">
                            Ваш тарифный план:
                            <br />
                            <span>{`«${currentTariff.name}»`}</span>
                        </Title>
                        <Title level={4} className="tariffs__select-workers_title">
                            Доступно сотрудников:
                            <br />
                            <span>{currentTariff.countWorkers}</span>
                        </Title>
                        <div className="tariffs__items">
                            {data.map((tariff) => {
                                if (tariff.id === currentTariff.id) {
                                    if (tariff.type === 'by_workers') {
                                        return (
                                            <div className="tariffs__items__tariff" key={tariff.id}>
                                                <div className="tariffs__items__tariff__period">
                                                    <span className="tariffs__items__tariff__period_priced">
                                                        {tariff.name}
                                                        {bonusReferal}
                                                    </span>
                                                    {tariff.gift_months ? (
                                                        <span className="tariffs__items__tariff__period_gift">
                                                            +&nbsp;
                                                            {tariff.gift_months}
                                                            &nbsp;
                                                            {numWord(tariff.gift_months, ['месяц', 'месяца', 'месяцев'])}
                                                            &nbsp;в подарок
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <span className="tariffs__items__tariff_price">
                                                    {tariff.price * selected.factorWorkers}
                                                    &nbsp;₽*&nbsp;
                                                    <span>
                                                        в месяц
                                                    </span>
                                                </span>
                                                <div className="tariffs__items__tariff__total">
                                                    {tariff.gift_months ? (
                                                        <span className="tariffs__items__tariff__total_old">
                                                            {gradeNumber(((tariff.price * selected.factorWorkers) * (tariff.months + tariff.gift_months)) * 2)}
                                                            &nbsp;₽*
                                                        </span>
                                                    ) : null}
                                                    <span className="tariffs__items__tariff__total_price">
                                                        {gradeNumber((tariff.price * selected.factorWorkers) * (tariff.months + tariff.gift_months))}
                                                        &nbsp;₽* за&nbsp;
                                                        {tariff.months + tariff.gift_months}
                                                        &nbsp;
                                                        {numWord(tariff.months + tariff.gift_months, ['месяц', 'месяца', 'месяцев'])}
                                                    </span>
                                                </div>
                                                <button type="button" disabled className="tariffs__items__tariff_select current">Активен</button>
                                            </div>
                                        );
                                    }
                                    return (
                                        <div className="tariffs__items__tariff" key={tariff.id}>
                                            <div className="tariffs__items__tariff__period">
                                                <span className="tariffs__items__tariff__period_priced">{tariff.name}</span>
                                                {tariff.gift_months ? (
                                                    <span className="tariffs__items__tariff__period_gift">
                                                        +&nbsp;
                                                        {tariff.gift_months}
                                                        &nbsp;
                                                        {numWord(tariff.gift_months, ['месяц', 'месяца', 'месяцев'])}
                                                        &nbsp;в подарок
                                                    </span>
                                                ) : null}
                                            </div>
                                            <span className="tariffs__items__tariff_price">
                                                {tariff.price}
                                                &nbsp;₽&nbsp;
                                                <span>
                                                    в месяц
                                                </span>
                                            </span>
                                            <div className="tariffs__items__tariff__total">
                                                {tariff.gift_months ? (
                                                    <span className="tariffs__items__tariff__total_old">
                                                        {gradeNumber(tariff.price * (tariff.months + tariff.gift_months))}
                                                        &nbsp;₽
                                                    </span>
                                                ) : null}
                                                <span className="tariffs__items__tariff__total_price">
                                                    {gradeNumber(tariff.price * tariff.months)}
                                                    &nbsp;₽ за&nbsp;
                                                    {tariff.months + tariff.gift_months}
                                                    &nbsp;
                                                    {numWord(tariff.months + tariff.gift_months, ['месяц', 'месяца', 'месяцев'])}
                                                </span>
                                            </div>
                                            <button type="button" disabled className="tariffs__items__tariff_select current">Активен</button>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </section>
                );
            }
            case 'selectPayment': {
                return (
                    <section className="tariffs payment page">
                        <Steps progressDot current={1} className="tariffs_steps" direction={isMobile ? 'vertical' : 'horizontal'}>
                            <Step title="Выбор тарифа" />
                            <Step title="Способ оплаты" />
                            <Step title="Завершение оплаты" />
                        </Steps>
                        <Title level={2} className="tariffs__select-workers_title">Выберите способ оплаты</Title>
                        <div className="tariffs__types-payments">
                            <button type="button" onClick={() => this.onSelectPayment('by_card')} className="tariffs__types-payments_btn">
                                <Icon type="credit-card" />
                                &nbsp;
                                Банковской картой
                            </button>
                            <button type="button" onClick={() => this.onSelectPayment('by_invoice')} className="tariffs__types-payments_btn">
                                <Icon type="file-text" />
                                &nbsp;
                                Выставить счёт
                            </button>
                        </div>
                    </section>
                );
            }
            case 'enterEmail':
                return (
                    <section className="tariffs payment page">
                        <Steps progressDot current={1} className="tariffs_steps" direction={isMobile ? 'vertical' : 'horizontal'}>
                            <Step title="Выбор тарифа" />
                            <Step title="Способ оплаты" />
                            <Step title="Завершение оплаты" />
                        </Steps>
                        <Title level={2} className="tariffs__select-workers_title">Способ оплаты</Title>
                        <div className="tariffs__types-payments center">
                            <button type="button" className="tariffs__types-payments_btn disabled" disabled>
                                {paymentType === 'by_card' ? <Icon type="credit-card" /> : <Icon type="file-text" />}
                                &nbsp;
                                {paymentType === 'by_card' ? 'Банковской картой' : 'Выставить счёт'}
                            </button>
                        </div>
                        <Form onSubmit={this.handleSubmit} className="tariffs__form">
                            <Form.Item label={paymentType === 'by_card' ? 'E-mail для чека' : 'E-mail для отправки счёта'}>
                                {getFieldDecorator('email', {
                                    rules: [{ required: true, message: 'Заполните поле!' }],
                                    initialValue: auth.user.email
                                })(
                                    <Input
                                        prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="E-mail"
                                        readOnly
                                        onFocus={e => e.target.removeAttribute('readonly')}
                                    />,
                                )}
                            </Form.Item>
                            <Button type="primary" htmlType="submit" className="tariffs__form_btn">{paymentType === 'by_card' ? 'Оплатить' : 'Выставить'}</Button>
                        </Form>
                    </section>
                );
            default:
                return null;
        }
    }
}

TariffsPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    tariffs: PropTypes.object.isRequired,
    workers: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    tariffs: state.tariffs,
    workers: state.workers,
    auth: state.auth,
    ws: state.ws
});

const wrapper = compose(
    connect(mapStateToProps),
    Form.create(),
    WrapperContent
);

export default wrapper(TariffsPage);
