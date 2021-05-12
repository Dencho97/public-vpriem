import React from 'react';
import PrivateRouter from '../../components/PrivateRouter';
import { HELP_ROUTE } from '../../constans/routes';
import HelpPage from './help';

export default [
  <PrivateRouter key={HELP_ROUTE} component={HelpPage} exact path={HELP_ROUTE} />,
];
