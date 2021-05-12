import React from 'react';
import PrivateRouter from '../../../components/PrivateRouter';
import { DICTIONARY_SERVICES_ROUTE } from '../../../constans/routes';
import ServicesPage from './services';

export default [
  <PrivateRouter key={DICTIONARY_SERVICES_ROUTE} component={ServicesPage} path={DICTIONARY_SERVICES_ROUTE} permissions={['dictionary/services']} />,
];
