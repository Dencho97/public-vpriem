import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Divider,
    Table,
    Row,
    Col,
    Progress
} from 'antd';
import moment from 'moment';
import { Bar } from '@nivo/bar';

import Preloader from '../../components/Preloader';
import { getReportAdministratorsAction } from './actions';
import './style.scss';

moment.locale('ru');

class TicketsReport extends Component {
    componentDidMount() {
        const { report, dispatch } = this.props;
        const { filter } = report;
        dispatch(getReportAdministratorsAction(filter.date, filter.filial));
    }

    componentDidUpdate(prevProps) {
        const { dispatch, report } = this.props;
        const { filter } = report;
        const { report: prevReport } = prevProps;
        const { filter: prevFilter } = prevReport;

        if (+prevFilter.date.format('x') !== +filter.date.format('x') || +prevFilter.filial !== +filter.filial) {
            dispatch(getReportAdministratorsAction(filter.date, filter.filial));
        }
    }

    getTspanGroup = (text) => {
        const textArray = text.split(' ');
        const lines = [];

        textArray.forEach((line, i) => lines.push(<tspan x={0} dy={i === 0 ? 0 : 14} key={`name-${i + 1}`}>{line}</tspan>));

        return lines;
    }

    render() {
        const { report } = this.props;
        const { data, loading } = report;

        const keys = ['Ручные записи', 'Клиентские записи'];
        const columnsTable = [
            {
              title: 'Сотрудник',
              dataIndex: 'name',
            },
            {
              title: 'Закрыто талонов',
              dataIndex: 'writes',
            },
            {
              title: 'Норма талонов',
              dataIndex: 'norma',
            },
            {
                title: 'Выполнено от нормы',
                dataIndex: 'percent',
                render: percent => (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: 50,
                        alignItems: 'center',
                        margin: '0 0 0 auto'
                        }}
                    >
                        <Progress type="circle" percent={percent} width={50} />
                        {percent >= 100 ? <span>{`${percent}%`}</span> : null}
                    </div>
                )
            }
        ];
        const columnsTable2 = [
            {
              title: 'Общее кол-во талонов',
              dataIndex: 'totalTickets',
            },
            {
              title: 'Общее кол-во закрытых талонов',
              dataIndex: 'totalWrites',
            },
            {
                title: 'Кол-во закрытых талонов администраторами',
                dataIndex: 'totalWritesOnlyAdmins',
            },
            {
              title: 'Кол-во незакрытых талонов',
              dataIndex: 'totalEmpty',
            },
            {
              title: '% закрытых / % незакрытых',
              dataIndex: 'percents',
            }
        ];
        let dataChart = [{
            name: '',
            'Клиентские записи': 0,
            'Клиентские записиColor': '#faad14',
            'Ручные записи': 0,
            'Ручные записиColor': '#e94e1e'
        }];
        let dataTable = [];
        let dataTable2 = [];
        let norma = 0;

        if (loading || data === null) {
            return <Preloader />;
        }

        if (!loading && data !== null) {
            norma = +data.norma;
            dataChart = data ? data.admins.map(admin => ({
                name: `${admin.worker[0].last_name} ${admin.worker[0].first_name} ${admin.worker[0].second_name}`,
                [keys[0]]: +admin.countWrites,
                [`${keys[0]}Color`]: '#e94e1e',
                [keys[1]]: +admin.countClientWrites,
                [`${keys[1]}Color`]: '#faad14',
            })) : null;
            dataTable = data.admins.map(admin => ({
                key: admin.id,
                name: `${admin.worker[0].last_name} ${admin.worker[0].first_name} ${admin.worker[0].second_name}`,
                writes: +admin.countWrites,
                norma: +data.norma,
                percent: Math.round(+admin.countWrites / +data.norma * 100),
                percentCircle: <Progress type="circle" percent={Math.round(+admin.countWrites / +data.norma * 100)} width={50} />
            }));
            dataTable2 = [...dataTable2, {
                key: `key-total-${data.totalTickets + data.totalWritesOnlyAdmins}`,
                totalTickets: data.totalTickets,
                totalWrites: data.totalWrites,
                totalWritesOnlyAdmins: data.totalWritesOnlyAdmins,
                totalEmpty: +data.totalTickets - +data.totalWrites,
                percents: `${Math.round(+data.totalWrites / +data.totalTickets * 100)}% / ${100 - Math.round(+data.totalWrites / +data.totalTickets * 100)}%`
            }];
        }

        return (
            <>
                <Divider>Отчёт по талонам</Divider>
                <Row>
                    <Col span={24}>
                        <div className="report__chart-1">
                            <Bar
                                maxValue={norma + 40}
                                width={900}
                                height={450}
                                margin={{
                                    top: 40,
                                    bottom: 80,
                                    right: 0,
                                    left: 0
                                }}
                                padding={0.3}
                                colors={({ id, data: d }) => d[`${id}Color`]}
                                data={dataChart}
                                indexBy="name"
                                keys={keys}
                                labelTextColor="inherit:darker(1.4)"
                                labelSkipWidth={16}
                                labelSkipHeight={16}
                                axisBottom={{
                                    tickSize: 0,
                                    tickPadding: 25,
                                    tickRotation: 0,
                                    renderTick: ({
                                    opacity,
                                    textAnchor,
                                    textBaseline,
                                    textX,
                                    textY,
                                    value,
                                    x,
                                    y
                                    }) => (
                                        <g
                                            transform={`translate(${x},${y})`}
                                            style={{ opacity }}
                                        >
                                            <text
                                                alignmentBaseline={textBaseline}
                                                style={{ fontSize: '12px' }}
                                                textAnchor={textAnchor}
                                                transform={`translate(${textX},${textY})`}
                                            >
                                                {this.getTspanGroup(value)}
                                            </text>
                                        </g>
                                    )
                                }}
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
                                            id: 'Клиентские записи'
                                        },
                                        id: 'lines'
                                    }
                                ]}
                                markers={[
                                    {
                                        axis: 'y',
                                        value: norma,
                                        lineStyle: { stroke: 'var(--primiry-color)', strokeWidth: 2 },
                                        legend: `Норма записей (${norma})`,
                                        legendOrientation: 'horizontal',
                                    },
                                ]}
                                motionStiffness={90}
                                motionDamping={15}
                                animate
                            />
                        </div>
                    </Col>
                    <Col span={24}>
                        <Table
                            columns={columnsTable2}
                            dataSource={dataTable2}
                            size="middle"
                            pagination={false}
                            style={{ marginTop: 30 }}
                            locale={{ emptyText: 'Нет результатов' }}
                        />
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

TicketsReport.propTypes = {
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

export default wrapper(TicketsReport);
