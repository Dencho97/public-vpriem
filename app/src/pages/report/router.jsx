import React from 'react';
import PrivateRouter from '../../components/PrivateRouter';
import { REPORT_ROUTE } from '../../constans/routes';
import ReportPage from './report';

export default [
  <PrivateRouter key={REPORT_ROUTE} component={ReportPage} exact path={REPORT_ROUTE} permissions={['pages/report']} />,
];
