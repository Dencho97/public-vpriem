import React from 'react';
import PrivateRouter from '../../../components/PrivateRouter';
import { SETTINGS_ORGANIZATION_ROUTE } from '../../../constans/routes';
import SettingsOrganizationPage from './organization';

export default [
  <PrivateRouter key={SETTINGS_ORGANIZATION_ROUTE} component={SettingsOrganizationPage} exact path={SETTINGS_ORGANIZATION_ROUTE} permissions={['pages/settings/organization']} />,
];
