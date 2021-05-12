import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import {
    Button,
    Row,
    Col,
    Icon,
    Select,
    Form
} from 'antd';

import { DICTIONARY_WORKERS_ROUTE } from '../../../constans/routes';
import WrapperContent from '../../../components/WrapperContent';
import delayUnmounting from '../../../components/delayUnmounting';
import Preloader from '../../../components/Preloader';
import { history } from '../../../store';
import CreateWorker from './create';
import UpdateWorker from './update';
import WorkerItem from './worker';
import {
 switchDrawer, getWorkersAction, removeWorkersAction, resetFilterAction
} from './actions';
import { getTypesAction } from '../types/actions';
import { getServicesAction } from '../services/actions';
import { getFilialsAction } from '../filials/actions';
import { getFullNameWorker } from '../../../helpers';
import './style.scss';
import { setFilterAction } from './actions';
import { Tutorial } from '../../../components/Tutorial';

const { Option } = Select;

const DelayUnmountingCreateWorker = delayUnmounting(CreateWorker);
const DelayUnmountingUpdateWorker = delayUnmounting(UpdateWorker);

class WorkersPage extends Component {
    static pathPage = DICTIONARY_WORKERS_ROUTE;

    static namePage = 'Сотрудники';

    introJsRef = React.createRef();

    componentDidMount = () => {
        const { pathname } = window.location;
        const { dispatch, auth, tutorial } = this.props;
        const { token, user } = auth;
        const { user_id: userID } = user;

        dispatch(getWorkersAction(userID, token));
        dispatch(getTypesAction(token));
        dispatch(getServicesAction(token));
        dispatch(getFilialsAction(token));

        if (pathname.search('create') !== -1) {
            if (tutorial.active && tutorial.lastTutorial === 'addWorkers') {
                history.push(`${DICTIONARY_WORKERS_ROUTE}`);
            } else {
                dispatch(switchDrawer('show_create'));
            }
        } else if (pathname.search('update') !== -1) {
            dispatch(switchDrawer('show_update'));
        }
    };

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(resetFilterAction());
    }

    addWorker = () => {
        const { dispatch } = this.props;

        history.push(`${DICTIONARY_WORKERS_ROUTE}/create`);
        dispatch(switchDrawer('show_create'));
    };

    viewWorker = id => (true);

    editWorker = (id) => {
        const { dispatch } = this.props;
        history.push(`${DICTIONARY_WORKERS_ROUTE}/update/${id}`);
        dispatch(switchDrawer('show_update', id));
    };

    removeWorker = (id) => {
        const { dispatch, auth } = this.props;
        const { token } = auth;
        dispatch(removeWorkersAction(id, token));
    };

    onChangeType = (value) => {
        const { dispatch } = this.props;
        const newValue = value !== undefined ? value : null;
        dispatch(setFilterAction('type', newValue));
    }

    onChangeFilial = (value) => {
        const { dispatch } = this.props;
        const newValue = value !== undefined ? value : null;
        dispatch(setFilterAction('filial', newValue));
    }

    onSelectSpeciality = (values) => {
        const { dispatch } = this.props;
        dispatch(setFilterAction('speciality', values));
    }

    onSelectWorker = (values) => {
        const { dispatch } = this.props;
        dispatch(setFilterAction('doctors', values));
    }

    filterData = () => {
        const { workers } = this.props;
        const { filter } = workers;
        let filteredData = [];

        if (workers.data !== null) {
            filteredData = Array.from(workers.data).map((worker) => {
                let workerFiltered = worker;
                if (filter.type) {
                    workerFiltered = +workerFiltered.type_id === +filter.type ? workerFiltered : null;
                }
                if (filter.filial && workerFiltered) {
                    workerFiltered = +workerFiltered.filial_id === +filter.filial ? workerFiltered : null;
                }
                if (filter.speciality.length && workerFiltered) {
                    workerFiltered = filter.speciality.find(id => workerFiltered.services_ids.includes(id))
                    ? workerFiltered : null;
                }
                if (filter.doctors.length && workerFiltered) {
                    workerFiltered = filter.doctors.find(id => +id === +workerFiltered.id)
                        ? workerFiltered : null;
                }
                return workerFiltered;
            });
        }

        filteredData = filteredData.filter(item => item !== null);
        return filteredData.length ? filteredData : null;
    }

    render() {
        const {
            workers,
            types,
            services,
            filials,
            tutorial
        } = this.props;
        const { data: workersData, loadingData: loadingWorkers, filter } = workers;
        const { data: dataTypes, loading: loadingTypes } = types;
        const { data: dataServices, loading: loadingServices } = services;
        const { data: dataFilials, loading: loadingFilials } = filials;

        const data = this.filterData();

        if (
            workersData === null || loadingWorkers
            || dataTypes === null || loadingTypes
            || dataServices === null || loadingServices
            || dataFilials === null || loadingFilials
        ) {
            return (
                <div className="workers page">
                    <Preloader />
                </div>
            );
        }

        return (
            <section className="workers page">
                <Row gutter={15} className="workers__items">
                    <Col span={24} className="workers__items_add">
                        <Button type="dashed" onClick={this.addWorker} style={{ fontSize: 18 }}>
                            <Icon type="plus" style={{ fontSize: 24 }} />
                            <br />
                            Добавить сотрудника
                        </Button>
                    </Col>
                </Row>
                <Row gutter={15} className="workers__filter">
                    <Col lg={6}>
                        <Form.Item>
                            <Select
                                placeholder="Тип персонала"
                                loading={loadingTypes}
                                style={{ width: '100%' }}
                                onChange={this.onChangeType}
                                value={filter.type ? filter.type : []}
                                allowClear
                            >
                                {dataTypes.map(type => <Option key={type.id} value={type.id}>{type.name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col lg={6}>
                        <Form.Item>
                            <Select
                                placeholder="Филиал"
                                loading={loadingFilials}
                                style={{ width: '100%' }}
                                onChange={this.onChangeFilial}
                                value={filter.filial ? filter.filial : []}
                                allowClear
                            >
                                {dataFilials.map(filial => <Option key={filial.id} value={filial.id}>{filial.name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col lg={6}>
                        <Form.Item>
                            <Select
                                placeholder="Список услуг"
                                loading={loadingServices}
                                mode="multiple"
                                style={{ width: '100%' }}
                                onChange={this.onSelectSpeciality}
                                optionFilterProp="children"
                                value={filter.speciality ? filter.speciality : []}
                                allowClear
                            >
                                {dataServices.map(service => <Option key={service.id} value={service.id}>{service.name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col lg={6}>
                        <Form.Item>
                            <Select
                                placeholder="Специалист"
                                loading={loadingWorkers}
                                mode="multiple"
                                style={{ width: '100%' }}
                                onChange={this.onSelectWorker}
                                optionFilterProp="children"
                                value={filter.doctors ? filter.doctors : []}
                                allowClear
                            >
                                {workersData.map(worker => <Option key={worker.id} value={worker.id}>{getFullNameWorker(worker)}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={15} className="workers__items">
                    {data !== null ? (
                        data
                            .map(item => (
                            <WorkerItem
                                key={item.id}
                                id={+item.id}
                                userID={+item.user_id}
                                name={getFullNameWorker(item)}
                                description={item.description}
                                img={item.photo}
                                viewWorker={this.viewWorker}
                                editWorker={this.editWorker}
                                removeWorker={this.removeWorker}
                            />
                        ))
                    ) : null}
                </Row>
                <DelayUnmountingCreateWorker delayTime={300} isMounted={workers.drawerCreate} />
                <DelayUnmountingUpdateWorker delayTime={300} isMounted={workers.drawerUpdate} />
                {tutorial.active && tutorial.lastTutorial === 'addWorkers' ? <Tutorial ref={this.introJsRef} /> : null}
            </section>
        );
    }
}

WorkersPage.propTypes = {
    dispatch: PropTypes.func.isRequired,
    workers: PropTypes.object.isRequired,
    types: PropTypes.object.isRequired,
    services: PropTypes.object.isRequired,
    filials: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    tutorial: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    workers: state.workers,
    types: state.types,
    services: state.services,
    filials: state.filials,
    auth: state.auth,
    ws: state.ws,
    tutorial: state.tutorial
});

const wrapper = compose(
    connect(mapStateToProps),
    WrapperContent
);

export default wrapper(WorkersPage);
