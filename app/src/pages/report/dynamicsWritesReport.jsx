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
import { ResponsiveLine } from '@nivo/line';

import { getReportDynimicsWritesAction } from './actions';
import './style.scss';

moment.locale('ru');

class DynamicsWritesReport extends Component {
    componentDidMount() {
        const { dispatch, report } = this.props;
        const { filter } = report;

        dispatch(getReportDynimicsWritesAction(filter.dateRange, filter.filial));
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
            dispatch(getReportDynimicsWritesAction(filter.dateRange, filter.filial));
        }
    }

    render() {
        const { report } = this.props;
        const { data, loading } = report;
        const columnsTable = [
            {
              title: 'Время',
              dataIndex: 'time',
            },
            {
              title: 'Кол-во записей',
              dataIndex: 'writes',
            }
        ];
        const dynamicsWritesData = {
            id: 'writes',
            data: []
        };

        let dataTable = [];

        if (!loading && data !== null) {
            data.forEach((value) => {
                dynamicsWritesData.data = [...dynamicsWritesData.data, {
                    x: moment(+value.time * 1000).format('HH:mm'),
                    y: +value.count
                }];
            });
            dataTable = data.map(item => ({
                key: item.time,
                time: moment(+item.time * 1000).format('HH:mm'),
                writes: item.count
            }));
        }

        return (
            <>
                <Divider>Динамика записей</Divider>
                <Row>
                    <Col span={24}>
                        <div className="report__chart-6">
                            <ResponsiveLine
                                curve="catmullRom"
                                enableArea
                                data={[dynamicsWritesData]}
                                margin={{
                                    top: 40,
                                    right: 80,
                                    bottom: 80,
                                    left: 80
                                }}
                                xScale={{ type: 'point' }}
                                yScale={{
                                    type: 'linear',
                                    min: 'auto',
                                    max: 'auto',
                                    stacked: true,
                                    reverse: false
                                }}
                                axisTop={null}
                                axisRight={null}
                                axisBottom={{
                                    orient: 'bottom',
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: 0,
                                    legend: 'Время',
                                    legendOffset: 36,
                                    legendPosition: 'middle'
                                }}
                                axisLeft={{
                                    orient: 'left',
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: 0,
                                    legend: 'Кол-во записей',
                                    legendOffset: -40,
                                    legendPosition: 'middle'
                                }}
                                colors={['var(--primiry-color)']}
                                pointSize={10}
                                pointColor={{ from: 'color' }}
                                pointLabel="y"
                                pointLabelYOffset={-12}
                                useMesh
                                animate
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

DynamicsWritesReport.propTypes = {
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

export default wrapper(DynamicsWritesReport);
