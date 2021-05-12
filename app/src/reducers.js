import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { wsReducer } from './ws';
import { scheduleReducer } from './pages/schedule';
import { loginReducer } from './pages/login';
import { logReducer } from './pages/log';
import { reportReducer } from './pages/report';
import { writesReducer } from './pages/writes';
import { notificationReducer } from './components/WritesNotification';
import { settingsReducer } from './pages/settings/app';
import { settingsOrganizationReducer } from './pages/settings/organization';
import { tariffsReducer } from './pages/tariffs';
import { paymentsReducer } from './pages/payments';
import { referalsReducer } from './pages/referal';
import { helpReducer } from './pages/help';
import { tutorialReducer } from './components/Tutorial';
// Dictionary reducers
import { filialsReducer } from './pages/dictionary/filials';
import { usersReducer } from './pages/dictionary/users';
import { workersReducer } from './pages/dictionary/workers';
import { typesReducer } from './pages/dictionary/types';
import { servicesReducer } from './pages/dictionary/services';
import { rolesReducer } from './pages/dictionary/roles';


export default history => combineReducers({
  router: connectRouter(history),
  auth: loginReducer,
  schedule: scheduleReducer,
  filials: filialsReducer,
  users: usersReducer,
  workers: workersReducer,
  types: typesReducer,
  services: servicesReducer,
  roles: rolesReducer,
  log: logReducer,
  report: reportReducer,
  writes: writesReducer,
  ws: wsReducer,
  notifications: notificationReducer,
  settings: settingsReducer,
  organization: settingsOrganizationReducer,
  tariffs: tariffsReducer,
  payments: paymentsReducer,
  referals: referalsReducer,
  help: helpReducer,
  tutorial: tutorialReducer
});
