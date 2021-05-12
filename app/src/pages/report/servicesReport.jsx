import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Divider,
    Row,
    Col,
    Table
} from 'antd';
import moment from 'moment';
import { ResponsivePie } from '@nivo/pie';

import { getReportServicesAction } from './actions';
import './style.scss';

moment.locale('ru');

class ServicesReport extends Component {
    componentDidMount() {
        const { dispatch, report } = this.props;
        const { filter } = report;

        dispatch(getReportServicesAction(filter.dateRange, filter.filial));
    }

    componentDidUpdate(prevProps) {
        const { dispatch, report } = this.props;
        const { filter } = report;
        const { report: prevReport } = prevProps;
        const { filter: prevFilter } = prevReport;

        if (
            +prevFilter.dateRange[0].format('x') !== +filter.dateRange[0].format('x')
            || +prevFilter.dateRange[1].format('x') !== +filter.dateRange[1].format('x')
            || +prevFilter.filial !== +filter.filial
        ) {
            dispatch(getReportServicesAction(filter.dateRange, filter.filial));
        }
    }

    render() {
        const { report } = this.props;
        const { data, loading } = report;
        const columnsTable = [
            {
              title: 'Специальность',
              dataIndex: 'service',
            },
            {
              title: 'Кол-во записей',
              dataIndex: 'writes',
            }
        ];

        let services = [];
        let dataTable = [];

        if (!loading && data !== null) {
            data.forEach((item) => {
                services = [...services, {
                    id: item.label,
                    label: item.label,
                    value: +item.value
                }];
            });
            dataTable = data.map(item => ({
                key: item.id,
                service: item.label,
                writes: item.value
            }));
        }

        return (
            <>
                <Divider>Отчёт по специальностям</Divider>
                <Row>
                    <Col span={24}>
                        <div className="report__chart-5">
                            <ResponsivePie
                                data={services}
                                margin={{
                                    top: 40,
                                    right: 0,
                                    bottom: 80,
                                    left: 0
                                }}
                                innerRadius={0.5}
                                padAngle={0.7}
                                cornerRadius={3}
                                colors={{ scheme: 'nivo' }}
                                borderWidth={1}
                                borderColor={{
                                    from: 'color',
                                    modifiers: [['darker', 0.2]]
                                }}
                                radialLabelsSkipAngle={10}
                                radialLabelsTextXOffset={6}
                                radialLabelsTextColor="#333333"
                                radialLabelsLinkOffset={0}
                                radialLabelsLinkDiagonalLength={16}
                                radialLabelsLinkHorizontalLength={24}
                                radialLabelsLinkStrokeWidth={1}
                                radialLabelsLinkColor={{ from: 'color' }}
                                slicesLabelsSkipAngle={10}
                                slicesLabelsTextColor="#333333"
                                animate
                                motionStiffness={90}
                                motionDamping={15}
                            />
                        </div>
                    </Col>
                    <Col span={24}>
                        <Table
                            columns={columnsTable}
                            dataSource={dataTable}
                            size="middle"
                            pagination={false}
                            style={{ marginTop: 30 }}
                            locale={{ emptyText: 'Нет результатов' }}
                        />
                    </Col>
                </Row>
            </>
        );
    }
}

ServicesReport.propTypes = {
    dispatch: PropTypes.func.isRequired,
    report: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    report: state.report,
    ws: state.ws
});

const wrapper = compose(
    connect(mapStateToProps)
);

export default wrapper(ServicesReport);
