import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Icon,
    Button,
    Typography,
    Form,
    Select,
    DatePicker,
    Row,
    Col,
    Switch
} from 'antd';
import moment from 'moment';

import { setFilterAction, resetFilterAction, switchFilterAction } from './actions';
import { getScheduleWSAction } from './actionsWS';
import { getFilialsAction } from '../dictionary/filials/actions';
import { getServicesAction } from '../dictionary/services/actions';
import { getWorkersAction } from '../dictionary/workers/actions';
import { getFullNameWorker } from '../../helpers';
import localePicker from '../../constans/ruLocalePicker';
import './style.scss';

moment.locale('ru');

const { Title } = Typography;
const { Option } = Select;

class FilterSchedule extends Component {
    componentDidMount() {
        const { dispatch, auth } = this.props;
        const { token } = auth;
        let showFilter = +localStorage.getItem('showFilter');
        showFilter = showFilter || 0;

        dispatch(switchFilterAction(showFilter));

        dispatch(getFilialsAction(token));
        dispatch(getServicesAction(token));
        dispatch(getWorkersAction('', token));
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(resetFilterAction());
    }

    onSelectSpeciality = (values) => {
        const { dispatch, schedule, ws } = this.props;
        const { filter } = schedule;
        dispatch(setFilterAction('speciality', values));
        getScheduleWSAction({ ...filter, speciality: values }, 0, ws);
    }

    onChangeFilial = (value) => {
        const { dispatch, schedule, ws } = this.props;
        const { filter } = schedule;
        const newValue = value !== undefined ? value : null;
        dispatch(setFilterAction('filial', newValue));
        getScheduleWSAction({ ...filter, filial: newValue }, 0, ws);
    }

    onChangeView = (value) => {
        const { dispatch, schedule, ws } = this.props;
        const { filter } = schedule;
        const newValue = value !== undefined ? value : null;
        dispatch(setFilterAction('typeView', newValue));
        getScheduleWSAction({ ...filter, typeView: newValue }, 0, ws);
    }

    onSwitchDay = (type, date = null) => {
        const { dispatch, schedule, ws } = this.props;
        const { filter } = schedule;
        let countDays = null;

        switch (filter.typeView) {
            case 0:
                countDays = 1;
                break;
            case 1:
                countDays = 6;
                break;
            default:
                break;
        }

        switch (type) {
            case 'next': {
                const newDate = filter.currentDate.add(countDays, 'd');
                dispatch(setFilterAction('currentDate', newDate));
                getScheduleWSAction(filter, 0, ws);
                break;
            }
            case 'prev': {
                const newDate = filter.currentDate.subtract(countDays, 'd');
                dispatch(setFilterAction('currentDate', newDate));
                getScheduleWSAction(filter, 0, ws);
                break;
            }
            case 'custom': {
                const newDate = date;
                dispatch(setFilterAction('currentDate', newDate));
                getScheduleWSAction({ ...filter, currentDate: newDate }, 0, ws);
                break;
            }
            default:
                break;
        }
    }

    onSwitchWorkersOnHoliday = () => {
        const { dispatch, schedule } = this.props;
        const { filter } = schedule;

        dispatch(setFilterAction('showHolidays', !filter.showHolidays));
    }

    onShowFilter = () => {
        const { dispatch, schedule } = this.props;
        const newVal = +schedule.filter.show ? 0 : 1;
        localStorage.setItem('showFilter', newVal);
        dispatch(switchFilterAction(newVal));
    }

    onSelectWorker = (values) => {
        const { dispatch } = this.props;
        dispatch(setFilterAction('doctors', values));
    }

    render() {
        const {
            schedule,
            filials,
            services,
            workers,
            form
        } = this.props;
        const { filter } = schedule;
        const { getFieldDecorator } = form;
        const isMobile = window.matchMedia('(max-width: 767px)').matches;

        let today;
        if (filter.typeView === 0) {
            today = filter.currentDate.format('dddd, DD.MM.YYYY');
        } else if (filter.typeView === 1) {
            const start = filter.currentDate.format('DD.MM.YYYY');
            const end = moment(filter.currentDate).add(6, 'days').format('DD.MM.YYYY');
            today = `${start} - ${end}`;
        }

        const nextDay = moment(filter.currentDate).add(1, 'd').format('dddd, DD.MM.YYYY');
        const prevDay = moment(filter.currentDate).subtract(1, 'd').format('dddd, DD.MM.YYYY');

        return (
            <section className="schedule filter">
                <Form className="schedule__filter" style={{ display: +filter.show ? 'block' : 'none' }}>
                    <Row gutter={15}>
                        <Col md={12} lg={6}>
                            <Form.Item label="Отображение">
                                {getFieldDecorator('schedule_filter_view', {
                                    rules: [{ required: false }],
                                    initialValue: filter.typeView
                                })(
                                    <Select placeholder="Выберите отображение" onChange={this.onChangeView}>
                                        <Option value={0}>По дням</Option>
                                        <Option value={1}>По неделям</Option>
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col md={12} lg={6}>
                            <Form.Item label="Филиал">
                                {getFieldDecorator('schedule_filter_filial', {
                                    rules: [{ required: false }]
                                })(
                                    <Select placeholder="Выберите филиал" loading={filials.loading} onChange={this.onChangeFilial} allowClear>
                                        {filials.data && !filials.loading ? filials.data.map(filial => <Option key={filial.id} value={+filial.id}>{filial.name}</Option>) : null}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col md={12} lg={6}>
                            <Form.Item label="Специальность">
                                {getFieldDecorator('schedule_filter_speciality', {
                                    rules: [{ required: false }]
                                })(
                                    <Select placeholder="Выберите специальность" loading={services.loading} mode="multiple" onChange={this.onSelectSpeciality}>
                                        {services.data && !services.loading ? services.data.map(service => <Option key={service.id} value={+service.id}>{service.name}</Option>) : null}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col md={12} lg={6}>
                            <Form.Item label="Специалист">
                                {getFieldDecorator('schedule_filter_doctor', {
                                    rules: [{ required: false }]
                                })(
                                    <Select placeholder="Выберите специалиста" loading={workers.loading} mode="multiple" onChange={this.onSelectWorker}>
                                        {workers.data && !workers.loading ? workers.data.map((worker) => {
                                            if (+worker.type_id === 1) {
                                                return <Option key={worker.id} value={+worker.id}>{getFullNameWorker(worker)}</Option>;
                                            }
                                            return null;
                                        }) : null}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col md={12} lg={6}>
                            <Form.Item label={filter.typeView === 0 ? 'Дата' : 'Начальная дата'}>
                                {getFieldDecorator('schedule_filter_date', {
                                    rules: [{ required: false }],
                                    initialValue: filter.currentDate
                                })(
                                    <DatePicker
                                        placeholder="__.__.____"
                                        format="DD.MM.YYYY"
                                        onChange={date => this.onSwitchDay('custom', date)}
                                        allowClear={false}
                                        locale={localePicker}
                                    />
                                )}
                            </Form.Item>
                        </Col>
                        <Col md={8} lg={4}>
                            <Form.Item label="Сотрудники на выходном">
                                {getFieldDecorator('schedule_filter_show-holidays', {
                                    rules: [{ required: false }],
                                    valuePropName: 'checked',
                                    initialValue: filter.showHolidays
                                })(
                                    <Switch onChange={() => this.onSwitchWorkersOnHoliday()} />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <div className="schedule__switch-days">
                    <Button style={{ textTransform: filter.typeView === 0 ? 'capitalize' : 'unset' }} shape={isMobile ? 'circle' : null} onClick={() => this.onSwitchDay('prev')}>
                        <Icon type="left" />
                        &nbsp;
                        {filter.typeView === 0 ? prevDay : 'Назад на 7 дней'}
                    </Button>
                    <Title level={4}>
                        Расписание на:
                        &nbsp;
                        <span style={{ textTransform: 'capitalize' }}>
                            {today}
                        </span>
                        <Icon type="filter" className={`schedule__filter_show ${+filter.show ? 'active' : ''}`} onClick={() => this.onShowFilter()} />
                    </Title>
                    <Button style={{ textTransform: filter.typeView === 0 ? 'capitalize' : 'unset' }} shape={isMobile ? 'circle' : null} onClick={() => this.onSwitchDay('next')}>
                        {filter.typeView === 0 ? nextDay : 'Вперед на 7 дней'}
                        &nbsp;
                        <Icon type="right" />
                    </Button>
                </div>
                <div className="schedule__legend">
                    <div className="schedule__legend__item">
                        <span className="schedule__legend__item_color free" />
                        <span className="schedule__legend__item_label">Свободный талон</span>
                    </div>
                    <div className="schedule__legend__item">
                        <span className="schedule__legend__item_color busy" />
                        <span className="schedule__legend__item_label">Ручная запись</span>
                    </div>
                    <div className="schedule__legend__item">
                        <span className="schedule__legend__item_color busy-client" />
                        <span className="schedule__legend__item_label">Клиентская запись</span>
                    </div>
                    <div className="schedule__legend__item">
                        <span className="schedule__legend__item_color custom" />
                        <span className="schedule__legend__item_label">Созданый/разделёный талон</span>
                    </div>
                    <div className="schedule__legend__item">
                        <span className="schedule__legend__item_color edit" />
                        <span className="schedule__legend__item_label">Редактируемый талон</span>
                    </div>
                    <div className="schedule__legend__item">
                        <span className="schedule__legend__item_color hidden" />
                        <span className="schedule__legend__item_label">Скрытый талон</span>
                    </div>
                </div>
            </section>
        );
    }
}

FilterSchedule.propTypes = {
    dispatch: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    schedule: PropTypes.object.isRequired,
    filials: PropTypes.object.isRequired,
    services: PropTypes.object.isRequired,
    workers: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    ws: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    schedule: state.schedule,
    filials: state.filials,
    services: state.services,
    workers: state.workers,
    auth: state.auth,
    ws: state.ws
});

const wrapper = compose(
    connect(mapStateToProps),
    Form.create()
);

export default wrapper(FilterSchedule);
