import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Divider,
    Row,
    Col,
    DatePicker,
    Select,
    Icon,
    Tooltip
} from 'antd';
import moment from 'moment';

import { REPORT_ROUTE } from '../../constans/routes';
import WrapperContent from '../../components/WrapperContent';
import Preloader from '../../components/Preloader';
import TicketsReport from './ticketsReport';
import DoctorsReport from './doctorsReport';
import AgeReport from './ageReport';
import ReceptionReport from './receptionReport';
import ServicesReport from './servicesReport';
import DynamicsWritesReport from './dynamicsWritesReport';
import { changeReportFilterAction } from './actions';
import { getFilialsAction } from '../dictionary/filials/actions';
import './style.scss';

moment.locale('ru');
const { Option } = Select;
const { RangePicker, MonthPicker } = DatePicker;

class ReportPage extends Component {
    static pathPage = REPORT_ROUTE;

    static namePage = 'Отчёты';

    componentDidMount() {
        const { dispatch, auth, report } = this.props;
        const { token } = auth;
        const { dateRange, filial } = report;
        dispatch(getFilialsAction());
    }

    onChangeFilter = (property, value) => {
        const { dispatch, auth } = this.props;
        const { token } = auth;
        dispatch(changeReportFilterAction(property, value, token));
    }

    onPrint = () => {
        const { report } = this.props;
        const { filter } = report;
        let date = null;

        if (filter.type !== 'byAge') {
            if (filter.type === 'byTickets') {
                date = filter.date.format('MMMM YYYY');
            } else {
                date = `${filter.dateRange[0].format('DD.MM.YYYY')}-${filter.dateRange[1].format('DD.MM.YYYY')}`;
            }
        }

        const dateText = date ? `за ${date}` : '';
        const content = document.getElementById('export-content').innerHTML;
        const css = '<link rel="stylesheet" href="/app/dist/style.css" type="text/css" />';
        const printWindow = window.open('', `Отчёт ${dateText}`, 'height=800,width=800');
        printWindow.document.write(`<html><head><title>Отчёт ${dateText}</title>`);
        printWindow.document.write(css);
        printWindow.document.write('</head><body class="print">');
        printWindow.document.write(content);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        return true;
    }

    render() {
        const { report, filials } = this.props;
        const { filter } = report;
        const { loading: loadingFilials, data: dataFilials } = filials;

        if (loadingFilials || dataFilials === null) {
            return (
                <Preloader />
            );
        }

        return (
            <section className="report page">
                <div className="report__export">
                    <Tooltip placement="bottom" title="Печать">
                        <button type="button" className="report__export_print report__export_btn" onClick={this.onPrint}><Icon type="printer" /></button>
                    </Tooltip>
                </div>
                <Divider>Фильтр</Divider>
                <Row gutter={15} className="report__filter">
                    <Col md={24} lg={8}>
                        <Select placeholder="Выберите тип отчёта" value={filter.type} onChange={value => this.onChangeFilter('type', value)}>
                            <Option value="byTickets">Отчёт по талонам</Option>
                            <Option value="byDoctors">Отчёт по докторам</Option>
                            <Option value="byAge">Отчёт по возрасту</Option>
                            <Option value="byReception">Отчёт по типу приёма</Option>
                            <Option value="bySpeciality">Отчёт по специальностям</Option>
                            <Option value="byDynamicWrites">Динамика записей</Option>
                        </Select>
                    </Col>
                    {filter.type === 'byAge' ? null : (
                        <Col md={24} lg={8}>
                            {filter.type === 'byTickets' ? (
                                <MonthPicker
                                    onChange={value => this.onChangeFilter('date', value)}
                                    placeholder="Выбирите месяц"
                                    format="MMMM YYYY"
                                    value={filter.date}
                                />
                            ) : (
                                <RangePicker
                                    onChange={values => this.onChangeFilter('dateRange', values)}
                                    placeholder={['Начальная дата', 'Конечная дата']}
                                    format="DD.MM.YYYY"
                                    value={filter.dateRange}
                                />
                            )}
                        </Col>
                    )}
                    {filter.type === 'byAge' ? null : (
                        <Col md={24} lg={8}>
                            <Select placeholder="Выберите филиал" value={+filter.filial} onChange={value => this.onChangeFilter('filial', +value)}>
                                <Option value={0}>Все филиалы</Option>
                                {dataFilials.map(item => <Option key={item.id} value={+item.id}>{item.name}</Option>)}
                            </Select>
                        </Col>
                    )}
                </Row>
                <div id="export-content">
                    {filter.type === 'byTickets' ? <TicketsReport /> : null}
                    {filter.type === 'byDoctors' ? <DoctorsReport /> : null}
                    {filter.type === 'byAge' ? <AgeReport /> : null}
                    {filter.type === 'byReception' ? <ReceptionReport /> : null}
                    {filter.type === 'bySpeciality' ? <ServicesReport /> : null}
                    {filter.type === 'byDynamicWrites' ? <DynamicsWritesReport /> : null}
                </div>
            </section>
        );
    }
}

ReportPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    report: PropTypes.object.isRequired,
    filials: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    report: state.report,
    filials: state.filials,
    auth: state.auth,
    ws: state.ws
});

const wrapper = compose(
    connect(mapStateToProps),
    WrapperContent
);

export default wrapper(ReportPage);
