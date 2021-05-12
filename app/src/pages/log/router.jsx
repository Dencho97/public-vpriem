import React from 'react';
import PrivateRouter from '../../components/PrivateRouter';
import { LOG_ROUTE } from '../../constans/routes';
import LogPage from './log';

export default [
  <PrivateRouter key={LOG_ROUTE} component={LogPage} exact path={LOG_ROUTE} permissions={['pages/log']} />,
];
