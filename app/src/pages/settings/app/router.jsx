import React from 'react';
import PrivateRouter from '../../../components/PrivateRouter';
import { SETTINGS_APP_ROUTE } from '../../../constans/routes';
import SettingsAppPage from './settings';

export default [
  <PrivateRouter key={SETTINGS_APP_ROUTE} component={SettingsAppPage} exact path={SETTINGS_APP_ROUTE} permissions={['pages/settings/app']} />,
];
