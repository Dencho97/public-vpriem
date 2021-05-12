import React from 'react';
import { Route } from 'react-router-dom';
import { RESET_PASSWORD_ROUTE } from '../../constans/routes';
import ResetPasswordPage from './reset-password';

export default [
  <Route key={RESET_PASSWORD_ROUTE} component={ResetPasswordPage} exact path={RESET_PASSWORD_ROUTE} />,
];
