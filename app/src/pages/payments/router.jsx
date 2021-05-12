import React from 'react';
import { Route } from 'react-router-dom';
import {
  PAYMENTS_REDIRECT_ROUTE,
  PAYMENTS_ERROR_ROUTE,
  PAYMENTS_SUCCESS_ROUTE,
  PAYMENTS_HISTORY_ROUTE
} from '../../constans/routes';
import PrivateRouter from '../../components/PrivateRouter';
import RedirectPage from './redirect';
import SuccessPage from './success';
import ErrorPage from './error';
import PaymentsHistoryPage from './history/history';

export default [
  <Route key={PAYMENTS_REDIRECT_ROUTE} component={RedirectPage} exact path={PAYMENTS_REDIRECT_ROUTE} />,
  <Route key={PAYMENTS_SUCCESS_ROUTE} component={SuccessPage} exact path={PAYMENTS_SUCCESS_ROUTE} />,
  <Route key={PAYMENTS_ERROR_ROUTE} component={ErrorPage} exact path={PAYMENTS_ERROR_ROUTE} />,
  <Route key={PAYMENTS_ERROR_ROUTE} component={ErrorPage} exact path={PAYMENTS_ERROR_ROUTE} />,
  <PrivateRouter key={PAYMENTS_HISTORY_ROUTE} component={PaymentsHistoryPage} path={PAYMENTS_HISTORY_ROUTE} permissions={['pages/payments/history']} />,
];
