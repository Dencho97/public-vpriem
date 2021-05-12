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
import { ResponsiveRadar } from '@nivo/radar';

import { getReportAgeAction } from './actions';
import './style.scss';

moment.locale('ru');

class AgeReport extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(getReportAgeAction());
    }

    render() {
        const { report } = this.props;
        const { data, loading } = report;
        const columnsTable = [
            {
              title: 'Год',
              dataIndex: 'year',
            },
            {
              title: 'Кол-во пациентов',
              dataIndex: 'patients',
            }
        ];

        let dataYears = [];
        let dataTable = [];

        if (!loading && data !== null) {
            data.forEach((item) => {
                dataYears = [...dataYears, {
                    taste: item.year,
                    'Кол-во талонов:': item.count
                }];
            });
            dataTable = data.map(item => ({
                key: item.year,
                year: item.year,
                patients: item.count
            }));
        }

        return (
            <>
                <Divider>Отчёт по возрасту</Divider>
                <Row>
                    <Col span={24}>
                        <div className="report__chart-3">
                            <ResponsiveRadar
                                data={dataYears}
                                keys={['Кол-во талонов:']}
                                indexBy="taste"
                                maxValue="auto"
                                margin={{
                                    top: 40,
                                    right: 0,
                                    bottom: 80,
                                    left: 0
                                }}
                                curve="linearClosed"
                                borderWidth={2}
                                borderColor={{ from: 'color' }}
                                gridLevels={5}
                                gridShape="circular"
                                gridLabel={() => ''}
                                gridLabelOffset={0}
                                colors={['var(--primiry-color)']}
                                fillOpacity={0.25}
                                blendMode="multiply"
                                motionStiffness={90}
                                motionDamping={15}
                                isInteractive
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

AgeReport.propTypes = {
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

export default wrapper(AgeReport);
