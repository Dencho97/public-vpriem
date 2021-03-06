import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
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
    Typography,
    Timeline,
    Menu,
    Dropdown,
    Switch,
    Popconfirm
} from 'antd';
import moment from 'moment';

import { history } from '../../../store';
import {
    DICTIONARY_WORKERS_ROUTE,
    DICTIONARY_FILIALS_ROUTE,
    DICTIONARY_SERVICES_ROUTE,
    DICTIONARY_TYPES_ROUTE
} from '../../../constans/routes';
import localDatePicker from '../../../constans/ruLocalePicker';
import { workerScheduleColumns, defaultWorkerSchedule } from '../../../constans/schedule';
import {
    switchDrawer,
    editWorkersAction,
    removeScheduleAction
} from './actions';

const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;
const { Column, ColumnGroup } = Table;
const { RangePicker } = DatePicker;
const { Paragraph } = Typography;

class UpdateWorker extends Component {
    constructor(props) {
        super(props);
        const worker = this.getWorker();

        this.state = {
            id: worker.id,
            workerImageFile: null,
            workerImagePreview: worker.photo,
            timePickerShift: {
                start: false,
                end: false
            },
            workerSchedule: defaultWorkerSchedule,
            editableSchedule: false,
            addedSchedule: null,
            workerHolidays: worker.holidays,
            editableHolidays: null,
            activeĐˇhronologySchedule: {
                id: +worker.schedule_id,
                schedule: worker.schedule,
                starts_working: worker.starts_working,
                starts_working_next: this.getNextStartsWorking(worker.schedule_id)
            },
            creatingNewSchedule: false
        };
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
                required: 'Đ—Đ°ĐżĐľĐ»Đ˝Đ¸Ń‚Đµ ŃŤŃ‚Đľ ĐżĐľĐ»Đµ!',
                interval: 'Đ­Ń‚Đľ ĐżĐľĐ»Đµ Đ˝Đµ ĐĽĐľĐ¶ĐµŃ‚ Đ±Ń‹Ń‚ŃŚ 0!',
                shift_end: 'ĐšĐľĐ˝ĐµŃ† Ń?ĐĽĐµĐ˝Ń‹ ĐĽĐµĐ˝ŃŚŃ?Đµ Đ¸Đ»Đ¸ Ń€Đ°Đ˛Đ˝Đľ Đ˝Đ°Ń‡Đ°Đ»Ń? Ń?ĐĽĐµĐ˝Ń‹!'
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

    onChangeĐˇhronologySchedule = (idSchedule) => {
        const worker = this.getWorker();
        const selectedSchedule = worker.schedules_all.filter(item => +item.id === +idSchedule)[0];
        this.setState({
            activeĐˇhronologySchedule: {
                id: +selectedSchedule.id,
                schedule: selectedSchedule.schedule,
                starts_working: selectedSchedule.starts_working,
                starts_working_next: this.getNextStartsWorking(selectedSchedule.id)
            }
        });
    }

    onAddNewSchedule = (e) => {
        const { key } = e;

        if (key === 'new') {
            this.setState({
                creatingNewSchedule: true,
                workerSchedule: defaultWorkerSchedule
            });
        } else {
            const worker = this.getWorker();
            this.setState({
                creatingNewSchedule: true,
                workerSchedule: worker.schedules_all.filter(item => +item.id === +key)[0].schedule
            });
        }
    }

    onRemoveSchedule = (scheduleID, workerID) => {
        const { dispatch, auth } = this.props;
        const { token } = auth;
        dispatch(removeScheduleAction(scheduleID, workerID, token));
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
        const {
            id,
            workerImageFile,
            workerSchedule,
            workerHolidays,
            creatingNewSchedule
        } = this.state;
        const { token } = auth;
        const worker = this.getWorker();
        let newWorkerSchedule = [];

        if (!worker.schedules_all.length) {
            newWorkerSchedule = !this.isEmptySchedule() ? workerSchedule : [];
        } else if (worker.schedules_all.length && creatingNewSchedule) {
            newWorkerSchedule = workerSchedule;
        }

        form.validateFields((err, values) => {
            if (!err) {
                const sendValues = {
                    ...values,
                    worker_id: id,
                    worker_photo: workerImageFile,
                    worker_schedule: newWorkerSchedule,
                    worker_holidays: workerHolidays
                };

                dispatch(editWorkersAction(sendValues, token));
                form.resetFields();
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
        dispatch(switchDrawer('hide_update'));
        setTimeout(() => { history.push(DICTIONARY_WORKERS_ROUTE); }, 300);
    }

    // methods

    getWorker = () => {
        const { workers } = this.props;
        const id = this.getWorkerId();

        return workers.data.filter(item => item.id === id)[0];
    }

    getWorkerId = () => {
        const { workers } = this.props;
        const url = window.location.pathname.split('/');

        return workers.editing ? +workers.editing : +url[url.length - 1];
    }

    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    disabledDate = (current, workerSchedules) => {
        if (workerSchedules && workerSchedules.length) {
            const lastScheduleStartsDate = workerSchedules[workerSchedules.length - 1].starts_working;
            if (current.format('MM') === lastScheduleStartsDate.format('MM')) {
                return current < lastScheduleStartsDate.endOf('day') || current < moment();
            }
            return current < moment().endOf('day');
        }
        return current < moment().endOf('day');
    }

    getNextStartsWorking = (currendScheduleID) => {
        const worker = this.getWorker();
        let nextStartsWorking = null;

        if (worker.schedules_all.length > 1) {
            worker.schedules_all.forEach((item, i) => {
                if (+item.id === +currendScheduleID && worker.schedules_all[i + 1] !== undefined) {
                    nextStartsWorking = worker.schedules_all[i + 1].starts_working;
                }
            });
        }

        return nextStartsWorking;
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
            activeĐˇhronologySchedule,
            creatingNewSchedule
        } = this.state;

        const { getFieldDecorator } = form;
        const { data: dataTypes } = types;
        const { data: dataServices } = services;
        const { data: dataFilials } = filials;
        const { tariff } = auth;
        const worker = this.getWorker();
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
        const workerType = form.getFieldValue('worker_type') !== undefined ? +form.getFieldValue('worker_type') : +worker.type_id;
        const countDoctors = workers.data ? workers.data.filter(item => item.type_id === 2).length : 0;
        const availibleAddDoctor = tariff.countWorkers !== 0 && +countDoctors < +tariff.countWorkers;

        return (
            <Drawer
                title="ĐžĐ±Đ˝ĐľĐ˛Đ¸Ń‚ŃŚ Ń?ĐľŃ‚Ń€Ń?Đ´Đ˝Đ¸ĐşĐ°"
                width={isMobile ? '100%' : '50%'}
                onClose={this.onClose}
                visible={workers.drawerUpdate}
            >
                <Form layout="vertical" onSubmit={this.onSubmit}>
                    <Col span={24}>
                        <Divider>ĐžŃ?Đ˝ĐľĐ˛Đ˝Đ°ŃŹ Đ¸Đ˝Ń„ĐľŃ€ĐĽĐ°Ń†Đ¸ŃŹ</Divider>
                    </Col>
                    <Row gutter={15}>
                        <Col xs={24} md={12}>
                            <Form.Item className="workers__form_photo-wrap">
                            {getFieldDecorator('worker_photo', {
                                    rules: [{ required: false, message: 'Đ—Đ°ĐżĐľĐ»Đ˝Đ¸Ń‚Đµ ŃŤŃ‚Đľ ĐżĐľĐ»Đµ!' }]
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
                                                    Đ’Ń‹Đ±ĐµŃ€Đ¸Ń‚Đµ Đ¸Đ·ĐľĐ±Ń€Đ°Đ¶ĐµĐ˝Đ¸Đµ
                                                    <br />
                                                    Đ¸Đ»Đ¸
                                                    <br />
                                                    ĐżĐµŃ€ĐµŃ‚Đ°Ń‰Đ¸Ń‚Đµ Đ˛ ŃŤŃ‚Ń? ĐľĐ±Đ»Đ°Ń?Ń‚ŃŚ
                                                </p>
                                            </>
                                        )}
                                    </Dragger>
                                )}
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Đ¤Đ°ĐĽĐ¸Đ»Đ¸ŃŹ">
                                {getFieldDecorator('worker_last_name', {
                                    rules: [{ required: true, message: 'Đ—Đ°ĐżĐľĐ»Đ˝Đ¸Ń‚Đµ ŃŤŃ‚Đľ ĐżĐľĐ»Đµ!' }],
                                    initialValue: worker.last_name
                                })(
                                    <Input placeholder="Đ¤Đ°ĐĽĐ¸Đ»Đ¸ŃŹ Ń?ĐľŃ‚Ń€Ń?Đ´Đ˝Đ¸ĐşĐ°" />
                                )}
                            </Form.Item>
                            <Form.Item label="Đ?ĐĽŃŹ">
                                {getFieldDecorator('worker_first_name', {
                                    rules: [{ required: true, message: 'Đ—Đ°ĐżĐľĐ»Đ˝Đ¸Ń‚Đµ ŃŤŃ‚Đľ ĐżĐľĐ»Đµ!' }],
                                    initialValue: worker.first_name
                                })(
                                    <Input placeholder="Đ?ĐĽŃŹ Ń?ĐľŃ‚Ń€Ń?Đ´Đ˝Đ¸ĐşĐ°" />
                                )}
                            </Form.Item>
                            <Form.Item label="ĐžŃ‚Ń‡ĐµŃ?Ń‚Đ˛Đľ">
                                {getFieldDecorator('worker_second_name', {
                                    rules: [{ required: true, message: 'Đ—Đ°ĐżĐľĐ»Đ˝Đ¸Ń‚Đµ ŃŤŃ‚Đľ ĐżĐľĐ»Đµ!' }],
                                    initialValue: worker.second_name
                                })(
                                    <Input placeholder="ĐžŃ‚Ń‡ĐµŃ?Ń‚Đ˛Đľ Ń?ĐľŃ‚Ń€Ń?Đ´Đ˝Đ¸ĐşĐ°" />
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={15}>
                        <Col xs={24} md={12}>
                            <Form.Item label="Đ˘Đ¸Đż ĐżĐµŃ€Ń?ĐľĐ˝Đ°Đ»Đ°">
                                {getFieldDecorator('worker_type', {
                                    rules: [{ required: true, message: 'Đ—Đ°ĐżĐľĐ»Đ˝Đ¸Ń‚Đµ ŃŤŃ‚Đľ ĐżĐľĐ»Đµ!' }],
                                    initialValue: +worker.type_id
                                })(
                                    <Select placeholder="Đ’Ń‹Đ±ĐµŃ€Đ¸Ń‚Đµ Ń‚Đ¸Đż" loading={false} notFoundContent="ĐťĐµŃ‚ Đ´Đ°Đ˝Đ˝Ń‹Ń…">
                                        {dataTypes.map(item => (
                                            <Option key={item.id} value={+item.id} disabled={(tariff.id !== 1 && item.id === 2 && !availibleAddDoctor) || false}>
                                                {item.name}
                                                {tariff.id !== 1 && item.id === 2 && !availibleAddDoctor ? <span style={{ color: 'red', fontSize: '12px' }}>&nbsp;(Đ?Ń?Ń‡ĐµŃ€ĐżĐ°Đ˝ Đ»Đ¸ĐĽĐ¸Ń‚ Đ˛Ń€Đ°Ń‡ĐµĐą)</span> : null}
                                            </Option>
                                        ))}
                                    </Select>,
                                )}
                                <Link to={DICTIONARY_TYPES_ROUTE}>ĐˇĐľĐ·Đ´Đ°Ń‚ŃŚ Ń‚Đ¸Đż ĐżĐµŃ€Ń?ĐľĐ˝Đ°Đ»Đ°</Link>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="ĐˇĐżĐ¸Ń?ĐľĐş Ń?Ń?Đ»Ń?Đł">
                                {getFieldDecorator('worker_services', {
                                    rules: [{ required: false }],
                                    initialValue: worker.services_ids.length ? worker.services_ids : undefined
                                })(
                                    <Select placeholder="Đ’Ń‹Đ±ĐµŃ€Đ¸Ń‚Đµ Ń?Ń?Đ»Ń?ĐłĐ¸" mode="multiple" loading={false} notFoundContent="ĐťĐµŃ‚ Đ´Đ°Đ˝Đ˝Ń‹Ń…">
                                        {dataServices.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                                    </Select>,
                                )}
                                <Link to={DICTIONARY_SERVICES_ROUTE}>ĐˇĐľĐ·Đ´Đ°Ń‚ŃŚ Ń?Ń?Đ»Ń?ĐłŃ?</Link>
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="ĐśĐµŃ?Ń‚Đľ Ń€Đ°Đ±ĐľŃ‚Ń‹">
                                {getFieldDecorator('worker_place', {
                                    rules: [{ required: true, message: 'Đ—Đ°ĐżĐľĐ»Đ˝Đ¸Ń‚Đµ ŃŤŃ‚Đľ ĐżĐľĐ»Đµ!' }],
                                    initialValue: worker.filial_id ? +worker.filial_id : 0
                                })(
                                    <Select placeholder="Đ’Ń‹Đ±ĐµŃ€Đ¸Ń‚Đµ Ń„Đ¸Đ»Đ¸Đ°Đ»" loading={false} notFoundContent="ĐťĐµŃ‚ Đ´Đ°Đ˝Đ˝Ń‹Ń…">
                                        <Option key={0} value={0}>- ĐťĐµ Đ˛Ń‹Đ±Ń€Đ°Đ˝Đľ -</Option>
                                        {dataFilials.map(item => <Option key={item.id} value={+item.id}>{item.name}</Option>)}
                                    </Select>,
                                )}
                                <Link to={DICTIONARY_FILIALS_ROUTE}>ĐˇĐľĐ·Đ´Đ°Ń‚ŃŚ Ń„Đ¸Đ»Đ¸Đ°Đ»</Link>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="ĐžĐżĐ¸Ń?Đ°Đ˝Đ¸Đµ">
                                {getFieldDecorator('worker_description', {
                                    rules: [{ required: false }],
                                    initialValue: worker.description
                                })(
                                    <TextArea placeholder="ĐžĐżĐ¸Ń?Đ°Đ˝Đ¸Đµ Ń?ĐľŃ‚Ń€Ń?Đ´Đ˝Đ¸ĐşĐ°" autosize={{ minRows: 2, maxRows: 6 }} />,
                                )}
                            </Form.Item>
                        </Col>
                    </Row>
                    {workerType && workerType === 2 ? (
                        <>
                            <Row gutter={15}>
                                <Col span={24}>
                                    <Divider>Đ“Ń€Đ°Ń„Đ¸Đş Ń€Đ°Đ±ĐľŃ‚Ń‹</Divider>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="ĐĄŃ€ĐľĐ˝ĐľĐ»ĐľĐłĐ¸ŃŹ ĐłŃ€Đ°Ń„Đ¸ĐşĐľĐ˛ Ń€Đ°Đ±ĐľŃ‚Ń‹:" style={{ marginBottom: 0 }}>
                                        <Timeline style={{ marginTop: 12 }}>
                                            {worker.schedules_all.map((item) => {
                                                let color = 'green';
                                                if (+item.id === +worker.schedule_id) {
                                                    color = 'red';
                                                } else if (+worker.starts_working.format('x') > +item.starts_working.format('x')) {
                                                    color = 'grey';
                                                } else if (+worker.starts_working.format('x') < +item.starts_working.format('x')) {
                                                    color = 'green';
                                                }
                                                return (
                                                    <Timeline.Item key={item.id} color={color}>
                                                        {activeĐˇhronologySchedule.id === item.id ? (
                                                                <>
                                                                    Đ“Ń€Đ°Ń„Đ¸Đş Ń€Đ°Đ±ĐľŃ‚Ń‹ c&nbsp;
                                                                    {item.starts_working.format('DD.MM.YYYY')}
                                                                    {this.getNextStartsWorking(item.id) ? ` ĐżĐľ ${this.getNextStartsWorking(item.id).format('DD.MM.YYYY')}` : null}
                                                                </>
                                                            ) : (
                                                            <Paragraph style={{ marginBottom: 0 }}>
                                                                <a onClick={() => this.onChangeĐˇhronologySchedule(item.id)}>
                                                                    Đ“Ń€Đ°Ń„Đ¸Đş Ń€Đ°Đ±ĐľŃ‚Ń‹ c&nbsp;
                                                                    {item.starts_working.format('DD.MM.YYYY')}
                                                                    {this.getNextStartsWorking(item.id) ? ` ĐżĐľ ${this.getNextStartsWorking(item.id).format('DD.MM.YYYY')}` : null}
                                                                </a>
                                                                {!creatingNewSchedule && +worker.starts_working.format('x') < +item.starts_working.format('x') ? (
                                                                        <Popconfirm
                                                                            title={`ĐźŃ€Đ¸ Ń?Đ´Đ°Đ»ĐµĐ˝Đ¸Đ¸ Đ´Đ°Đ˝Đ˝ĐľĐłĐľ ĐłŃ€Đ°Ń„Đ¸ĐşĐ°, Đ˛Ń?Đµ Đ·Đ°ĐżĐ¸Ń?Đ¸ Đ¸ Ń‚Đ°Đ»ĐľĐ˝Ń‹ Ń? ${item.starts_working.format('DD.MM.YYYY')} ${this.getNextStartsWorking(item.id) ? ` ĐżĐľ ${this.getNextStartsWorking(item.id).format('DD.MM.YYYY')}` : ''} Đ±Ń?Đ´Ń?Ń‚ Ń‚Đ°Đş Đ¶Đµ Ń?Đ´Đ°Đ»ĐµĐ˝Ń‹, Đ˛Ń‹ Ń?Đ˛ĐµŃ€ĐµĐ˝Ń‹?`}
                                                                            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                                                            onConfirm={() => this.onRemoveSchedule(item.id, worker.id)}
                                                                            okText="Đ”Đ°"
                                                                            cancelText="ĐťĐµŃ‚"
                                                                        >
                                                                            <Button type="link" style={{ height: 'auto', padding: '0 5px' }}><Icon type="delete" style={{ color: 'red' }} /></Button>
                                                                        </Popconfirm>
                                                                    ) : null}
                                                            </Paragraph>
                                                        )}
                                                    </Timeline.Item>
                                                );
                                            })}
                                        </Timeline>
                                    </Form.Item>
                                    <Form.Item label="Đ“Ń€Đ°Ń„Đ¸Đş Ń€Đ°Đ±ĐľŃ‚Ń‹ Đ˛Ń?Ń‚Ń?ĐżĐ°ĐµŃ‚ Đ˛ Ń?Đ¸Đ»Ń?">
                                        {getFieldDecorator('worker_starts_working', {
                                            rules: [{ required: creatingNewSchedule, message: 'Đ—Đ°ĐżĐľĐ»Đ˝Đ¸Ń‚Đµ ŃŤŃ‚Đľ ĐżĐľĐ»Đµ!' }]
                                        })(
                                            <DatePicker
                                                showTime={false}
                                                showToday={false}
                                                disabledDate={date => this.disabledDate(date, worker.schedules_all)}
                                                onChange={data => (data ? data.set({ hour: 0, minute: 0, second: 0 }) : moment().add(1, 'day').set({ hour: 0, minute: 0, second: 0 }))}
                                                format="DD.MM.YYYY"
                                                locale={localDatePicker}
                                                placeholder="Đ’Ń‹Đ±ĐµŃ€Đ¸Ń‚Đµ Đ´Đ°Ń‚Ń? Đ¸ Đ˛Ń€ĐµĐĽŃŹ"
                                                disabled={!creatingNewSchedule && Boolean(worker.schedules_all.length)}
                                            />,
                                        )}
                                    </Form.Item>
                                    <Table
                                        className="workers-schedule-table"
                                        dataSource={worker.schedules_all.length === 0 || creatingNewSchedule ? workerSchedule : activeĐˇhronologySchedule.schedule}
                                        scroll={{ x: 1710 }}
                                        pagination={false}
                                        bordered
                                        locale={{
                                            emptyText: 'ĐťĐµŃ‚ Đ°ĐşŃ‚Đ¸Đ˛Đ˝ĐľĐłĐľ Ń€Đ°Ń?ĐżĐ¸Ń?Đ°Đ˝Đ¸ŃŹ'
                                        }}
                                    >
                                        <Column title="ĐˇĐĽĐµĐ˝Đ°" width={100} dataIndex="shift" key="shift" fixed="left" align="center" />
                                        {workerScheduleColumns.map(column => (
                                            <ColumnGroup title={column.day} className="workers-schedule-table_group-title" key={`${column.day}group`}>
                                                <Column
                                                    title="Đ§Ń‘Ń‚Đ˝Ń‹Đµ"
                                                    dataIndex={column.dayKey}
                                                    key={`${column.dayKey}${column.parity.evenKey}`}
                                                    align="center"
                                                    width={115}
                                                    render={(item, object) => {
                                                        if (creatingNewSchedule || worker.schedules_all.length === 0) {
                                                            return (
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
                                                            );
                                                        }
                                                        return (
                                                            <div className={`workers-schedule-table__item disable ${item.parity.even !== null ? 'active' : ''}`}>
                                                                {item.parity.even !== null ? (
                                                                    <span className="workers-schedule-table__item_time">
                                                                        {item.parity.even.timeStart.format('HH:mm')}
                                                                        -
                                                                        {item.parity.even.timeEnd.format('HH:mm')}
                                                                    </span>
                                                                ) : null}
                                                            </div>
                                                        );
                                                    }}
                                                />
                                                <Column
                                                    title="ĐťĐµŃ‡Ń‘Ń‚Đ˝Ń‹Đµ"
                                                    dataIndex={column.dayKey}
                                                    key={`${column.dayKey}${column.parity.oddKey}`}
                                                    align="center"
                                                    width={115}
                                                    render={(item, object) => {
                                                        if (creatingNewSchedule || worker.schedules_all.length === 0) {
                                                            return (
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
                                                            );
                                                        }
                                                        return (
                                                            <div className={`workers-schedule-table__item disable ${item.parity.odd !== null ? 'active' : ''}`}>
                                                                {item.parity.odd !== null ? (
                                                                    <span className="workers-schedule-table__item_time">
                                                                        {item.parity.odd.timeStart.format('HH:mm')}
                                                                        -
                                                                        {item.parity.odd.timeEnd.format('HH:mm')}
                                                                    </span>
                                                                ) : null}
                                                            </div>
                                                        );
                                                    }}
                                                />
                                            </ColumnGroup>
                                        ))}
                                    </Table>
                                </Col>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                        <Dropdown
                                            overlay={(
                                                <Menu onClick={e => this.onAddNewSchedule(e)}>
                                                    {worker.schedules_all.map(item => (
                                                        <Menu.Item key={item.id}>
                                                            ĐťĐ° ĐľŃ?Đ˝ĐľĐ˛Đµ:&nbsp;
                                                            <strong>
                                                                {
                                                                    `${item.starts_working.format('DD.MM.YYYY')}
                                                                    ${this.getNextStartsWorking(item.id) ? `- ${this.getNextStartsWorking(item.id).format('DD.MM.YYYY')}` : ''}`
                                                                }
                                                            </strong>
                                                        </Menu.Item>
                                                    ))}
                                                    <Menu.Item key="new">ĐťĐľĐ˛Ń‹Đą</Menu.Item>
                                                </Menu>
                                            )}
                                        >
                                            <Button type="primary" size="large" style={{ marginTop: 24, marginBottom: 12 }}>
                                                ĐˇĐľĐ·Đ´Đ°Ń‚ŃŚ ĐłŃ€Đ°Ń„Đ¸Đş&nbsp;
                                                <Icon type="down" />
                                            </Button>
                                        </Dropdown>
                                </Col>
                            </Row>
                            <Row gutter={15} style={{ display: addedSchedule || editableSchedule ? 'block' : 'none' }}>
                                <Col xs={24} md={12}>
                                    <Form.Item label="ĐťĐ°Ń‡Đ°Đ»Đľ Ń?ĐĽĐµĐ˝Ń‹">
                                        {getFieldDecorator('worker_shift_start', {
                                            rules: [{ required: false }]
                                        })(
                                            <TimePicker
                                                format="HH:mm"
                                                placeholder="Đ’Ń‹Đ±ĐµŃ€Đ¸Ń‚Đµ Đ˛Ń€ĐµĐĽŃŹ"
                                                minuteStep={5}
                                                open={timePickerShift.start}
                                                onOpenChange={() => this.onTimeChange('start')}
                                            />,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="ĐšĐľĐ˝ĐµŃ† Ń?ĐĽĐµĐ˝Ń‹">
                                        {getFieldDecorator('worker_shift_end', {
                                            rules: [{ required: false }]
                                        })(
                                            <TimePicker
                                                format="HH:mm"
                                                placeholder="Đ’Ń‹Đ±ĐµŃ€Đ¸Ń‚Đµ Đ˛Ń€ĐµĐĽŃŹ"
                                                minuteStep={5}
                                                open={timePickerShift.end}
                                                onOpenChange={() => this.onTimeChange('end')}
                                            />,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Đ?Đ˝Ń‚ĐµŃ€Đ˛Đ°Đ» ĐżŃ€Đ¸ĐµĐĽĐ°">
                                        {getFieldDecorator('worker_interval', {
                                            rules: [{ required: false }]
                                        })(
                                            <Input
                                                suffix="ĐĽĐ¸Đ˝."
                                                placeholder="ĐŁĐşĐ°Đ¶Đ¸Ń‚Đµ Đ¸Đ˝Ń‚ĐµŃ€Đ˛Đ°Đ»"
                                            />,
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={24} style={{ textAlign: 'center' }}>
                                    {editableSchedule ? (
                                        <>
                                            <Button htmlType="button" type="primary" size="large" onClick={() => this.onSaveShift()}>
                                                ĐˇĐľŃ…Ń€Đ°Đ˝Đ¸Ń‚ŃŚ Ń?ĐĽĐµĐ˝Ń?
                                                <Icon type="save" />
                                            </Button>
                                            <Button htmlType="button" className="workers_btn-edit-schedule-close" size="large" onClick={() => this.onCloseShift()}>
                                                Đ—Đ°ĐşŃ€Ń‹Ń‚ŃŚ
                                                <Icon type="close" />
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button htmlType="button" type="primary" size="large" onClick={() => this.onSaveShift()}>
                                                Đ”ĐľĐ±Đ°Đ˛Đ¸Ń‚ŃŚ Ń?ĐĽĐµĐ˝Ń?
                                                <Icon type="plus" />
                                            </Button>
                                            <Button htmlType="button" className="workers_btn-edit-schedule-close" size="large" onClick={() => this.onCloseShift()}>
                                                Đ—Đ°ĐşŃ€Ń‹Ń‚ŃŚ
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
                            <Divider>ĐźĐµŃ€Đ¸ĐľĐ´ ĐľŃ‚ĐżŃ?Ń?ĐşĐľĐ˛</Divider>
                        </Col>
                        <Col span={24}>
                            <Table dataSource={workerHolidays} rowKey={(record, i) => i} locale={{ emptyText: 'ĐťĐµŃ‚ Đ´Đ°Đ˝Đ˝Ń‹Ń…' }} pagination={false}>
                                <Column
                                    key="holiday_start_column"
                                    title="ĐťĐ°Ń‡Đ°Đ»Đľ ĐľŃ‚ĐżŃ?Ń?ĐşĐ°"
                                    dataIndex="startHolidays"
                                    render={item => item.format('dddd, DD MMMM YYYY')}
                                />
                                <Column
                                    key="holiday_end_column"
                                    title="ĐšĐľĐ˝ĐµŃ† ĐľŃ‚ĐżŃ?Ń?ĐşĐ°"
                                    dataIndex="endHolidays"
                                    render={item => item.format('dddd, DD MMMM YYYY')}
                                />
                                <Column
                                    key="holiday_actions"
                                    title="Đ”ĐµĐąŃ?Ń‚Đ˛Đ¸ŃŹ"
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
                            <Form.Item label="ĐźĐµŃ€Đ¸ĐľĐ´ ĐľŃ‚ĐżŃ?Ń?ĐşĐ°">
                                {getFieldDecorator('worker_holidays', {
                                    rules: [{ required: false, message: 'Đ—Đ°ĐżĐľĐ»Đ˝Đ¸Ń‚Đµ ŃŤŃ‚Đľ ĐżĐľĐ»Đµ!' }],
                                })(
                                    <RangePicker placeholder={['ĐťĐ°Ń‡Đ°Đ»Đľ', 'ĐšĐľĐ˝ĐµŃ†']} format="DD.MM.YYYY" />,
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24} style={{ textAlign: 'center' }}>
                            {editableHolidays ? (
                                <>
                                    <Button htmlType="button" type="primary" size="large" onClick={() => this.onSaveEditHolidays()}>
                                        ĐˇĐľŃ…Ń€Đ°Đ˝Đ¸Ń‚ŃŚ ĐľŃ‚ĐżŃ?Ń?Đş
                                        <Icon type="save" />
                                    </Button>
                                    <Button htmlType="button" className="workers_btn-edit-holidays-close" size="large" onClick={() => this.onCloseEditHolidays()}>
                                        Đ—Đ°ĐşŃ€Ń‹Ń‚ŃŚ
                                        <Icon type="close" />
                                    </Button>
                                </>
                            ) : (
                                <Button htmlType="button" type="primary" size="large" onClick={() => this.onAddHolidays()}>
                                    Đ”ĐľĐ±Đ°Đ˛Đ¸Ń‚ŃŚ ĐľŃ‚ĐżŃ?Ń?Đş
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
                                ĐˇĐľŃ…Ń€Đ°Đ˝Đ¸Ń‚ŃŚ Ń?ĐľŃ‚Ń€Ń?Đ´Đ˝Đ¸ĐşĐ°
                                <Icon type="save" />
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        );
    }
}

UpdateWorker.propTypes = {
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

export default wrappedComponent(UpdateWorker);
