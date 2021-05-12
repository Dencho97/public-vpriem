import moment from 'moment';

import {
  SWITCH_MODAL_SHEDULE,
  REQUEST_GET_SCHEDULE,
  RESPONSE_GET_SCHEDULE,
  REQUEST_CREATE_TICKET_SCHEDULE,
  RESPONSE_CREATE_TICKET_SCHEDULE,
  ADD_USER_TICKET_SCHEDULE,
  SET_FILTER_SCHEDULE,
  SET_CREATING_WRITE_SCHEDULE,
  UNSET_CREATING_WRITE_SCHEDULE,
  REQUEST_CREATE_WRITE_SCHEDULE,
  RESPONSE_CREATE_WRITE_SCHEDULE,
  ADD_WRITE_SCHEDULE,
  REQUEST_DELETE_WRITE_SCHEDULE,
  RESPONSE_DELETE_WRITE_SCHEDULE,
  REMOVE_WRITE_SCHEDULE,
  SET_EDITING_WRITE_SCHEDULE,
  UNSET_EDITING_WRITE_SCHEDULE,
  SET_VIEWING_WRITE_SCHEDULE,
  UNSET_VIEWING_WRITE_SCHEDULE,
  REQUEST_EDIT_WRITE_SCHEDULE,
  RESPONSE_EDIT_WRITE_SCHEDULE,
  EDIT_WRITE_SCHEDULE,
  REQUEST_DELETE_TICKET_SCHEDULE,
  RESPONSE_DELETE_TICKET_SCHEDULE,
  REMOVE_USER_TICKET_SCHEDULE,
  DIVIDE_TICKET_SCHEDULE,
  REMOVE_DIVIDE_TICKET_SCHEDULE,
  RETIME_TICKET_SCHEDULE,
  SWITCH_HIDE_TICKET_SCHEDULE,
  SET_SCHEDULE,
  REQUEST_GET_WRITE,
  RESPONSE_GET_WRITE,
  RESET_FILTER,
  SWITCH_SHOW_FILTER_SHEDULE
} from './actions';
import {
  WS_CURRENT_EDITING_WRITES_SCHEDULE,
  WS_SET_CREATING_WRITE_SCHEDULE,
  WS_UNSET_CREATING_WRITE_SCHEDULE,
  WS_SET_EDITING_WRITE_SCHEDULE,
  WS_UNSET_EDITING_WRITE_SCHEDULE
} from './actionsWS';

moment.locale('ru');

const initialState = {
  data: null,
  loading: false,
  loadingData: false,
  creating: null,
  editing: null,
  viewing: null,
  filter: {
    currentDate: moment(),
    speciality: [],
    filial: null,
    typeView: 0,
    showHolidays: false,
    doctors: [],
    show: 0
  },
  modals: {
    viewWrite: false,
    createWrite: false,
    updateWrite: false,
    createTicket: false,
    divideTicket: false,
    retimeTicket: false,
    copyTickets: false
  }
};

export default function reduser(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SWITCH_MODAL_SHEDULE: {
      return {
        ...state,
        modals: {
          ...state.modals,
          [payload]: !state.modals[payload]
        }
      };
    }
    case SWITCH_SHOW_FILTER_SHEDULE: {
      return {
        ...state,
        filter: {
          ...state.filter,
          show: payload
        }
      };
    }
    case SET_SCHEDULE:
      return { ...state, data: payload };
    case SET_FILTER_SCHEDULE:
      return {
        ...state,
        filter: {
          ...state.filter,
          [payload.type]: payload.value
        }
      };
    case RESET_FILTER:
      return {
      ...state,
      filter: {
        ...state.filter,
        currentDate: moment(),
        speciality: [],
        filial: null,
        typeView: 0,
        showHolidays: false,
        doctors: []
      }
    };
// VIEWING
    case SET_VIEWING_WRITE_SCHEDULE:
      return { ...state, viewing: payload };
    case UNSET_VIEWING_WRITE_SCHEDULE:
      return { ...state, viewing: null };
// CURRENT_EDITING
    case WS_CURRENT_EDITING_WRITES_SCHEDULE: {
      return {
        ...state,
        data: state.data.map((doctor) => {
          const newDoctorState = doctor;
          let newTickets = [];
          doctor.tickets.forEach((dayTickets) => {
            let newTicketsDay = [];
            dayTickets.data.forEach((ticket) => {
              let newTicket = ticket;
              payload.data.forEach((editingTicket) => {
                if (ticket.type !== 'break' && ticket.parts.length && editingTicket.ticket.isPart) {
                  newTicket = {
                    ...newTicket,
                    parts: newTicket.parts.map((partTicket) => {
                      if (
                        +doctor.id === +editingTicket.doctorID
                        && moment(partTicket.dateTicket).format('DD.MM.YYYY') === moment(editingTicket.ticket.dateTicket).format('DD.MM.YYYY')
                        && +partTicket.time[0] === +editingTicket.ticket.time[0]
                        && +partTicket.time[1] === +editingTicket.ticket.time[1]
                      ) {
                        if (partTicket.data) {
                          return { ...partTicket, data: { ...partTicket.data, status: 'editing', user: editingTicket.user } };
                        }
                        return { ...partTicket, data: { status: 'editing', user: editingTicket.user } };
                      }
                      return partTicket;
                    })
                  };
                } else if (
                    +doctor.id === +editingTicket.doctorID
                    && moment(ticket.dateTicket).format('DD.MM.YYYY') === moment(editingTicket.ticket.dateTicket).format('DD.MM.YYYY')
                    && +ticket.time[0] === +editingTicket.ticket.time[0]
                    && +ticket.time[1] === +editingTicket.ticket.time[1]
                  ) {
                  if (ticket.data) {
                    newTicket = { ...newTicket, data: { ...newTicket.data, status: 'editing', user: editingTicket.user } };
                  } else {
                    newTicket = { ...newTicket, data: { status: 'editing', user: editingTicket.user } };
                  }
                }
              });
              newTicketsDay = [...newTicketsDay, newTicket];
            });
            newTickets = [...newTickets, { date: dayTickets.date, data: newTicketsDay }];
          });
          return { ...newDoctorState, tickets: newTickets };
        })
      };
    }
// CREATING_WRITE
    case SET_CREATING_WRITE_SCHEDULE:
      return { ...state, creating: payload };
    case UNSET_CREATING_WRITE_SCHEDULE:
      return { ...state, creating: null };
    case WS_SET_CREATING_WRITE_SCHEDULE: {
      return {
        ...state,
        data: state.data.map((doctor) => {
          let newDoctorState = doctor;
          payload.data.forEach((item) => {
            if (+doctor.id === +item.doctorID) {
              const newTickets = doctor.tickets.map((dayTickets) => {
                if (moment(dayTickets.date).format('DD.MM.YYYY') === moment(item.ticket.dateTicket).format('DD.MM.YYYY')) {
                  return {
                    ...dayTickets,
                    data: dayTickets.data.map((ticket) => {
                        if (ticket.type === 'free' || ticket.type === 'custom') {
                          if (item.ticket.isPart) {
                            return {
                              ...ticket,
                              parts: ticket.parts.map((partTicket) => {
                                if (
                                  moment(partTicket.dateTicket).format('DD.MM.YYYY') === moment(item.ticket.dateTicket).format('DD.MM.YYYY')
                                  && +partTicket.time[0] === +item.ticket.time[0]
                                  && +partTicket.time[1] === +item.ticket.time[1]
                                ) {
                                  return {
                                    ...partTicket,
                                    data: { status: 'editing', user: item.user }
                                  };
                                }
                                return partTicket;
                              })
                            };
                          }

                          if (
                            moment(ticket.dateTicket).format('DD.MM.YYYY') === moment(item.ticket.dateTicket).format('DD.MM.YYYY')
                            && +ticket.time[0] === +item.ticket.time[0]
                            && +ticket.time[1] === +item.ticket.time[1]
                          ) {
                            return {
                              ...ticket,
                              data: { status: 'editing', user: item.user }
                            };
                          }
                        }
                        return ticket;
                    })
                  };
                }
                return dayTickets;
              });
              newDoctorState = { ...doctor, tickets: newTickets };
            }
          });
          return newDoctorState;
        })
      };
    }
    case WS_UNSET_CREATING_WRITE_SCHEDULE: {
      return {
        ...state,
        data: state.data.map((doctor) => {
          let newDoctorState = doctor;

          if (!payload.data.length) {
            const newTickets = doctor.tickets.map(dayTickets => ({
                ...dayTickets,
                data: dayTickets.data.map((ticket) => {
                  if (ticket.type === 'free' || ticket.type === 'custom') {
                    if (ticket.parts.length) {
                      return {
                        ...ticket,
                        parts: ticket.parts.map(partTicket => ({
                          ...partTicket,
                          data: partTicket.data && partTicket.data.status !== 'editing' ? partTicket.data : null
                        }))
                      };
                    }
                    return { ...ticket, data: ticket.data && ticket.data.status !== 'editing' ? ticket.data : null };
                  }
                  return ticket;
                })
            }));
            newDoctorState = { ...doctor, tickets: newTickets };
            return newDoctorState;
          }

          const newTickets = doctor.tickets.map(dayTickets => ({
              ...dayTickets,
              data: dayTickets.data.map((ticket) => {
                if (ticket.type === 'free' || ticket.type === 'custom') {
                  let newTicket = ticket;
                  if (+doctor.id === +payload.unsetData.doctorID) {
                    if (payload.unsetData.ticket.isPart) {
                      newTicket = {
                        ...newTicket,
                        parts: newTicket.parts.map((partTicket) => {
                          if (
                            moment(dayTickets.date).format('DD.MM.YYYY') === moment(payload.unsetData.ticket.dateTicket).format('DD.MM.YYYY')
                            && +partTicket.time[0] === +payload.unsetData.ticket.time[0]
                            && +partTicket.time[1] === +payload.unsetData.ticket.time[1]
                          ) {
                            return {
                              ...partTicket,
                              data: partTicket.data && partTicket.data.status !== 'editing' ? partTicket.data : null
                            };
                          }
                          return partTicket;
                        })
                      };
                    } else if (
                        moment(dayTickets.date).format('DD.MM.YYYY') === moment(payload.unsetData.ticket.dateTicket).format('DD.MM.YYYY')
                        && +ticket.time[0] === +payload.unsetData.ticket.time[0]
                        && +ticket.time[1] === +payload.unsetData.ticket.time[1]
                      ) {
                      newTicket = { ...newTicket, data: ticket.data && ticket.data.status !== 'editing' ? ticket.data : null };
                    }
                  }
                  return newTicket;
                }
                return ticket;
              })
          }));

          newDoctorState = { ...doctor, tickets: newTickets };
          return newDoctorState;
        })
      };
    }
// EDITING_WRITE
    case SET_EDITING_WRITE_SCHEDULE:
      return { ...state, editing: payload };
    case UNSET_EDITING_WRITE_SCHEDULE:
      return { ...state, editing: null };
    case WS_SET_EDITING_WRITE_SCHEDULE: {
      return {
        ...state,
        data: state.data.map((doctor) => {
          let newDoctorState = doctor;
          payload.data.forEach((item) => {
            if (+doctor.id === +item.doctorID) {
              const newTickets = doctor.tickets.map((dayTickets) => {
                if (moment(dayTickets.date).format('DD.MM.YYYY') === moment(item.ticket.dateTicket).format('DD.MM.YYYY')) {
                  return {
                    ...dayTickets,
                    data: dayTickets.data.map((ticket) => {
                      if (ticket.type !== 'break' && +item.ticket.isPart) {
                        return {
                          ...ticket,
                          parts: ticket.parts.map((partTicket) => {
                            if (
                              moment(partTicket.dateTicket).format('DD.MM.YYYY') === moment(item.ticket.dateTicket).format('DD.MM.YYYY')
                              && +partTicket.time[0] === +item.ticket.time[0]
                              && +partTicket.time[1] === +item.ticket.time[1]
                            ) {
                              return {
                                ...partTicket,
                                data: { ...partTicket.data, status: 'editing', user: item.user }
                              };
                            }
                            return partTicket;
                          })
                        };
                      }

                      if (
                        moment(ticket.dateTicket).format('DD.MM.YYYY') === moment(item.ticket.dateTicket).format('DD.MM.YYYY')
                        && +ticket.time[0] === +item.ticket.time[0]
                        && +ticket.time[1] === +item.ticket.time[1]
                      ) {
                        return {
                          ...ticket,
                          data: { ...ticket.data, status: 'editing', user: item.user }
                        };
                      }
                      return ticket;
                    })
                  };
                }
                return dayTickets;
              });
              newDoctorState = { ...doctor, tickets: newTickets };
            }
          });
          return newDoctorState;
        })
      };
    }
    case WS_UNSET_EDITING_WRITE_SCHEDULE: {
      return {
        ...state,
        data: state.data.map((doctor) => {
          let newDoctorState = doctor;
          if (!payload.data.length) {
            const newTickets = doctor.tickets.map(dayTickets => ({
              ...dayTickets,
              data: dayTickets.data.map((ticket) => {
                if (ticket.type !== 'break' && ticket.parts.length) {
                  return {
                    ...ticket,
                    parts: ticket.parts.map((partTicket) => {
                      if (partTicket.type === 'busy' || partTicket.type === 'custom') {
                        return {
                          ...partTicket,
                          data: partTicket.data && partTicket.data.status === 'editing' ? { ...partTicket.data, status: payload.unsetData.ticket.data ? payload.unsetData.ticket.data.status : null } : partTicket.data
                        };
                      }
                      return partTicket;
                    })
                  };
                }
                if (ticket.type === 'busy' || ticket.type === 'custom') {
                  return {
                    ...ticket,
                    data: ticket.data && ticket.data.status === 'editing' ? { ...ticket.data, status: payload.unsetData.ticket.data ? payload.unsetData.ticket.data.status : null } : ticket.data
                  };
                }
                return ticket;
              })
            }));
            newDoctorState = { ...doctor, tickets: newTickets };
            return newDoctorState;
          }

          const newTickets = doctor.tickets.map(dayTickets => ({
            ...dayTickets,
            data: dayTickets.data.map((ticket) => {
              if (ticket.type !== 'break' && ticket.parts.length && payload.unsetData.ticket.isPart) {
                let newTicket = ticket;
                newTicket = {
                  ...newTicket,
                  parts: newTicket.parts.map((partTicket) => {
                    if (partTicket.type === 'busy' || partTicket.type === 'custom') {
                      if (+doctor.id === +payload.unsetData.doctorID) {
                        if (
                          moment(dayTickets.date).format('DD.MM.YYYY') === moment(payload.unsetData.ticket.dateTicket).format('DD.MM.YYYY')
                          && +partTicket.time[0] === +payload.unsetData.ticket.time[0]
                          && +partTicket.time[1] === +payload.unsetData.ticket.time[1]
                        ) {
                          return {
                            ...partTicket,
                            data: partTicket.data && partTicket.data.status === 'editing' ? { ...partTicket.data, status: payload.unsetData.ticket.data ? payload.unsetData.ticket.data.status : null } : partTicket.data
                          };
                        }
                        return partTicket;
                      }
                      return partTicket;
                    }
                    return partTicket;
                  })
                };
                return newTicket;
              }
              if (ticket.type === 'busy' || ticket.type === 'custom') {
                let newTicket = ticket;
                if (+doctor.id === +payload.unsetData.doctorID) {
                  if (
                    moment(dayTickets.date).format('DD.MM.YYYY') === moment(payload.unsetData.ticket.dateTicket).format('DD.MM.YYYY')
                    && +ticket.time[0] === +payload.unsetData.ticket.time[0]
                    && +ticket.time[1] === +payload.unsetData.ticket.time[1]
                  ) {
                    newTicket = {
                      ...newTicket,
                      data: ticket.data && ticket.data.status === 'editing' ? { ...ticket.data, status: payload.unsetData.ticket.data ? payload.unsetData.ticket.data.status : null } : ticket.data
                    };
                  } else {
                    return newTicket;
                  }
                }
                return newTicket;
              }
              return ticket;
            })
          }));

          newDoctorState = { ...doctor, tickets: newTickets };
          return newDoctorState;
        })
      };
    }
// REQUEST-RESPONSE
    case REQUEST_GET_SCHEDULE:
      return { ...state, loadingData: true, data: null };
    case RESPONSE_GET_SCHEDULE:
      return { ...state, loadingData: false, data: payload };
    case REQUEST_CREATE_TICKET_SCHEDULE:
    case REQUEST_CREATE_WRITE_SCHEDULE:
    case REQUEST_DELETE_WRITE_SCHEDULE:
    case REQUEST_EDIT_WRITE_SCHEDULE:
    case REQUEST_DELETE_TICKET_SCHEDULE:
      return { ...state, loading: true };
    case RESPONSE_CREATE_TICKET_SCHEDULE:
    case RESPONSE_CREATE_WRITE_SCHEDULE:
    case RESPONSE_DELETE_WRITE_SCHEDULE:
    case RESPONSE_EDIT_WRITE_SCHEDULE:
    case RESPONSE_DELETE_TICKET_SCHEDULE:
      return { ...state, loading: false };
    case REQUEST_GET_WRITE:
      return { ...state, loading: true };
    case RESPONSE_GET_WRITE:
      return {
        ...state,
        loading: false,
        editing: {
          ticket: {
            time: [+payload.data.time_start, +payload.data.time_end],
            dateTicket: +moment(payload.data.date_write).format('x'),
            data: payload.data
          },
          user: +payload.user
        }
      };
// ACTIONS
    case ADD_USER_TICKET_SCHEDULE: {
      return {
        ...state,
        data: state.data.map((doctor) => {
          if (+doctor.id === +payload.worker_id) {
            const newDoctor = doctor;
            let newTickets = [];

            newDoctor.tickets.forEach((dayTickets) => {
              if (moment(dayTickets.date).format('DD.MM.YYYY') === moment(payload.date_ticket).format('DD.MM.YYYY')) {
                switch (payload.position) {
                  case 'toStart': {
                    newTickets = [...newTickets, {
                      ...dayTickets,
                      data: [{
                        id: payload.id,
                        type: 'custom',
                        dateTicket: +moment(payload.date_ticket).format('x'),
                        parts: [],
                        isPart: 0,
                        time: [+payload.time_start, +payload.time_end]
                      }, ...dayTickets.data]
                    }];
                    break;
                  }
                  case 'toEnd': {
                    newTickets = [...newTickets, {
                      ...dayTickets,
                      data: [...dayTickets.data, {
                        id: payload.id,
                        type: 'custom',
                        dateTicket: +moment(payload.date_ticket).format('x'),
                        parts: [],
                        isPart: 0,
                        time: [+payload.time_start, +payload.time_end]
                      }]
                    }];
                    break;
                  }
                  default:
                    break;
                }
              } else {
                newTickets = [...newTickets, dayTickets];
              }
            });
            return { ...doctor, tickets: newTickets };
          }
          return doctor;
        })
      };
    }
    case REMOVE_USER_TICKET_SCHEDULE: {
      return {
        ...state,
        data: state.data.map((doctor) => {
          if (+doctor.id === +payload.doctorID) {
            const newDoctor = doctor;
            let newTickets = [];

            newDoctor.tickets.forEach((dayTickets) => {
              newTickets = [
                ...newTickets,
                {
                  ...dayTickets,
                  data: dayTickets.data.filter((ticket) => {
                    if (ticket.type === 'custom' && +ticket.id === +payload.ticketID) {
                      return false;
                    }
                    return true;
                  })
                }];
            });

            return { ...doctor, tickets: newTickets };
          }
          return doctor;
        })
      };
    }
    case ADD_WRITE_SCHEDULE: {
      return {
        ...state,
        data: state.data.map((doctor) => {
          if (+doctor.id === +payload.doctor_worker_id) {
            let newTickets = [];

            doctor.tickets.forEach((dayTickets) => {
              let newTicketsDay = dayTickets;
              if (moment(dayTickets.date).format('DD.MM.YYYY') === moment(payload.date_write).format('DD.MM.YYYY')) {
                if (+payload.isPart) {
                  newTicketsDay = {
                    ...newTicketsDay,
                    data: newTicketsDay.data.map((ticket) => {
                      if (ticket.type !== 'break' && ticket.parts.length) {
                        let newTicket = ticket;
                        newTicket = {
                          ...newTicket,
                          parts: newTicket.parts.map((partTicket) => {
                            if (+partTicket.time[0] === +payload.time_start && +partTicket.time[1] === +payload.time_end) {
                              return {
                                ...partTicket,
                                type: partTicket.type === 'custom' ? 'custom' : 'busy',
                                isBusy: true,
                                data: payload
                              };
                            }
                            return partTicket;
                          })
                        };
                        return newTicket;
                      }
                      return ticket;
                    })
                  };
                } else {
                  newTicketsDay = {
                    ...newTicketsDay,
                    data: newTicketsDay.data.map((ticket) => {
                      if (+ticket.time[0] === +payload.time_start && +ticket.time[1] === +payload.time_end) {
                        return {
                          ...ticket,
                          type: ticket.type === 'custom' ? 'custom' : 'busy',
                          isBusy: true,
                          data: payload
                        };
                      }
                      return ticket;
                    })
                  };
                }
              }
              newTickets = [...newTickets, newTicketsDay];
            });
            return { ...doctor, tickets: newTickets };
          }
          return doctor;
        })
      };
    }
    case EDIT_WRITE_SCHEDULE: {
      return {
        ...state,
        data: state.data.map((doctor) => {
          if (+doctor.id === +payload.doctorID) {
            let newTickets = [];

            doctor.tickets.forEach((dayTickets) => {
              let newTicketsDay = dayTickets;
              if (moment(dayTickets.date).format('DD.MM.YYYY') === moment(payload.data.date_write).format('DD.MM.YYYY')) {
                if (+payload.data.isPart) {
                  newTicketsDay = {
                    ...newTicketsDay,
                    data: newTicketsDay.data.map((ticket) => {
                      if (ticket.type !== 'break' && ticket.parts.length) {
                        let newTicket = ticket;
                        newTicket = {
                          ...newTicket,
                          parts: newTicket.parts.map((partTicket) => {
                            if (partTicket.data && +partTicket.data.id === +payload.writeID) {
                              return {
                                ...partTicket,
                                data: {
                                  ...partTicket.data,
                                  ...payload.data
                                }
                              };
                            }
                            return partTicket;
                          })
                        };
                        return newTicket;
                      }
                      return ticket;
                    })
                  };
                } else {
                  newTicketsDay = {
                    ...newTicketsDay,
                    data: newTicketsDay.data.map((ticket) => {
                      if (ticket.data && +ticket.data.id === +payload.writeID) {
                        return {
                          ...ticket,
                          data: {
                            ...ticket.data,
                            ...payload.data
                          }
                        };
                      }
                      return ticket;
                    })
                  };
                }
              }
              newTickets = [...newTickets, newTicketsDay];
            });
            return { ...doctor, tickets: newTickets };
          }
          return doctor;
        })
      };
    }
    case REMOVE_WRITE_SCHEDULE: {
      return {
        ...state,
        data: state.data.map((doctor) => {
          if (+doctor.id === +payload.doctorID) {
            const newDoctor = doctor;
            let newTickets = [];

            newDoctor.tickets.forEach((dayTickets) => {
              let newTicketsDay = dayTickets;
              if (+payload.isPart) {
                newTicketsDay = {
                  ...newTicketsDay,
                  data: newTicketsDay.data.map((ticket) => {
                    if (ticket.type !== 'break' && ticket.parts.length) {
                      let newTicket = ticket;
                      newTicket = {
                        ...newTicket,
                        parts: newTicket.parts.map((partTicket) => {
                          if (partTicket.data && +partTicket.data.id === +payload.writeID) {
                            return {
                              ...partTicket,
                              type: partTicket.type === 'custom' ? 'custom' : 'free',
                              isBusy: false,
                              data: null
                            };
                          }
                          return partTicket;
                        })
                      };
                      return newTicket;
                    }
                    return ticket;
                  })
                };
              } else {
                newTicketsDay = {
                  ...newTicketsDay,
                  data: newTicketsDay.data.map((ticket) => {
                    if (ticket.data && +ticket.data.id === +payload.writeID) {
                      return {
                        ...ticket,
                        type: ticket.type === 'custom' ? 'custom' : 'free',
                        isBusy: false,
                        data: null
                      };
                    }
                    return ticket;
                  })
                };
              }
              newTickets = [...newTickets, newTicketsDay];
            });
            return { ...doctor, tickets: newTickets };
          }
          return doctor;
        })
      };
    }
    case DIVIDE_TICKET_SCHEDULE: {
      return {
        ...state,
        data: state.data.map((doctor) => {
          if (+doctor.id === +payload.doctorID) {
            let newTickets = [];

            doctor.tickets.forEach((dayTickets) => {
              let newTicketsDay = dayTickets;
              if (moment(dayTickets.date).format('DD.MM.YYYY') === moment(payload.originalTicket.dateTicket).format('DD.MM.YYYY')) {
                newTicketsDay = {
                  ...newTicketsDay,
                  data: newTicketsDay.data.map((ticket) => {
                    if (+ticket.time[0] === +payload.originalTicket.time[0] && +ticket.time[1] === +payload.originalTicket.time[1]) {
                      return {
                        ...ticket,
                        parts: ticket.parts.length === 0 ? [...ticket.parts, ...payload.tickets] : payload.tickets.map((partTicket) => {
                          let newPartTicket;
                          ticket.parts.forEach((t) => {
                            if (+partTicket.id === +t.id) {
                              newPartTicket = t;
                            } else {
                              newPartTicket = partTicket;
                            }
                          });
                          return newPartTicket;
                        })
                      };
                    }
                    return ticket;
                  })
                };
              }
              newTickets = [...newTickets, newTicketsDay];
            });
            return { ...doctor, tickets: newTickets };
          }
          return doctor;
        })
      };
    }
    case REMOVE_DIVIDE_TICKET_SCHEDULE: {
      let newCreating = state.creating;
      if (
        state.creating !== null
        && +payload.doctorID === +newCreating.doctor.id
        && moment(+payload.ticket.dateTicket).format('DD.MM.YYYY') === moment(+newCreating.ticket.originalTicket.dateTicket).format('DD.MM.YYYY')
        && +payload.ticket.time[0] === +newCreating.ticket.originalTicket.time[0]
        && +payload.ticket.time[1] === +newCreating.ticket.originalTicket.time[1]
      ) {
        newCreating = {
          ...newCreating,
          ticket: {
            ...newCreating.ticket,
            originalTicket: {
              ...newCreating.ticket.originalTicket,
              parts: payload.ticket.parts
            }
          }
        };
      }
      return {
        ...state,
        creating: newCreating,
        data: state.data.map((doctor) => {
          if (+doctor.id === +payload.doctorID) {
            let newTickets = [];
            doctor.tickets.forEach((dayTickets) => {
              let newTicketsDay = dayTickets;
              if (moment(dayTickets.date).format('DD.MM.YYYY') === moment(payload.ticket.dateTicket).format('DD.MM.YYYY')) {
                newTicketsDay = {
                  ...newTicketsDay,
                  data: newTicketsDay.data.map((ticket) => {
                    if (+ticket.time[0] === +payload.ticket.time[0] && +ticket.time[1] === +payload.ticket.time[1]) {
                      if (payload.ticket.parts.length) {
                        let isFirst = false;
                        const partsTicket = ticket.parts.filter((t, i) => {
                          if (+t.id === payload.unsetData.id && i === 0) {
                            isFirst = true;
                          }
                          return +t.id !== payload.unsetData.id;
                        });
                        return {
                          ...ticket,
                          parts: partsTicket.map((partTicket) => {
                            let newPartTicket = partTicket;
                            payload.ticket.parts.forEach((t) => {
                              if (isFirst && +partTicket.time[0] !== +t.time[0] && +partTicket.time[1] === +t.time[1]) {
                                  newPartTicket = t;
                              } else if (!isFirst && +partTicket.time[0] === +t.time[0] && +partTicket.time[1] !== +t.time[1]) {
                                  newPartTicket = t;
                              }
                            });
                            return newPartTicket;
                          })
                        };
                      }
                      return {
                        ...ticket,
                        parts: payload.ticket.parts
                      };
                    }
                    return ticket;
                  })
                };
              }
              newTickets = [...newTickets, newTicketsDay];
            });
            return { ...doctor, tickets: newTickets };
          }
          return doctor;
        })
      };
    }
    case RETIME_TICKET_SCHEDULE: {
      return {
        ...state,
        data: state.data.map((doctor) => {
          if (+doctor.id === +payload.doctorID) {
            let newTickets = [];

            doctor.tickets.forEach((dayTickets) => {
              let newTicketsDay = dayTickets;
              if (moment(dayTickets.date).format('DD.MM.YYYY') === moment(payload.ticket.dateTicket).format('DD.MM.YYYY')) {
                newTicketsDay = {
                  ...newTicketsDay,
                  data: newTicketsDay.data.map((ticket) => {
                    if (+ticket.time[0] === +payload.ticket.time[0] && +ticket.time[1] === +payload.ticket.time[1]) {
                      return payload.ticket;
                    }
                    return ticket;
                  })
                };
              }
              newTickets = [...newTickets, newTicketsDay];
            });
            return { ...doctor, tickets: newTickets };
          }
          return doctor;
        })
      };
    }
    case SWITCH_HIDE_TICKET_SCHEDULE: {
      return {
        ...state,
        creating: state.creating ? ({
          ...state.creating,
          ticket: +state.creating.doctor.id === +payload.doctorID
                  && (+state.creating.ticket.time[0] === +payload.ticket.time[0] && +state.creating.ticket.time[1] === +payload.ticket.time[1])
                  && +state.creating.ticket.dateTicket === +payload.ticket.dateTicket ? ({
                    ...state.creating.ticket,
                    isHidden: !state.creating.ticket.isHidden
                  }) : state.creating.ticket
        }) : null,
        data: state.data.map((doctor) => {
          if (+doctor.id === +payload.doctorID) {
            let newTickets = [];

            doctor.tickets.forEach((dayTickets) => {
              let newTicketsDay = dayTickets;
              if (moment(dayTickets.date).format('DD.MM.YYYY') === moment(payload.ticket.dateTicket).format('DD.MM.YYYY')) {
                if (+payload.ticket.isPart) {
                  newTicketsDay = {
                    ...newTicketsDay,
                    data: newTicketsDay.data.map((ticket) => {
                      if (+ticket.time[0] === +payload.ticket.originalTicket.time[0] && +ticket.time[1] === +payload.ticket.originalTicket.time[1]) {
                        return {
                          ...ticket,
                          parts: ticket.parts.map((partTicket) => {
                            if (+partTicket.time[0] === +payload.ticket.time[0] && +partTicket.time[1] === +payload.ticket.time[1]) {
                              return {
                                ...partTicket,
                                isHidden: +payload.ticket.isHidden,
                                comment: payload.comment
                              };
                            }
                            return partTicket;
                          })
                        };
                      }
                      return ticket;
                    })
                  };
                } else {
                  newTicketsDay = {
                    ...newTicketsDay,
                    data: newTicketsDay.data.map((ticket) => {
                      if (+ticket.time[0] === +payload.ticket.time[0] && +ticket.time[1] === +payload.ticket.time[1]) {
                        return {
                          ...ticket,
                          isHidden: +payload.ticket.isHidden,
                          comment: payload.comment
                        };
                      }
                      return ticket;
                    })
                  };
                }
              }
              newTickets = [...newTickets, newTicketsDay];
            });
            return { ...doctor, tickets: newTickets };
          }
          return doctor;
        })
      };
    }
    default:
      return state;
  }
}
