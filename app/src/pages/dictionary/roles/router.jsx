import React from 'react';
import PrivateRouter from '../../../components/PrivateRouter';
import { DICTIONARY_ROLES_ROUTE } from '../../../constans/routes';
import RolesPage from './roles';

export default [
  <PrivateRouter key={DICTIONARY_ROLES_ROUTE} component={RolesPage} path={DICTIONARY_ROLES_ROUTE} permissions={['dictionary/roles']} />,
];
