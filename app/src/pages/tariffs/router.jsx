import React from 'react';
import PrivateRouter from '../../components/PrivateRouter';
import { TARIFFS_ROUTE } from '../../constans/routes';
import TariffsPage from './tariffs';

export default [
  <PrivateRouter key={TARIFFS_ROUTE} component={TariffsPage} exact path={TARIFFS_ROUTE} permissions={[]} />,
];
