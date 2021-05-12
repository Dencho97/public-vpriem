import React from 'react';
import PrivateRouter from '../../../components/PrivateRouter';
import { DICTIONARY_WORKERS_ROUTE } from '../../../constans/routes';
import WorkersPage from './workers';

export default [
  <PrivateRouter key={DICTIONARY_WORKERS_ROUTE} component={WorkersPage} path={DICTIONARY_WORKERS_ROUTE} permissions={['dictionary/workers']} />,
];
