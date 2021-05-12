import React from 'react';
import { Route } from 'react-router-dom';
import { LOGIN_ROUTE } from '../../constans/routes';
import LoginPage from './login';

export default [
  <Route key={LOGIN_ROUTE} component={LoginPage} exact path={LOGIN_ROUTE} />,
];
