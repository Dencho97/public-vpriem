import moment from 'moment';

import notification from '../components/notification';

moment.locale('ru');

const getMinutesWithStartDay = (timestamp) => {
    const today = new Date(+timestamp);
    const startDay = +moment(new Date(today.getFullYear(), today.getMonth(), today.getDate())).format('x');

    return Math.floor((+timestamp - startDay) / 1000 / 60);
};

export default (startTicket, endTicket, tickets, position) => {
    const startTimeCustomUnix = +startTicket.format('x');
    const endTimeCustomUnix = +endTicket.format('x');
    const startTimeCustom = getMinutesWithStartDay(startTimeCustomUnix); // in minutes
    const endTimeCustom = getMinutesWithStartDay(endTimeCustomUnix); // in minutes
    const firstTicketOnDay = tickets.length ? getMinutesWithStartDay(tickets[0].time[0]) : null; // in minutes
    const lastTicketOnDay = tickets.length ? getMinutesWithStartDay(tickets[tickets.length - 1].time[1]) : null; // in minutes
    let isAvailible = true;
    let errorMesage;

    if (firstTicketOnDay === null || lastTicketOnDay === null) {
        return isAvailible;
    }
    if (position === 'toEnd' && startTimeCustom > endTimeCustom) {
        errorMesage = 'Начало талона не может быть меньше времени окончания';
        notification('warning', 'Некорректный талон!', errorMesage);
        isAvailible = false;
        return isAvailible;
    }
    if (position === 'toStart' && startTimeCustom > endTimeCustom) {
        errorMesage = 'Начало талона не может быть больше времени окончания';
        notification('warning', 'Некорректный талон!', errorMesage);
        isAvailible = false;
        return isAvailible;
    }
    if (endTimeCustom === startTimeCustom) {
        errorMesage = 'Начало талона не может быть равно времени окончания';
        notification('warning', 'Некорректный талон!', errorMesage);
        isAvailible = false;
        return isAvailible;
    }
    // if (startTimeCustom < getMinutesWithStartDay(tickets[0].time[0])) {
    //     errorMesage = `Начало талона не может быть раньше ${moment(tickets[0].time[0]).format('HH:mm')}`;
    //     notification('warning', 'Некорректный талон!', errorMesage);
    //     isAvailible = false;
    //     return isAvailible;
    // }
    // if (startTimeCustom >= firstTicketOnDay || endTimeCustom <= lastTicketOnDay) {
    //         if (startTimeCustom === lastTicketOnDay) {
    //             return isAvailible;
    //         }
    //         errorMesage = `Талон ${startTicket.format('HH:mm')}-${endTicket.format('HH:mm')} пересекается с уже созданными талонами`;
    //         notification('warning', 'Некорректный талон!', errorMesage);
    //         isAvailible = false;
    //         return isAvailible;
    // }

    return isAvailible;
};
