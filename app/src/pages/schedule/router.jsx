import React from 'react';
import PrivateRouter from '../../components/PrivateRouter';
import { SCHEDULE_ROUTE } from '../../constans/routes';
import SchedulePage from './schedule';

export default [
  <PrivateRouter key={SCHEDULE_ROUTE} component={SchedulePage} path={SCHEDULE_ROUTE} />,
];
