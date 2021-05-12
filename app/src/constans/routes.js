/* eslint-disable import/prefer-default-export */
export const LOGIN_ROUTE = '/login';
export const REGISTRATION_ROUTE = '/registration';
export const RESET_PASSWORD_ROUTE = '/reset';
export const SCHEDULE_ROUTE = '/schedule';
export const LOG_ROUTE = '/log';
export const REPORT_ROUTE = '/report';
export const WRITES_ROUTE = '/writes';
export const FORBIDDEN_ROUTE = '/403';
export const NOT_FOUND_ROUTE = '/404';
export const SETTINGS_APP_ROUTE = '/settings/app';
export const SETTINGS_ORGANIZATION_ROUTE = '/settings/organization';
export const TARIFFS_ROUTE = '/tariffs';
export const PAYMENTS_REDIRECT_ROUTE = '/payments/redirect';
export const PAYMENTS_SUCCESS_ROUTE = '/payments/success';
export const PAYMENTS_ERROR_ROUTE = '/payments/error';
export const PAYMENTS_HISTORY_ROUTE = '/payments/history';
export const REFERAL_ROUTE = '/referal';
export const HELP_ROUTE = '/help';
// DICTIONARY
export const DICTIONARY_USERS_ROUTE = '/dictionary/users';
export const DICTIONARY_WORKERS_ROUTE = '/dictionary/workers';
export const DICTIONARY_FILIALS_ROUTE = '/dictionary/filials';
export const DICTIONARY_TYPES_ROUTE = '/dictionary/types';
export const DICTIONARY_SERVICES_ROUTE = '/dictionary/services';
export const DICTIONARY_ROLES_ROUTE = '/dictionary/roles';

export const ROUTERS_MENU_MAP = {
    [SCHEDULE_ROUTE]: {
        permissions: [],
        public: true,
        name: 'Расписание',
        icon: 'read',
        childrens: null,
        selector: 'route-schedule'
    },
    [WRITES_ROUTE]: {
        permissions: [],
        public: true,
        name: 'Записи',
        icon: 'edit',
        childrens: null,
        selector: 'route-writes'
    },
    '/dictionary': {
        name: 'Справочник',
        icon: 'database',
        selector: 'route-dictionary',
        childrens: {
            [DICTIONARY_USERS_ROUTE]: {
                permissions: ['dictionary/users'],
                public: true,
                name: 'Пользователи',
                icon: 'user',
                selector: 'route-dictionary-users'
            },
            [DICTIONARY_ROLES_ROUTE]: {
                permissions: ['dictionary/roles'],
                public: true,
                name: 'Роли',
                icon: 'team',
                selector: 'route-dictionary-roles'
            },
            [DICTIONARY_WORKERS_ROUTE]: {
                permissions: ['dictionary/workers'],
                public: true,
                name: 'Сотрудники',
                icon: 'solution',
                selector: 'route-dictionary-workers'
            },
            [DICTIONARY_TYPES_ROUTE]: {
                permissions: ['dictionary/types'],
                public: true,
                name: 'Типы персонала',
                icon: 'profile',
                selector: 'route-dictionary-types'
            },
            [DICTIONARY_SERVICES_ROUTE]: {
                permissions: ['dictionary/services'],
                public: true,
                name: 'Услуги',
                icon: 'bars',
                selector: 'route-dictionary-services'
            },
            [DICTIONARY_FILIALS_ROUTE]: {
                permissions: ['dictionary/filials'],
                public: true,
                name: 'Филиалы',
                icon: 'bank',
                selector: 'route-dictionary-filials'
            }
        }
    },
    [REPORT_ROUTE]: {
        permissions: ['pages/report'],
        public: true,
        name: 'Отчёты',
        icon: 'area-chart',
        childrens: null,
        selector: 'route-report'
    },
    [LOG_ROUTE]: {
        permissions: ['pages/log'],
        public: false,
        name: 'Лог действий',
        icon: 'notification',
        childrens: null,
        selector: 'route-log'
    },
    [SETTINGS_APP_ROUTE]: {
        permissions: ['pages/settings/app'],
        public: false,
        name: 'Настройки',
        icon: 'setting',
        childrens: null,
        selector: 'route-settings'
    }
};
