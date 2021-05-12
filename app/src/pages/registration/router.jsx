import React from 'react';
import { Route } from 'react-router-dom';
import { REGISTRATION_ROUTE } from '../../constans/routes';
import RegistrationPage from './registration';

export default [
  <Route key={REGISTRATION_ROUTE} component={RegistrationPage} exact path={REGISTRATION_ROUTE} />,
];
