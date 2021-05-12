import React from 'react';
import { Route } from 'react-router-dom';
import { NOT_FOUND_ROUTE } from '../../constans/routes';
import NotFoundPage from './404';

export default [
  <Route key={NOT_FOUND_ROUTE} component={NotFoundPage} exact path={NOT_FOUND_ROUTE} />,
];
