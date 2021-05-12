import { SET_TUTORIAL } from './actions';

const localTutorial = localStorage.getItem('tutorial') ? JSON.parse(localStorage.getItem('tutorial')) : null;

const initialState = {
    active: localTutorial ? localTutorial.active : false,
    lastTutorial: localTutorial ? localTutorial.lastTutorial : null,
    tutorialsList: {
        start: {
            stepsEnabled: true,
            initialStep: 0,
            steps: [{
                    element: '.header__left_menu',
                    intro: 'Основное меню упраления расписанием.'
                },
                {
                    element: '.header__right_tariff',
                    intro: 'Тут отображется статус тарифа, сейчас у Вас пробный период. По нажатию на статус, Вы можете перейти к сетке тарифов.'
                },
                {
                    element: '.writes-notifications',
                    intro: 'Здесь Вы будете видеть оповещения о новых записях, чтобы ничего не пропустить.'
                },
                {
                    element: '.header__right_name',
                    intro: 'Меню пользователя. В нём можно заполнить информацию об организации, посмотреть доступные Вам тарифы, историю платежей, узнать о реферальной системе или связаться со службой поддержки.'
                },
                {
                    element: '.schedule__filter_show',
                    intro: 'Дополнительная фильтрация расписания.'
                },
                {
                    element: '.schedule__legend',
                    intro: 'Легенда расписания.'
                },
                {
                    element: '.app_schedule',
                    intro: 'Здесь будет отображаться расписание на сегодняшний день.'
                },
                {
                    element: '.route-dictionary',
                    intro: 'Отлично! Теперь добавим нового сотрудника в расписание. Выберите раздел "Сотрудники" в справочнике.'
                }
            ],
            hintsEnabled: false
        },
        addWorkers: {
            stepsEnabled: true,
            initialStep: 0,
            steps: [
                {
                    element: '.workers__items_add',
                    intro: 'Кнопка добавления нового сотрудника.'
                },
                {
                    element: '.worker-main-info',
                    intro: 'Заполните Ф.И.О. и загрузите фото сотрудника.'
                },
                {
                    element: '.worker-additional-info-type',
                    intro: 'Выберите тип персонала "Врач". Вы так же можете создать собственные типы персонала в справочнике'
                },
                {
                    element: '.worker-additional-info-services',
                    intro: 'Выберите список услуг, которые оказывает врач, например: "Кардиолог", "Хирург", "Терапевт". Вы так же можете создать собственные услуги в справочнике.'
                },
                {
                    element: '.worker-additional-info-filial',
                    intro: 'Создайте филиал в котором работает сотрудник, либо выберите уже ранее созданный филиал из справочника.'
                },
                {
                    element: '.workers-schedule-table__item__actions_add',
                    intro: 'Выберите дату, когда график работы вступает в силу. Укажите смены, интервалы приёма и по каким дням работает врач. Заполните необходимое колличество смен, и нажмите "Добавить сотрудника +". После врач будет доступен в расписании.'
                }
            ],
            hintsEnabled: false
        }
    }
};

export default function reduser(state = initialState, action) {
    const {
        type,
        payload
    } = action;

    switch (type) {
        case SET_TUTORIAL: {
            let tutorial = JSON.parse(localStorage.getItem('tutorial'));
            tutorial = {
                ...tutorial,
                active: payload.active,
                lastTutorial: payload.tutorial
            };
            localStorage.setItem('tutorial', JSON.stringify(tutorial));

            return {
                ...state,
                active: payload.active,
                lastTutorial: payload.tutorial
            };
        }
        default:
            return state;
    }
}
