import React from 'react';
import { REFERAL_ROUTE } from '../../constans/routes';
import PrivateRouter from '../../components/PrivateRouter';
import ReferalPage from './referal';

export default [
  <PrivateRouter key={REFERAL_ROUTE} component={ReferalPage} path={REFERAL_ROUTE} permissions={['pages/referal']} />,
];
