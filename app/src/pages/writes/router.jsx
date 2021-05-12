import React from 'react';
import PrivateRouter from '../../components/PrivateRouter';
import { WRITES_ROUTE } from '../../constans/routes';
import WritesPage from './writes';

export default [
  <PrivateRouter key={WRITES_ROUTE} component={WritesPage} exact path={WRITES_ROUTE} />,
];
