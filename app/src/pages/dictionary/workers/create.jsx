import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';

import {
    Row,
    Col,
    Drawer,
    Form,
    Input,
    InputNumber,
    Select,
    Upload,
    Icon,
    TimePicker,
    DatePicker,
    Divider,
    Button,
    Table,
    Switch
} from 'antd';

import { history } from '../../../store';
import {
    DICTIONARY_WORKERS_ROUTE,
    DICTIONARY_FILIALS_ROUTE,
    DICTIONARY_SERVICES_ROUTE,
    DICTIONARY_TYPES_ROUTE
} from '../../../constans/routes';
import localDatePicker from '../../../constans/ruLocalePicker';
import { workerScheduleColumns, defaultWorkerSchedule } from '../../../constans/schedule';
import { switchDrawer, createWorkersAction } from './actions';

const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;
const { Column, ColumnGroup } = Table;
const { RangePicker } = DatePicker;

class CreateWorker extends Component {
    state = {
        workerImageFile: null,
        workerImagePreview: null,
        timePickerShift: {
            start: false,
            end: false
        },
        workerSchedule: defaultWorkerSchedule,
        editableSchedule: false,
        addedSchedule: null,
        workerHolidays: [],
        editableHolidays: null,
        creatingNewSchedule: true
    }

    componentDidMount() {
        const { form } = this.props;
        form.resetFields();
    }

    // schedule handlers

    clearFieldsShift = () => {
        const { form } = this.props;
        const namesFields = [
            'worker_shift',
            'worker_day',
            'worker_day_parity',
            'worker_shift_start',
            'worker_shift_end',
            'worker_interval'
        ];
        const errorFields = {};
        for (let i = 0; i < namesFields.length; i++) {
            errorFields[namesFields[i]] = { errors: null };
        }
        form.resetFields(namesFields);
        form.setFields(errorFields);
    }

    onAddShift = (shift, day, parity) => {
        const { editableSchedule, addedSchedule } = this.state;

        if (editableSchedule) {
            this.clearFieldsShift();
            this.setState({
                editableSchedule: false,
                addedSchedule: addedSchedule === null ? [{ shift, day, parity }] : [...addedSchedule, { shift, day, parity }]
            });
        } else if (addedSchedule && addedSchedule.filter(i => +i.shift !== +shift).length) {
            this.setState({ addedSchedule: [{ shift, day, parity }] });
        } else if (addedSchedule && addedSchedule.filter(i => +i.shift === +shift && i.day === day && i.parity === parity).length) {
            if (addedSchedule.length === 1) {
                this.setState({ addedSchedule: null });
            } else {
                this.setState({ addedSchedule: addedSchedule.filter(i => +i.shift !== +shift || i.day !== day || i.parity !== parity) });
            }
        } else {
            this.setState({ addedSchedule: addedSchedule === null ? [{ shift, day, parity }] : [...addedSchedule, { shift, day, parity }] });
        }
    }

    onRemoveShift = (shift, day, parity) => {
        this.setState((prevState) => {
            const workerSchedule = prevState.workerSchedule.map((item) => {
                if (+shift === +item.key) {
                    return {
                        ...item,
                        [day]: {
                            parity: {
                                ...item[day].parity,
                                [parity]: null
                            }
                        }
                    };
                }
                return item;
            });
            return { ...prevState, workerSchedule };
        });
    }

    onEditShift = (shift, day, parity) => {
        const { form } = this.props;
        const { workerSchedule } = this.state;
        const namesFields = [
            'worker_shift_start',
            'worker_shift_end',
            'worker_interval'
        ];
        let fields;

        workerSchedule.forEach((item) => {
            if (+item.key === +shift) {
                fields = item[day].parity[parity];
            }
        });
        form.setFieldsValue({
            [namesFields[0]]: fields.timeStart,
            [namesFields[1]]: fields.timeEnd,
            [namesFields[2]]: fields.interval
        });
        this.setState({
            editableSchedule: true,
            addedSchedule: [{ shift, day, parity }]
        });
    }

    onCloseShift = () => {
        this.clearFieldsShift();
        this.setState({ editableSchedule: false, addedSchedule: null });
    }

    onSaveShift = () => {
        const { form } = this.props;
        const { editableSchedule, addedSchedule } = this.state;
        const namesFields = [
            'worker_shift_start',
            'worker_shift_end',
            'worker_interval'
        ];
        form.validateFields(namesFields, {}, (err, fields) => {
            const messageError = {
                required: '?????????????????? ?????? ????????!',
                interval: '?????? ???????? ???? ?????????? ???????? 0!',
                shift_end: '?????????? ?????????? ???????????? ?????? ?????????? ???????????? ??????????!'
            };
            const errorFields = {};

            for (const key in fields) {
                if (fields[key] === undefined || fields[key] === '' || fields[key] === null) {
                    errorFields[key] = { errors: [new Error(messageError.required)] };
                }
                if (key === 'worker_interval' && +fields[key] === 0) {
                    errorFields[key] = { errors: [new Error(messageError.interval)] };
                }
            }

            if (
                fields.worker_shift_start !== undefined
                && fields.worker_shift_end !== undefined
                && +fields.worker_shift_start.format('x') >= +fields.worker_shift_end.format('x')
            ) {
                errorFields.worker_shift_end = { errors: [new Error(messageError.shift_end)] };
            }

            if (!Object.keys(errorFields).length) {
                this.setState((prevState) => {
                    const workerSchedule = prevState.workerSchedule.map((item) => {
                        let newItem = item;
                        prevState.addedSchedule.forEach((shift) => {
                            if (+shift.shift === +newItem.key) {
                                newItem = {
                                    ...newItem,
                                    [shift.day]: {
                                        parity: {
                                            ...newItem[shift.day].parity,
                                            [shift.parity]: {
                                                timeStart: fields.worker_shift_start,
                                                timeEnd: fields.worker_shift_end,
                                                interval: fields.worker_interval
                                            }
                                        }
                                    }
                                };
                            }
                        });
                        return newItem;
                    });
                    return { ...prevState, workerSchedule };
                });
                this.clearFieldsShift();
                if (editableSchedule) {
                    this.setState({ editableSchedule: false });
                }
                if (addedSchedule) {
                    this.setState({ addedSchedule: null });
                }
            } else {
                form.setFields(errorFields);
            }
        });
    }

    // holidays handlers

    clearFieldsHolidays = () => {
        const { form } = this.props;
        form.resetFields(['worker_holidays']);
    }

    onAddHolidays = () => {
        const { form } = this.props;
        const range = form.getFieldValue('worker_holidays');
        if (range !== undefined) {
            this.setState(prevState => ({
                ...prevState,
                workerHolidays: [...prevState.workerHolidays, {
                    startHolidays: range[0],
                    endHolidays: range[1]
                }]
            }));
            form.resetFields(['worker_holidays']);
        }
    }

    onRemoveHolidays = (index) => {
        this.setState(prevState => ({
            ...prevState,
            workerHolidays: prevState.workerHolidays.filter((val, i) => i !== index)
        }));
    }

    onEditHolidays = (index) => {
        const { form } = this.props;
        const { workerHolidays } = this.state;
        const editedRange = workerHolidays.filter((val, i) => i === index)[0];

        form.setFieldsValue({ worker_holidays: [editedRange.startHolidays, editedRange.endHolidays] });
        this.setState({ editableHolidays: { index } });
    }

    onCloseEditHolidays = () => {
        this.clearFieldsHolidays();
        this.setState({ editableHolidays: false });
    }

    onSaveEditHolidays = () => {
        const { form } = this.props;
        const { editableHolidays } = this.state;
        const { index } = editableHolidays;
        const range = form.getFieldValue('worker_holidays');

        this.setState(prevState => ({
            ...prevState,
            workerHolidays: prevState.workerHolidays.map((item, i) => {
                if (i === index) {
                    return {
                        startHolidays: range[0],
                        endHolidays: range[1]
                    };
                }
                return item;
            }),
            editableHolidays: null
        }));
        this.clearFieldsHolidays();
    }

    // other handlers

    onSubmit = (e) => {
        e.preventDefault();
        const { dispatch, form, auth } = this.props;
        const { workerImageFile, workerSchedule, workerHolidays } = this.state;
        const { token } = auth;

        form.validateFields((err, values) => {
            if (!err) {
                const sendValues = {
                    ...values,
                    worker_photo: workerImageFile,
                    worker_schedule: !this.isEmptySchedule() ? workerSchedule : [],
                    worker_holidays: workerHolidays
                };
                dispatch(createWorkersAction(sendValues, token));
            } else {
                console.log('error field');
            }
        });
    }

    onTimeChange = (type) => {
        const { timePickerShift } = this.state;
        this.setState(prevState => ({
            ...prevState,
            timePickerShift: { ...timePickerShift, [type]: !timePickerShift[type] }
        }));
    }

    onClose = () => {
        const { dispatch } = this.props;
        dispatch(switchDrawer('hide_create'));
        setTimeout(() => { history.push(DICTIONARY_WORKERS_ROUTE); }, 300);
    }

    // methods

    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    isEmptySchedule = () => {
        const { workerSchedule } = this.state;
        let totalCountFields = 0;
        let countEmptyesFields = 0;

        for (let shift = 0; shift < workerSchedule.length; shift++) {
            for (const day in workerSchedule[shift]) {
                for (const parity in workerSchedule[shift][day].parity) {
                    totalCountFields++;
                    if (workerSchedule[shift][day].parity[parity] === null) {
                        countEmptyesFields++;
                    }
                }
            }
        }

        return totalCountFields === countEmptyesFields;
    }

    disabledDate = current => (current && current < moment().endOf('day'))

    render() {
        const isMobile = window.matchMedia('(max-width: 991px)').matches;
        const {
            form,
            workers,
            types,
            services,
            filials,
            auth
        } = this.props;
        const {
            workerImagePreview,
            timePickerShift,
            workerSchedule,
            editableSchedule,
            addedSchedule,
            workerHolidays,
            editableHolidays,
            creatingNewSchedule
        } = this.state;

        const { getFieldDecorator } = form;
        const { data: dataTypes } = types;
        const { data: dataServices } = services;
        const { data: dataFilials } = filials;
        const { tariff } = auth;
        const propsDragger = {
            name: 'photo',
            multiple: false,
            action: '',
            accept: '.png,.jpg,.jpeg',
            showUploadList: false,
            customRequest: () => false,
            onChange: (data) => {
                this.setState({ workerImageFile: data.file.originFileObj });
                const reader = new FileReader();
                reader.readAsDataURL(data.file.originFileObj);
                reader.onloadend = () => {
                    this.setState({ workerImagePreview: reader.result });
                };
            }
        };

        const workerType = form.getFieldValue('worker_type');
        const countDoctors = workers.data ? workers.data.filter(worker => worker.type_id === 2).length : 0;
        const availibleAddDoctor = tariff.countWorkers !== 0 && +countDoctors < +tariff.countWorkers;

        return (
            <Drawer
                title="?????????????? ????????????????????"
                width={isMobile ? '100%' : '50%'}
                onClose={this.onClose}
                visible={workers.drawerCreate}
            >
                <Form layout="vertical" onSubmit={this.onSubmit}>
                    <Col span={24}>
                        <Divider>???????????????? ????????????????????</Divider>
                    </Col>
                    <Row gutter={15} className="worker-main-info">
                        <Col xs={24} md={12}>
                            <Form.Item className="workers__form_photo-wrap">
                            {getFieldDecorator('worker_photo', {
                                    rules: [{ required: false, message: '?????????????????? ?????? ????????!' }]
                                })(
                                    <Dragger {...propsDragger}>
                                        {workerImagePreview ? (
                                            <div style={{ backgroundImage: `url(${workerImagePreview})` }} className="workers__form_photo" />
                                        ) : (
                                            <>
                                                <p className="ant-upload-drag-icon">
                                                    <Icon type="file-image" />
                                                </p>
                                                <p className="ant-upload-text">
                                                    ???????????????? ??????????????????????
                                                    <br />
                                                    ??????
                                                    <br />
                                                    ???????????????????? ?? ?????? ??????????????
                                                </p>
                                            </>
                                        )}
                                    </Dragger>
                                )}
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="??????????????">
                                {getFieldDecorator('worker_last_name', {
                                    rules: [{ required: true, message: '?????????????????? ?????? ????????!' }]
                                })(
                                    <Input placeholder="?????????????? ????????????????????" />
                                )}
                            </Form.Item>
                            <Form.Item label="??????">
                                {getFieldDecorator('worker_first_name', {
                                    rules: [{ required: true, message: '?????????????????? ?????? ????????!' }]
                                })(
                                    <Input placeholder="?????? ????????????????????" />
                                )}
                            </Form.Item>
                            <Form.Item label="????????????????">
                                {getFieldDecorator('worker_second_name', {
                                    rules: [{ required: true, message: '?????????????????? ?????? ????????!' }]
                                })(
                                    <Input placeholder="???????????????? ????????????????????" />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={15}>
                        <Col xs={24} md={12}>
                            <Form.Item label="?????? ??????????????????" className="worker-additional-info-type">
                                {getFieldDecorator('worker_type', {
                                    rules: [{ required: true, message: '?????????????????? ?????? ????????!' }]
                                })(
                                    <Select placeholder="???????????????? ??????" loading={false} notFoundContent="?????? ????????????">
                                        {dataTypes.map(item => (
                                            <Option key={item.id} value={item.id} disabled={(tariff.id !== 1 && item.id === 2 && !availibleAddDoctor) || false}>
                                                {item.name}
                                                {tariff.id !== 1 && item.id === 2 && !availibleAddDoctor ? <span style={{ color: 'red', fontSize: '12px' }}>&nbsp;(???????????????? ?????????? ????????????)</span> : null}
                                            </Option>
                                        ))}
                                    </Select>,
                                )}
                                <Link to={DICTIONARY_TYPES_ROUTE}>?????????????? ?????? ??????????????????</Link>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="???????????? ??????????" className="worker-additional-info-services">
                                {getFieldDecorator('worker_services', {
                                    rules: [{ required: false }]
                                })(
                                    <Select placeholder="???????????????? ????????????" mode="multiple" loading={false} notFoundContent="?????? ????????????">
                                        {dataServices.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                                    </Select>,
                                )}
                                <Link to={DICTIONARY_SERVICES_ROUTE}>?????????????? ????????????</Link>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="?????????? ????????????" className="worker-additional-info-filial">
                                {getFieldDecorator('worker_place', {
                                    rules: [{ required: true, message: '?????????????????? ?????? ????????!' }]
                                })(
                                    <Select placeholder="???????????????? ????????????" loading={false} notFoundContent="?????? ????????????">
                                        <Option key={0} value={0}>- ???? ?????????????? -</Option>
                                        {dataFilials.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                                    </Select>,
                                )}
                                <Link to={DICTIONARY_FILIALS_ROUTE}>?????????????? ????????????</Link>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="????????????????">
                                {getFieldDecorator('worker_description', {
                                    rules: [{ required: false }],
                                })(
                                    <TextArea placeholder="???????????????? ????????????????????" autosize={{ minRows: 2, maxRows: 6 }} />,
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    {workerType && workerType === 2 ? (
                        <>
                            <Row gutter={15} className="worker-additional-info-schedule">
                                <Col span={24}>
                                    <Divider>???????????? ????????????</Divider>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="???????????? ???????????? ???????????????? ?? ????????">
                                        {getFieldDecorator('worker_starts_working', {
                                            rules: [{ required: creatingNewSchedule, message: '?????????????????? ?????? ????????!' }]
                                        })(
                                            <DatePicker
                                                showTime={false}
                                                showToday={false}
                                                format="DD.MM.YYYY"
                                                disabledDate={this.disabledDate}
                                                onChange={data => (data ? data.set({ hour: 0, minute: 0, second: 0 }) : moment().add(1, 'day').set({ hour: 0, minute: 0, second: 0 }))}
                                                defaultPickerValue={moment().add(1, 'day')}
                                                locale={localDatePicker}
                                                placeholder="???????????????? ???????? ?? ??????????"
                                                disabled={!creatingNewSchedule}
                                            />,
                                        )}
                                    </Form.Item>
                                    <Table
                                        className="workers-schedule-table"
                                        dataSource={workerSchedule}
                                        scroll={{ x: 1710 }}
                                        pagination={false}
                                        bordered
                                        locale={{ emptyText: '?????? ????????????' }}
                                    >
                                        <Column title="??????????" width={100} dataIndex="shift" key="shift" fixed="left" align="center" />
                                        {workerScheduleColumns.map(column => (
                                            <ColumnGroup title={column.day} className="workers-schedule-table_group-title" key={`${column.day}group`}>
                                                <Column
                                                    title="????????????"
                                                    dataIndex={column.dayKey}
                                                    key={`${column.dayKey}${column.parity.evenKey}`}
                                                    align="center"
                                                    width={115}
                                                    render={(item, object) => (
                                                        <div className={`workers-schedule-table__item ${item.parity.even !== null ? 'active' : ''}`}>
                                                            {item.parity.even !== null ? (
                                                                <>
                                                                    <span className="workers-schedule-table__item_time">
                                                                        {item.parity.even.timeStart.format('HH:mm')}
                                                                        -
                                                                        {item.parity.even.timeEnd.format('HH:mm')}
                                                                    </span>
                                                                    <div className="workers-schedule-table__item__actions">
                                                                        <button
                                                                            type="button"
                                                                            className="workers-schedule-table__item__actions_edit"
                                                                            onClick={() => this.onEditShift(object.key, column.dayKey, column.parity.evenKey)}
                                                                        >
                                                                            <Icon type="edit" />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="workers-schedule-table__item__actions_remove"
                                                                            onClick={() => this.onRemoveShift(object.key, column.dayKey, column.parity.evenKey)}
                                                                        >
                                                                            <Icon type="delete" />
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div
                                                                    className={`workers-schedule-table__item__actions ${
                                                                            addedSchedule
                                                                            && +addedSchedule.filter(i => +i.shift === +object.key && i.day === column.dayKey && i.parity === column.parity.evenKey).length
                                                                            ? 'selected' : ''
                                                                        }`}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        className="workers-schedule-table__item__actions_add"
                                                                        onClick={() => this.onAddShift(object.key, column.dayKey, column.parity.evenKey)}
                                                                    >
                                                                        <Icon type="plus-circle" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                />
                                                <Column
                                                    title="????????????????"
                                                    dataIndex={column.dayKey}
                                                    key={`${column.dayKey}${column.parity.oddKey}`}
                                                    align="center"
                                                    width={115}
                                                    render={(item, object) => (
                                                        <div className={`workers-schedule-table__item ${item.parity.odd !== null ? 'active' : ''}`}>
                                                            {item.parity.odd !== null ? (
                                                                <>
                                                                    <span className="workers-schedule-table__item_time">
                                                                        {item.parity.odd.timeStart.format('HH:mm')}
                                                                        -
                                                                        {item.parity.odd.timeEnd.format('HH:mm')}
                                                                    </span>
                                                                    <div className="workers-schedule-table__item__actions">
                                                                        <button
                                                                            type="button"
                                                                            className="workers-schedule-table__item__actions_edit"
                                                                            onClick={() => this.onEditShift(object.key, column.dayKey, column.parity.oddKey)}
                                                                        >
                                                                            <Icon type="edit" />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            className="workers-schedule-table__item__actions_remove"
                                                                            onClick={() => this.onRemoveShift(object.key, column.dayKey, column.parity.oddKey)}
                                                                        >
                                                                            <Icon type="delete" />
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className={`workers-schedule-table__item__actions ${
                                                                            addedSchedule
                                                                            && +addedSchedule.filter(i => +i.shift === +object.key && i.day === column.dayKey && i.parity === column.parity.oddKey).length
                                                                            ? 'selected' : ''
                                                                        }`}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        className="workers-schedule-table__item__actions_add"
                                                                        onClick={() => this.onAddShift(object.key, column.dayKey, column.parity.oddKey)}
                                                                    >
                                                                        <Icon type="plus-circle" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                />
                                            </ColumnGroup>
                                        ))}
                                    </Table>
                                    <br />
                                </Col>
                            </Row>
                            <Row gutter={15} style={{ display: addedSchedule || editableSchedule ? 'block' : 'none' }}>
                                <Col xs={24} md={12}>
                                    <Form.Item label="???????????? ??????????">
                                        {getFieldDecorator('worker_shift_start', {
                                            rules: [{ required: false }]
                                        })(
                                            <TimePicker
                                                format="HH:mm"
                                                placeholder="???????????????? ??????????"
                                                minuteStep={5}
                                                open={timePickerShift.start}
                                                onOpenChange={() => this.onTimeChange('start')}
                                            />,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="?????????? ??????????">
                                        {getFieldDecorator('worker_shift_end', {
                                            rules: [{ required: false }]
                                        })(
                                            <TimePicker
                                                format="HH:mm"
                                                placeholder="???????????????? ??????????"
                                                minuteStep={5}
                                                open={timePickerShift.end}
                                                onOpenChange={() => this.onTimeChange('end')}
                                            />,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="???????????????? ????????????">
                                        {getFieldDecorator('worker_interval', {
                                            rules: [{ required: false }]
                                        })(
                                            <Input
                                                suffix="??????."
                                                placeholder="?????????????? ????????????????"
                                            />,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                    {editableSchedule ? (
                                        <>
                                            <Button htmlType="button" type="primary" size="large" onClick={() => this.onSaveShift()}>
                                                ?????????????????? ??????????
                                                <Icon type="save" />
                                            </Button>
                                            <Button htmlType="button" className="workers_btn-edit-schedule-close" size="large" onClick={() => this.onCloseShift()}>
                                                ??????????????
                                                <Icon type="close" />
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button htmlType="button" type="primary" size="large" onClick={() => this.onSaveShift()}>
                                                ???????????????? ??????????
                                                <Icon type="plus" />
                                            </Button>
                                            <Button htmlType="button" className="workers_btn-edit-schedule-close" size="large" onClick={() => this.onCloseShift()}>
                                                ??????????????
                                                <Icon type="close" />
                                            </Button>
                                        </>
                                    )}
                                    <br />
                                    <br />
                                </Col>
                            </Row>
                        </>
                    ) : null}
                    <Row gutter={15}>
                        <Col span={24}>
                            <Divider>???????????? ????????????????</Divider>
                        </Col>
                        <Col span={24}>
                            <Table dataSource={workerHolidays} rowKey={(record, i) => i} locale={{ emptyText: '?????? ????????????' }} pagination={false}>
                                <Column
                                    key="holiday_start_column"
                                    title="???????????? ??????????????"
                                    dataIndex="startHolidays"
                                    render={item => item.format('dddd, DD MMMM YYYY')}
                                />
                                <Column
                                    key="holiday_end_column"
                                    title="?????????? ??????????????"
                                    dataIndex="endHolidays"
                                    render={item => item.format('dddd, DD MMMM YYYY')}
                                />
                                <Column
                                    key="holiday_actions"
                                    title="????????????????"
                                    render={(item, record, index) => (
                                        <>
                                            <Button onClick={() => this.onEditHolidays(index)}><Icon type="edit" /></Button>
                                            <Button type="danger" onClick={() => this.onRemoveHolidays(index)}><Icon type="delete" /></Button>
                                        </>
                                    )}
                                />
                            </Table>
                            <br />
                        </Col>
                        <Col span={24}>
                            <Form.Item label="???????????? ??????????????">
                                {getFieldDecorator('worker_holidays', {
                                    rules: [{ required: false, message: '?????????????????? ?????? ????????!' }],
                                })(
                                    <RangePicker placeholder={['????????????', '??????????']} format="DD.MM.YYYY" />,
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            {editableHolidays ? (
                                <>
                                    <Button htmlType="button" type="primary" size="large" onClick={() => this.onSaveEditHolidays()}>
                                        ?????????????????? ????????????
                                        <Icon type="save" />
                                    </Button>
                                    <Button htmlType="button" className="workers_btn-edit-holidays-close" size="large" onClick={() => this.onCloseEditHolidays()}>
                                        ??????????????
                                        <Icon type="close" />
                                    </Button>
                                </>
                            ) : (
                                <Button htmlType="button" type="primary" size="large" onClick={() => this.onAddHolidays()}>
                                    ???????????????? ????????????
                                    <Icon type="plus" />
                                </Button>
                            )}
                            <br />
                        </Col>
                    </Row>
                    <Row gutter={15}>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            <Divider />
                            <Button htmlType="submit" type="primary" size="large" loading={workers.loading}>
                                ???????????????? ????????????????????
                                <Icon type="plus" />
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        );
    }
}

CreateWorker.propTypes = {
    workers: PropTypes.object.isRequired,
    types: PropTypes.object.isRequired,
    services: PropTypes.object.isRequired,
    filials: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    workers: state.workers,
    types: state.types,
    services: state.services,
    filials: state.filials,
    auth: state.auth
});

const wrappedComponent = compose(
    connect(mapStateToProps),
    Form.create()
);

export default wrappedComponent(CreateWorker);
