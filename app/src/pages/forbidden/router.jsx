import React from 'react';
import { Route } from 'react-router-dom';
import { FORBIDDEN_ROUTE } from '../../constans/routes';
import ForbiddenPage from './forbidden';

export default [
  <Route key={FORBIDDEN_ROUTE} component={ForbiddenPage} exact path={FORBIDDEN_ROUTE} />,
];
