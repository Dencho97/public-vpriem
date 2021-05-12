import moment from 'moment';

import { STATUSES } from '../../constans/statuses-writes';

moment.locale('ru');

export const WS_GET_SCHEDULE = 'WS_GET_SCHEDULE';
export const WS_CURRENT_EDITING_WRITES_SCHEDULE = 'WS_CURRENT_EDITING_WRITES_SCHEDULE';
export const WS_SET_CREATING_WRITE_SCHEDULE = 'WS_SET_CREATING_WRITE_SCHEDULE';
export const WS_UNSET_CREATING_WRITE_SCHEDULE = 'WS_UNSET_CREATING_WRITE_SCHEDULE';
export const WS_CREATE_WRITE_SCHEDULE = 'WS_CREATE_WRITE_SCHEDULE';
export const WS_SET_EDITING_WRITE_SCHEDULE = 'WS_SET_EDITING_WRITE_SCHEDULE';
export const WS_UNSET_EDITING_WRITE_SCHEDULE = 'WS_UNSET_EDITING_WRITE_SCHEDULE';
export const WS_EDIT_WRITE_SCHEDULE = 'WS_EDIT_WRITE_SCHEDULE';
export const WS_REMOVE_WRITE_SCHEDULE = 'WS_REMOVE_WRITE_SCHEDULE';
export const WS_CREATE_TICKET_SCHEDULE = 'WS_CREATE_TICKET_SCHEDULE';
export const WS_REMOVE_TICKET_SCHEDULE = 'WS_REMOVE_TICKET_SCHEDULE';
export const WS_DIVIDE_TICKET_SCHEDULE = 'WS_DIVIDE_TICKET_SCHEDULE';
export const WS_REMOVE_DIVIDE_TICKET_SCHEDULE = 'WS_REMOVE_DIVIDE_TICKET_SCHEDULE';
export const WS_RETIME_TICKET_SCHEDULE = 'WS_RETIME_TICKET_SCHEDULE';
export const WS_HIDE_TICKET_SCHEDULE = 'WS_HIDE_TICKET_SCHEDULE';
export const WS_OPEN_TICKET_SCHEDULE = 'WS_OPEN_TICKET_SCHEDULE';
export const WS_REMOVE_WRITE_SCHEDULE_NOTIFICATION = 'WS_REMOVE_WRITE_SCHEDULE_NOTIFICATION';
export const WS_COPY_TICKETS_DOCTOR_SCHEDULE = 'WS_COPY_TICKETS_DOCTOR_SCHEDULE';

export const getScheduleWSAction = (params, user, ws) => {
    const newParams = params;
    ws.ws.send(JSON.stringify({
        type: WS_GET_SCHEDULE,
        params: { ...newParams, currentDate: newParams.currentDate.format('x') },
        user,
        connectionID: ws.userConnectionID
    }));
};

export const setCreatingWriteWSAction = (type, ticket, doctor, user, ws) => {
    switch (type) {
        case 'SET':
            ws.ws.send(JSON.stringify({
                type: WS_SET_CREATING_WRITE_SCHEDULE,
                ticket,
                doctorID: doctor.id,
                user,
                connectionID: ws.userConnectionID
            }));
            break;
        case 'UNSET':
            ws.ws.send(JSON.stringify({
                type: WS_UNSET_CREATING_WRITE_SCHEDULE,
                ticket,
                doctorID: doctor.id,
                user,
                connectionID: ws.userConnectionID
            }));
            break;
        default:
            break;
    }
};

export const setEditingWriteWSAction = (type, ticket, doctor, user, ws) => {
    switch (type) {
        case 'SET':
            ws.ws.send(JSON.stringify({
                type: WS_SET_EDITING_WRITE_SCHEDULE,
                ticket,
                doctorID: doctor.id,
                user,
                connectionID: ws.userConnectionID
            }));
            break;
        case 'UNSET':
            ws.ws.send(JSON.stringify({
                type: WS_UNSET_EDITING_WRITE_SCHEDULE,
                ticket,
                doctorID: doctor.id,
                user,
                connectionID: ws.userConnectionID
            }));
            break;
        default:
            break;
    }
};

export const createTicketWSAction = (fields, doctorID, dateTicket, position, ws) => {
    const sendData = {
        worker_id: +doctorID,
        date_ticket: moment(dateTicket).format('YYYY-MM-DD HH:mm:ss'),
        time_start: +fields.ticket_time_start.format('x'),
        time_end: +fields.ticket_time_end.format('x'),
        position
    };

    ws.ws.send(JSON.stringify({
        type: WS_CREATE_TICKET_SCHEDULE,
        data: sendData,
        connectionID: ws.userConnectionID
    }));
};

export const createWriteWSAction = (fields, creatingData, ws) => {
    const sendData = {
        status: STATUSES.notConfirmed.value,
        recorded_user_id: +creatingData.user.user_id,
        recorded_from_site: 0,
        doctor_worker_id: +creatingData.doctor.id,
        filial_id: +creatingData.doctor.filial.id,
        patient_last_name: fields.patient_last_name,
        patient_first_name: fields.patient_first_name,
        patient_second_name: fields.patient_second_name,
        patient_phone: fields.patient_phone,
        patient_birthday: +fields.patient_birthday.format('x'),
        patient_type_payment: +fields['patient_type-payment'],
        patient_type_reception: +fields['patient_type-reception'],
        patient_comment: fields.patient_comment ? fields.patient_comment : '',
        date_write: moment(creatingData.ticket.dateTicket).format('YYYY-MM-DD HH:mm:ss'),
        time_start: creatingData.ticket.time[0],
        time_end: creatingData.ticket.time[1],
        isPart: creatingData.ticket.isPart
    };

    ws.ws.send(JSON.stringify({
        type: WS_CREATE_WRITE_SCHEDULE,
        data: sendData,
        connectionID: ws.userConnectionID
    }));
};

export const editWriteWSAction = (fields, editingData, ws) => {
    const sendData = {
        id: +editingData.ticket.data.id,
        status: fields.write_status,
        recorded_user_id: +editingData.ticket.data.recorded_user_id === 0 ? editingData.user.user_id : +editingData.ticket.data.recorded_user_id,
        patient_last_name: fields.patient_last_name,
        patient_first_name: fields.patient_first_name,
        patient_second_name: fields.patient_second_name,
        patient_phone: fields.patient_phone,
        patient_birthday: +fields.patient_birthday.format('x'),
        patient_type_payment: +fields['patient_type-payment'],
        patient_type_reception: +fields['patient_type-reception'],
        patient_comment: fields.patient_comment ? fields.patient_comment : '',
        date_write: moment(editingData.ticket.dateTicket).format('YYYY-MM-DD HH:mm:ss'),
        time_start: editingData.ticket.time[0],
        time_end: editingData.ticket.time[1],
        isPart: editingData.ticket.isPart
    };

    ws.ws.send(JSON.stringify({
        type: WS_EDIT_WRITE_SCHEDULE,
        data: sendData,
        writeID: +editingData.ticket.data.id,
        doctorID: +editingData.doctor.id,
        connectionID: ws.userConnectionID
    }));
};

export const removeWriteWSAction = (writeID, doctorID, isPart, date, ws) => {
    ws.ws.send(JSON.stringify({
        type: WS_REMOVE_WRITE_SCHEDULE,
        writeID: +writeID,
        doctorID: +doctorID,
        isPart: +isPart,
        date_write: date,
        connectionID: ws.userConnectionID
    }));
};

export const removeCustomTicketWSAction = (ticketID, doctorID, date, ws) => {
    ws.ws.send(JSON.stringify({
        type: WS_REMOVE_TICKET_SCHEDULE,
        ticketID: +ticketID,
        doctorID: +doctorID,
        date_ticket: date,
        connectionID: ws.userConnectionID
    }));
};

export const divideTicketWSAction = (ticket, doctorID, divideDuration, ws) => {
    ws.ws.send(JSON.stringify({
        type: WS_DIVIDE_TICKET_SCHEDULE,
        ticket,
        doctorID: +doctorID,
        divideDuration: +divideDuration,
        connectionID: ws.userConnectionID
    }));
};

export const removeDivideTicketWSAction = (ticket, doctorID, ws) => {
    ws.ws.send(JSON.stringify({
        type: WS_REMOVE_DIVIDE_TICKET_SCHEDULE,
        ticket,
        doctorID: +doctorID,
        connectionID: ws.userConnectionID
    }));
};

export const retimeTicketWSAction = (ticket, doctorID, time, ws) => {
    ws.ws.send(JSON.stringify({
        type: WS_RETIME_TICKET_SCHEDULE,
        ticket,
        doctorID: +doctorID,
        time,
        connectionID: ws.userConnectionID
    }));
};

export const hiddenTicketWSAction = (ticket, doctorID, comment, ws) => {
    ws.ws.send(JSON.stringify({
        type: WS_HIDE_TICKET_SCHEDULE,
        ticket,
        doctorID: +doctorID,
        comment,
        connectionID: ws.userConnectionID
    }));
};

export const openTicketWSAction = (ticket, doctorID, comment, ws) => {
    ws.ws.send(JSON.stringify({
        type: WS_OPEN_TICKET_SCHEDULE,
        ticket,
        doctorID: +doctorID,
        comment,
        connectionID: ws.userConnectionID
    }));
};

export const removeWriteNotificationWSAction = (typeID, id, ws) => {
    ws.ws.send(JSON.stringify({
        type: WS_REMOVE_WRITE_SCHEDULE_NOTIFICATION,
        typeID,
        id,
        connectionID: ws.userConnectionID
    }));
};

export const copyTicketsDoctorWSAction = (data, ws) => {
    const {
        copyToDate,
        copyToDoctorID,
        copyTickets
    } = data;

    ws.ws.send(JSON.stringify({
        type: WS_COPY_TICKETS_DOCTOR_SCHEDULE,
        copyToDate,
        copyToDoctorID,
        copyTickets,
        connectionID: ws.userConnectionID
    }));
};
