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

import { getReportDoctorsAction } from './actions';
import './style.scss';

moment.locale('ru');

class DoctorsReport extends Component {
    componentDidMount() {
        const { report, dispatch } = this.props;
        const { filter } = report;

        dispatch(getReportDoctorsAction(filter.dateRange, filter.filial));
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
            dispatch(getReportDoctorsAction(filter.dateRange, filter.filial));
        }
    }

    render() {
        const { report } = this.props;
        const { data, loading } = report;
        const columnsTable = [
            {
              title: 'Сотрудник',
              dataIndex: 'name',
            },
            {
              title: 'Кол-во записей',
              dataIndex: 'writes',
            }
        ];

        let doctors = [];
        let dataTable = [];

        if (!loading && data !== null) {
            data.forEach((doctor) => {
                doctors = [...doctors, {
                    id: `${doctor.last_name} ${doctor.first_name} ${doctor.second_name}`,
                    label: `${doctor.last_name} ${doctor.first_name} ${doctor.second_name}`,
                    value: +doctor.countWrites
                }];
            });
            dataTable = data.map(doctor => ({
                key: doctor.id,
                name: `${doctor.last_name} ${doctor.first_name} ${doctor.second_name}`,
                writes: +doctor.countWrites
            }));
        }

        return (
            <>
                <Divider>Отчёт по докторам</Divider>
                <Row>
                    <Col span={24}>
                        <div className="report__chart-2">
                            <ResponsivePie
                                data={doctors}
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
                                motionStiffness={90}
                                motionDamping={15}
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

DoctorsReport.propTypes = {
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

export default wrapper(DoctorsReport);
