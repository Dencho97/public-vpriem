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

import { getReportReceptionAction } from './actions';
import { TYPE_RECEPTIONS } from '../../constans/type-receptions';
import './style.scss';

moment.locale('ru');

class ReceprionReport extends Component {
    componentDidMount() {
        const { dispatch, report } = this.props;
        const { filter } = report;

        dispatch(getReportReceptionAction(filter.dateRange, filter.filial));
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
            dispatch(getReportReceptionAction(filter.dateRange, filter.filial));
        }
    }

    render() {
        const { report } = this.props;
        const { data, loading } = report;
        const columnsTable = [
            {
              title: 'Тип приёма',
              dataIndex: 'type',
            },
            {
              title: 'Кол-во записей',
              dataIndex: 'writes',
            }
        ];

        let receptionData = [];
        let dataTable = [];

        if (!loading && data !== null) {
            data.forEach((value, i) => {
                receptionData = [...receptionData, {
                    id: TYPE_RECEPTIONS[i].name,
                    label: TYPE_RECEPTIONS[i].name,
                    value
                }];
            });
            dataTable = data.map((item, i) => ({
                key: i,
                type: TYPE_RECEPTIONS[i].name,
                writes: item
            }));
        }

        return (
            <>
                <Divider>Отчёт по типу приёма</Divider>
                <Row>
                    <Col span={24}>
                        <div className="report__chart-4">
                            <ResponsivePie
                                data={receptionData}
                                margin={{
                                    top: 40,
                                    right: 0,
                                    bottom: 80,
                                    left: 0
                                }}
                                innerRadius={0.5}
                                padAngle={0.7}
                                cornerRadius={3}
                                colors={['#e94e1e', '#faad14']}
                                borderWidth={0}
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
                                defs={[
                                    {
                                        id: 'lines',
                                        type: 'patternLines',
                                        background: 'inherit',
                                        color: '#f5c76d',
                                        rotation: -45,
                                        lineWidth: 6,
                                        spacing: 10
                                    }
                                ]}
                                fill={[
                                    {
                                        match: {
                                            id: TYPE_RECEPTIONS[1].name
                                        },
                                        id: 'lines'
                                    }
                                ]}
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

ReceprionReport.propTypes = {
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

export default wrapper(ReceprionReport);
