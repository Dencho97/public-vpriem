import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './store';

import { scheduleRouter } from './pages/schedule';
import { loginRouter } from './pages/login';
import { registrationRouter } from './pages/registration';
import { resetPasswordRouter } from './pages/reset';
import { logRouter } from './pages/log';
import { reportRouter } from './pages/report';
import { writesRouter } from './pages/writes';
import { settingsRouter } from './pages/settings/app';
import { settingsOrganizationRouter } from './pages/settings/organization';
import { forbiddenRouter } from './pages/forbidden';
import { notFoundRouter } from './pages/404';
import { tariffsRouter } from './pages/tariffs';
import { paymentsRouters } from './pages/payments';
import { referalsRouters } from './pages/referal';
import { helpRouter } from './pages/help';
// Dictionary routes
import { filialsRouter } from './pages/dictionary/filials';
import { usersRouter } from './pages/dictionary/users';
import { workersRouter } from './pages/dictionary/workers';
import { typesRouter } from './pages/dictionary/types';
import { servicesRouter } from './pages/dictionary/services';
import { rolesRouter } from './pages/dictionary/roles';
import { SCHEDULE_ROUTE } from './constans/routes';

export default (
  <ConnectedRouter history={history}>
    <Switch>
      <Route exact path="/">
        <Redirect to={SCHEDULE_ROUTE} />
      </Route>
      { loginRouter }
      { registrationRouter }
      { resetPasswordRouter }
      { scheduleRouter }
      { filialsRouter }
      { usersRouter }
      { workersRouter }
      { typesRouter }
      { servicesRouter }
      { rolesRouter }
      { logRouter }
      { reportRouter }
      { writesRouter }
      { settingsRouter }
      { settingsOrganizationRouter }
      { tariffsRouter }
      { paymentsRouters }
      { referalsRouters }
      { helpRouter }
      { forbiddenRouter }
      { notFoundRouter }
      <Redirect to="/404" />
    </Switch>
  </ConnectedRouter>
);
